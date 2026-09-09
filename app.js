const PROJECT='the-chakna-point';
const SHOP={lat:21.552475,lon:86.859179};
const products=[['Chicken Kasa',70],['Chicken Pakoda',70],['Chicken Liver',70],['Egg Omelette',50],['Egg Chop',40],['Mutton',80],['Sprite',20],['Thums Up',20],['Water Bottle',20],['Kurkure Legs',20]];
let cart={}; let coords=null;
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll('.screen').forEach(x=>x.hidden=true);$(id).hidden=false}
function add(i){cart[i]=(cart[i]||0)+1;renderCartBar()}
function change(i,d){cart[i]=(cart[i]||0)+d;if(cart[i]<=0)delete cart[i];renderCart();renderCartBar()}
function distanceKm(a,b,c,d){const R=6371,rad=x=>x*Math.PI/180,da=rad(c-a),db=rad(d-b);const q=Math.sin(da/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(db/2)**2;return 2*R*Math.asin(Math.sqrt(q))}
function totals(){const sub=Object.entries(cart).reduce((s,[i,q])=>s+products[i][1]*q,0);let delivery=sub?30:0;if(sub&&coords&&distanceKm(SHOP.lat,SHOP.lon,coords.lat,coords.lon)>5)delivery=40;return{sub,delivery,total:sub+delivery}}
function renderCartBar(){const n=Object.values(cart).reduce((a,b)=>a+b,0),t=totals();$('cartCount').textContent=n;$('cartTotal').textContent=t.total}
function renderCart(){const rows=Object.entries(cart).map(([i,q])=>`<div class="cart-row"><span>${products[i][0]}<br>₹${products[i][1]} × ${q}</span><span class="qty"><button onclick="change(${i},-1)">−</button><b>${q}</b><button onclick="change(${i},1)">+</button></span></div>`).join('');$('cartItems').innerHTML=rows||'<p>Your cart is empty.</p>';const t=totals();$('subtotal').textContent='₹'+t.sub;$('delivery').textContent='₹'+t.delivery;$('grandTotal').textContent='₹'+t.total}
function fsValue(v){if(typeof v==='number')return {integerValue:String(v)};return {stringValue:String(v)}}
async function saveOrder(order){const fields={};for(const[k,v]of Object.entries(order)){if(k==='items')fields[k]={arrayValue:{values:v.map(x=>({mapValue:{fields:{name:fsValue(x.name),price:fsValue(x.price),quantity:fsValue(x.quantity)}}}))}};else fields[k]=fsValue(v)}const url=`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/orders`;const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields})});if(!r.ok)throw new Error('Order save failed. Please try again.');return r.json()}
$('openCart').onclick=()=>{renderCart();show('cart')};$('backHome').onclick=()=>show('home');$('continue').onclick=()=>{cart={};renderCartBar();show('home')};
$('locationBtn').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{coords={lat:p.coords.latitude,lon:p.coords.longitude};$('address').value=`Current location: ${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`;renderCart()},()=>alert('Location permission nahi mila.')):alert('Location supported nahi hai.');
$('placeOrder').onclick=async()=>{try{const t=totals();if(!t.sub)throw Error('Cart empty.');const name=$('name').value.trim(),address=$('address').value.trim();if(!name||!address)throw Error('Name aur address bhariye.');$('orderMsg').textContent='Placing order...';const items=Object.entries(cart).map(([i,q])=>({name:products[i][0],price:products[i][1],quantity:q}));await saveOrder({name,address,items,subtotal:t.sub,deliveryCharge:t.delivery,total:t.total,payment:$('payment').value,paymentStatus:'Pending',status:'New',createdAt:new Date().toISOString()});$('orderMsg').textContent='';show('success')}catch(e){console.error(e);$('orderMsg').textContent=e.message}};
renderCartBar();
