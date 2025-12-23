
const API_PRODUCTS = "http://localhost:5000/api/products";
const API_USERS = "http://localhost:5000/api/users";
const API_ORDERS = "http://localhost:5000/api/orders";


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("user"));


document.addEventListener("DOMContentLoaded", () => {
  handleNavbar();
  handleAdminUI();
  loadProducts();
  loadCart();
  loadProductDetails();
});


function handleNavbar() {
  const userInfo = document.getElementById("userInfo");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    if (userInfo) userInfo.innerText = `Hi, ${user.username}`;
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}


function handleAdminUI() {
  const adminSection = document.getElementById("adminSection");
  const addProductBtn = document.getElementById("addProductBtn");

  if (user && user.role === "admin") {
    if (addProductBtn) addProductBtn.style.display = "inline-block";
  } else {
    if (addProductBtn) addProductBtn.style.display = "none";
    if (adminSection) adminSection.style.display = "none";
  }
}

function toggleAdminPanel() {
  const adminSection = document.getElementById("adminSection");
  adminSection.style.display =
    adminSection.style.display === "block" ? "none" : "block";
}


function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  window.location.href = "login.html";
}


function addProduct() {
  const name = document.getElementById("pname")?.value.trim();
  const price = document.getElementById("pprice")?.value.trim();
  const image = document.getElementById("pimage")?.value.trim();
  const description = document.getElementById("pdesc")?.value.trim();

  if (!name || !price || !image || !description) {
    alert("All fields are required");
    return;
  }

  fetch(`${API_PRODUCTS}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, image, description })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Product added successfully");
      document.getElementById("adminSection").style.display = "none";
      loadProducts(); // reload products without refresh
    })
    .catch(() => alert("Server error"));
}


function loadProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;

  fetch(API_PRODUCTS)
    .then(res => res.json())
    .then(products => {
      productList.innerHTML = products.map(p => `
        <div class="card">
          <img src="${p.image}" class="product-img" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">₹${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      `).join("");
    });
}


function loadProductDetails() {
  const details = document.getElementById("productDetails");
  if (!details) return;

  const id = new URLSearchParams(window.location.search).get("id");

  fetch(`${API_PRODUCTS}/${id}`)
    .then(res => res.json())
    .then(p => {
      details.innerHTML = `
        <img src="${p.image}" class="product-img">
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <p class="price">₹${p.price}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>
          Add to Cart
        </button>
      `;
    });
}


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find(p => p._id === product._id);

  if (exists) {
    exists.quantity += 1;
  } else {
    cart.push({
      _id: product._id,           
      name: product.name,
      price: product.price,
      image: product.image || "",
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart");
}


function loadCart() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  cartItems.innerHTML =
    cart.length === 0
      ? "<p>Your cart is empty</p>"
      : cart.map(p => `
          <p>${p.name} × ${p.quantity} — ₹${p.price * p.quantity}</p>
        `).join("");
}


function placeOrder() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!user || !user._id) {
    alert("Please login to place order");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }


  const products = cart.map(item => ({
    _id: item._id,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    image: item.image || ""
  }));

  const totalAmount = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  console.log("SENDING ORDER:", {
    userId: user._id,
    products,
    totalAmount
  });

  fetch("http://localhost:5000/api/orders/place", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,   // 🔥 MUST be _id
      products,
      totalAmount
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.orderId) {
        alert("Order placed successfully!\nOrder ID: " + data.orderId);
        localStorage.removeItem("cart");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Order failed");
      }
    })
    .catch(err => {
      console.error("ORDER ERROR:", err);
      alert("Order failed");
    });
}


function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_USERS}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
      } else {
        document.getElementById("msg").innerText = data.message;
      }
    });
}


function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_USERS}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
      } else {
        document.getElementById("msg").innerText = data.message;
      }
    });
}
