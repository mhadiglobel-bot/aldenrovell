export type GalleryImage={src:string;alt:string;role:string};
export type Product={id:string;slug:string;title:string;category:string;shortDescription:string;description:string;features:string[];reviewNote:string;sku:string;seoTitle:string;metaDescription:string;images:GalleryImage[];pricePkr:number|null;stock:number|null;published:boolean;imagesApproved:boolean;salesUnitVerified:boolean};
export type CartItem={id:string;quantity:number};
export type StoreSettings={codEnabled:boolean;shippingFeePkr:number|null;notice:string|null};
export const formatPrice=(n:number|null)=> n===null?'Price pending':`Rs. ${n.toLocaleString('en-PK')}`;
export const canPurchase=(p:Product)=>p.published&&p.imagesApproved&&p.salesUnitVerified&&p.pricePkr!==null&&p.stock!==null&&p.stock>0;
