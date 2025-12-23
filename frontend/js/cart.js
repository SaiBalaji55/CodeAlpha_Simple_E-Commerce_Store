const API_ORDERS = "http://localhost:5000/api/orders";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("user"));

const cartItems = document.getElementById("cartItems");

/* ======================
   LOAD CART
====================== */
function loadCart() {
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-card">
      <img src="${item.image}" />
      <div>
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    </div>
  `).join("");
}

/* ======================
   REMOVE ITEM
====================== */
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

/* ======================
   PLACE ORDER
====================== */
function placeOrder() {
  if (!user) {
    alert("Please login to place order");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price), 0
  );

  fetch(`${API_ORDERS}/place`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,   // ✅ FIXED
      products: cart,
      totalAmount
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    })
    .catch(err => {
      console.error(err);
      alert("Order failed");
    });
  console.log("ORDER DATA:", {
  userId: user._id,
  products: cart,
  totalAmount
});

}

loadCart();
