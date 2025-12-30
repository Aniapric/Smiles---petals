const cartContainer = document.getElementById("cartContainer");
const cartInfo = document.getElementById("Cart-info");
const checkoutBtn = document.getElementById("checkoutBtn");

const emptyMsg = document.getElementById("emptyCartMsg");

const totalItemsEl = document.getElementById("totalItems");
const deliveryFeeEl = document.getElementById("deliveryFees");
const totalPriceEl = document.getElementById("totalPrice");

const DELIVERY_FEE = 16;

function readCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatEUR(x) {
  return "€" + Number(x).toFixed(2);
}

function renderCart() {
  const cart = readCart();
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    // cart gol
    emptyMsg.style.display = "block";
    cartInfo.style.display = "none";
    checkoutBtn.disabled = true;

    document.body.classList.add("cart-empty");

    totalItemsEl.textContent = "";
    deliveryFeeEl.textContent = "";
    totalPriceEl.textContent = "";
    return;
  }

  // cart NU e gol
  emptyMsg.style.display = "none";
  cartInfo.style.display = "block";
  checkoutBtn.disabled = false;

  // scot clasa
  document.body.classList.remove("cart-empty");

  let itemsTotal = 0;

  cart.forEach(function (item) {
    const div = document.createElement("div");

    const price = Number(item.price);
    const qty = Number(item.qty ?? item.quantity ?? 1);
    itemsTotal += price * qty;

    div.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>Price: €${price.toFixed(2)}</p>
      <p>Quantity: ${qty}</p>
      <hr>
    `;

    cartContainer.appendChild(div);
  });

  const shippingCost = itemsTotal > 0 ? 16 : 0;
  const grandTotal = itemsTotal + shippingCost;

  totalItemsEl.textContent = "Total items: €" + itemsTotal.toFixed(2);
  deliveryFeeEl.textContent = "Delivery fee: €" + shippingCost.toFixed(2);
  totalPriceEl.textContent = "Total: €" + grandTotal.toFixed(2);
}


renderCart();

checkoutBtn.addEventListener("click", handleCheckout);

function handleCheckout() {
  const cart = readCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  placeOrder(user, cart);
}

function placeOrder(user, cart) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = {
    id: Math.floor(Math.random() * 100000),
    userEmail: user.email,
    items: cart,
    date: new Date().toLocaleString(),
    status: "In preparation"
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // golim cart-ul
  saveCart([]);

  alert("Order placed successfully!");

  renderCart();
}
