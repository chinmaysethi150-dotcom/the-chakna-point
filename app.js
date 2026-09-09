const firebaseConfig={apiKey:"AIzaSyDMBWthbJXYQgFajXqC56NM0jyYS5i9JRk",authDomain:"the-chakna-point.firebaseapp.com",projectId:"the-chakna-point",storageBucket:"the-chakna-point.firebasestorage.app",messagingSenderId:"364742522195",appId:"1:364742522195:web:c38935e8f142a6d5a91da6",measurementId:"G-XLZ1452CQ7"};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth(), db=firebase.firestore();
const products=[["Chicken Kasa",70],["Chicken Pakoda",70],["Chicken Liver",70],["Egg Omelette",50],["Egg Chop",40],["Mutton",80],["Sprite",20],["Thums Up",20],["Water Bottle",20],["Kurkure Legs",20],["Cigarette Packet",0]];
let cart={};
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(x=>x.hidden=true);$(id).hidden=false}
function renderMenu(){ $("menu").innerHTML=products.map((p,i)=>`<div class="item"><h3>${p[0]}</h3><div class="price">${p[1]?"₹"+p[1]:"Price on request"}</div>${p[1]?`<button class="add" onclick="add(${i})">Add</button>`:""}</div>`).join("")}
function add(i){cart[i]=(cart[i]||0)+1;renderCartBar()}
function change(i,d){cart[i]=(cart[i]||0)+d;if(cart[i]<=0)delete cart[i];renderCart()}
function totals(){let sub=Object.entries(cart).reduce((s,[i,q])=>s+products[i][1]*q,0);let delivery=sub?30:0;return{sub,delivery,total:sub+delivery}}
function renderCartBar(){let n=Object.values(cart).reduce((a,b)=>a+b,0),t=totals();$("cartCount").textContent=n;$("cartTotal").textContent=t.total}
function renderCart(){let rows=Object.entries(cart).map(([i,q])=>`<div class="cart-row"><span>${products[i][0]}<br>₹${products[i][1]} × ${q}</span><span class="qty"><button onclick="change(${i},-1)">−</button><b>${q}</b><button onclick="change(${i},1)">+</button></span></div>`).join("");$("cartItems").innerHTML=rows||"<p>Your cart is empty.</p>";let t=totals();$("subtotal").textContent="₹"+t.sub;$("delivery").textContent="₹"+t.delivery;$("grandTotal").textContent="₹"+t.total}

// No mobile number or SMS/OTP is required. Customers use Firebase Anonymous Auth.
async function startApp(){
  try{
    if(!auth.currentUser) await auth.signInAnonymously();
  }catch(e){
    console.error(e);
    alert(e.message||"Unable to start the app.");
  }
}
startApp();

$("openCart").onclick=()=>{renderCart();show("cart")};
$("backHome").onclick=()=>show("home");
$("continue").onclick=()=>{cart={};renderCartBar();show("home")};
$("locationBtn").onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{$("address").value=`Current location: ${p.coords.latitude}, ${p.coords.longitude}`},()=>alert("Location permission nahi mila.")):alert("Location supported nahi hai.");
$("placeOrder").onclick=async()=>{try{if(!auth.currentUser)throw Error("Please login again.");let t=totals();if(!t.sub)throw Error("Cart empty.");let name=$("name").value.trim(),address=$("address").value.trim();if(!name||!address)throw Error("Name aur address bhariye.");$("orderMsg").textContent="Placing order...";let items=Object.entries(cart).map(([i,q])=>({name:products[i][0],price:products[i][1],quantity:q}));await db.collection("orders").add({customerUid:auth.currentUser.uid,name,address,items,subtotal:t.sub,deliveryCharge:t.delivery,total:t.total,payment:$("payment").value,paymentStatus:"Pending",status:"New",createdAt:firebase.firestore.FieldValue.serverTimestamp()});$("orderMsg").textContent="";show("success")}catch(e){$("orderMsg").textContent=e.message}};
auth.onAuthStateChanged(u=>{if(u){show("home");renderMenu()}});
renderCartBar();
