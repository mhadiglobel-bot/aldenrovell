import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePkPhone,validateOrderPayload} from '../src/lib/validate.ts';
const valid={customer:{name:'Example Customer',phone:'03001234567',city:'Karachi',province:'Sindh',address:'House 15, Example Road, Karachi',notes:''},items:[{id:'P01',quantity:1}],idempotencyKey:'fd0bdab2-5485-4582-824c-0a0c54e019a1'};
test('accepts Pakistani mobile numbers',()=>{assert.equal(validatePkPhone('03001234567'),true);assert.equal(validatePkPhone('+923001234567'),true);assert.equal(validatePkPhone('0300-1234567'),true);});
test('rejects invalid mobile numbers',()=>{assert.equal(validatePkPhone('123'),false);assert.equal(validatePkPhone('0213314567'),false);});
test('accepts legitimate order request',()=>{const v=validateOrderPayload(valid);assert.equal(v.ok,true);if(v.ok)assert.equal(v.value.items[0].id,'P01');});
test('rejects duplicate cart lines',()=>{assert.equal(validateOrderPayload({...valid,items:[{id:'P01',quantity:1},{id:'P01',quantity:1}]}).ok,false);});
test('rejects negative, fractional and excessive quantities',()=>{for(const q of [-1,0,1.5,11])assert.equal(validateOrderPayload({...valid,items:[{id:'P01',quantity:q}]}).ok,false);});
test('rejects unrecognized IDs and missing order token',()=>{assert.equal(validateOrderPayload({...valid,items:[{id:'P99',quantity:1}]}).ok,false);assert.equal(validateOrderPayload({...valid,idempotencyKey:'123'}).ok,false);});
test('normalizes allowed spaces in phone before database validation',()=>{const result=validateOrderPayload({...valid,customer:{...valid.customer,phone:'0300 1234567'}});assert.equal(result.ok,true);if(result.ok)assert.equal(result.value.customer.phone,'03001234567');});

test('rejects malformed and non-numeric cart quantities without throwing',()=>{
 for(const quantity of [null,'2',undefined,{},[],true]){
  assert.equal(validateOrderPayload({...valid,items:[{id:'P01',quantity}]}).ok,false);
 }
});
test('rejects non-object cart entries without throwing',()=>{
 for(const entry of [null,undefined,5,'bad',[]]){
  assert.equal(validateOrderPayload({...valid,items:[entry]}).ok,false);
 }
});
