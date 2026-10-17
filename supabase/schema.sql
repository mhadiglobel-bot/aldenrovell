-- ALDEN ROVELL: Run ONCE in Supabase SQL Editor. Requires pgcrypto (Supabase provides it).
-- Only server-side service role may read customer orders or change product prices.
create table if not exists public.store_products (
 id text primary key check (id ~ '^P0[1-4]$'),
 price_pkr integer check(price_pkr between 0 and 100000000),
 stock integer check(stock between 0 and 100000000),
 is_published boolean not null default false,
 images_approved boolean not null default false,
 sales_unit_verified boolean not null default false,
 updated_at timestamptz not null default now(),
 constraint publish_guard check(not is_published or(price_pkr is not null and stock is not null and images_approved and sales_unit_verified))
);
insert into public.store_products(id) values ('P01'),('P02'),('P03'),('P04') on conflict do nothing;
create table if not exists public.store_settings (
 id integer primary key check(id=1),
 cod_enabled boolean not null default false,
 shipping_fee_pkr integer check(shipping_fee_pkr between 0 and 100000),
 notice text,
 constraint shipping_guard check(not cod_enabled or shipping_fee_pkr is not null)
);
insert into public.store_settings (id) values(1) on conflict do nothing;
create table if not exists public.store_orders (
 id uuid primary key default gen_random_uuid(),
 reference text not null unique,
 idempotency uuid not null unique,
 customer_name text not null,
 phone text not null,
 city text not null,
 province text not null,
 address text not null,
 notes text not null default '',
 items jsonb not null,
 subtotal_pkr integer not null,
 shipping_pkr integer not null,
 total_pkr integer not null,
 status text not null default 'pending_confirmation' check(status in ('pending_confirmation','confirmed','shipped','completed','canceled')),
 created_at timestamptz not null default now()
);
create index if not exists store_orders_created_idx on public.store_orders(created_at desc);
alter table public.store_products enable row level security;
alter table public.store_settings enable row level security;
alter table public.store_orders enable row level security;
revoke all on public.store_products, public.store_settings, public.store_orders from anon, authenticated;
grant all on public.store_products, public.store_settings, public.store_orders to service_role;

create or replace function public.place_cod_order(p_customer jsonb,p_lines jsonb,p_idempotency uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
 cfg public.store_settings%rowtype;
 existing public.store_orders%rowtype;
 row_item jsonb;
 prod public.store_products%rowtype;
 qty integer;
 subtotal integer:=0;
 items_out jsonb:='[]'::jsonb;
 order_id uuid:=gen_random_uuid();
 ref text;
 i integer:=0;
 begin
 if auth.role() <> 'service_role' then raise exception 'Forbidden';end if;
 if p_idempotency is null then raise exception 'Missing idempotency';end if;
 select * into existing from public.store_orders where idempotency=p_idempotency;
 if found then return jsonb_build_object('reference',existing.reference,'total_pkr',existing.total_pkr,'shipping_pkr',existing.shipping_pkr,'already_received',true);end if;
 select * into cfg from public.store_settings where id=1;
 if not found or not cfg.cod_enabled or cfg.shipping_fee_pkr is null then raise exception 'COD disabled';end if;
 if jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines)<1 or jsonb_array_length(p_lines)>15 then raise exception 'Invalid cart';end if;
 if length(p_customer->>'name') not between 2 and 100 or length(p_customer->>'address') not between 10 and 350 then raise exception 'Invalid delivery details';end if;
 if (p_customer->>'phone') !~ '^((\+92|0)3[0-9]{9})$' then raise exception 'Invalid phone';end if;
 if length(p_customer->>'city') not between 2 and 80 or length(p_customer->>'province') not between 2 and 80 or length(coalesce(p_customer->>'notes',''))>400 then raise exception 'Invalid address';end if;
 for row_item in select value from jsonb_array_elements(p_lines) order by value->>'id' loop
   i:=i+1;
   if (row_item->>'quantity') !~ '^[0-9]{1,2}$' then raise exception 'Invalid quantity';end if;
   qty:=(row_item->>'quantity')::int;
   if qty<1 or qty>10 then raise exception 'Quantity out of range';end if;
   select * into prod from public.store_products where id=(row_item->>'id') for update;
   if not found or not prod.is_published or not prod.images_approved or not prod.sales_unit_verified or prod.price_pkr is null or prod.stock is null or prod.stock<qty then raise exception 'Item unavailable';end if;
   if exists(select 1 from jsonb_array_elements(items_out) x where x->>'id'=prod.id) then raise exception 'Duplicate items';end if;
   subtotal:=subtotal+prod.price_pkr*qty;
   if subtotal>100000000 then raise exception 'Order exceeds maximum';end if;
   items_out:=items_out||jsonb_build_array(jsonb_build_object('id',prod.id,'quantity',qty,'unit_price_pkr',prod.price_pkr));
   update public.store_products set stock=stock-qty,updated_at=now() where id=prod.id;
 end loop;
 ref:='AR-'||upper(substr(replace(order_id::text,'-',''),1,10));
 insert into public.store_orders(id,reference,idempotency,customer_name,phone,city,province,address,notes,items,subtotal_pkr,shipping_pkr,total_pkr)
 values(order_id,ref,p_idempotency,p_customer->>'name',p_customer->>'phone',p_customer->>'city',p_customer->>'province',p_customer->>'address',coalesce(p_customer->>'notes',''),items_out,subtotal,cfg.shipping_fee_pkr,subtotal+cfg.shipping_fee_pkr);
 return jsonb_build_object('reference',ref,'total_pkr',subtotal+cfg.shipping_fee_pkr,'shipping_pkr',cfg.shipping_fee_pkr,'already_received',false);
end $$;
revoke all on function public.place_cod_order(jsonb,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.place_cod_order(jsonb,jsonb,uuid) to service_role;

create or replace function public.admin_set_order_status(p_order_id uuid,p_status text)
returns void language plpgsql security definer set search_path = public,pg_temp as $$
declare o public.store_orders%rowtype; itm jsonb;
begin
 if auth.role()<>'service_role' then raise exception 'Forbidden';end if;
 select * into o from public.store_orders where id=p_order_id for update;
 if not found then raise exception 'Missing order';end if;
 if p_status not in ('confirmed','shipped','completed','canceled') then raise exception 'Invalid status';end if;
 if o.status='canceled' and p_status <> 'canceled' then raise exception 'Canceled order cannot be reopened';end if;
 if o.status='completed' and p_status <> 'completed' then raise exception 'Completed order is locked';end if;
 if o.status='shipped' and p_status='canceled' then raise exception 'Handle shipped returns manually';end if;
 if p_status='canceled' and o.status<>'canceled' then
  for itm in select value from jsonb_array_elements(o.items) loop
    update public.store_products set stock=stock+(itm->>'quantity')::int where id=itm->>'id';
  end loop;
 end if;
 update public.store_orders set status=p_status where id=p_order_id;
end $$;
revoke all on function public.admin_set_order_status(uuid,text) from public,anon,authenticated;
grant execute on function public.admin_set_order_status(uuid,text) to service_role;
