let cart = [];

async function loadProducts() {
  const response = await fetch("http://localhost:3000/products");
  const products = await response.json();

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
    `;
    productsDiv.appendChild(div);
  });
}

function addToCart(productId, name, price) {
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ productId, name, price, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = "";

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p>${item.name} (x${item.quantity}) - $${item.price * item.quantity}</p>
      <button onclick="removeFromCart('${item.productId}')">Remove</button>
    `;
    cartDiv.appendChild(div);
  });
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  updateCart();
}

async function placeOrder() {
  const response = await fetch("http://localhost:3000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart }),
  });
  const data = await response.json();
  alert(data.message);
  cart = [];
  updateCart();
}

// Load products on page load
loadProducts();

