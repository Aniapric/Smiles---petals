const box = document.getElementById("accountBox");

function readCurrentUser(){
  return JSON.parse(localStorage.getItem("currentUser"));
}

function readOrders(){
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function logout(){
  localStorage.removeItem("currentUser");
  renderAccount();
}

function renderLoggedOut(){
  box.innerHTML = `
    <h2 class="section-title">You are not logged in.</h2>
    <hr class="hr-soft">
    <p class="notice">Please login to see your details and orders.</p>
    <a class="btn" href="login.html">Go to Login</a>
  `;
}

function renderLoggedIn(user){
  const orders = readOrders().filter(o => o.userEmail === user.email);

  const detailsHtml = `
    <h2 class="section-title">Your details</h2>
    <hr class="hr-soft">

    <div class="grid">
      <div class="field"><b>Name</b><span>${user.name || "-"}</span></div>
      <div class="field"><b>Email</b><span>${user.email || "-"}</span></div>
      <div class="field"><b>Country</b><span>${user.country || "-"}</span></div>
      <div class="field"><b>County</b><span>${user.county || "-"}</span></div>
      <div class="field"><b>City</b><span>${user.city || "-"}</span></div>
      <div class="field"><b>Address</b><span>${user.address || "-"}</span></div>
      <div class="field"><b>Date of birth</b><span>${user.dob || "-"}</span></div>
    </div>
  `;

  let ordersHtml = `<h2 class="section-title" style="margin-top:18px;">Your orders</h2><hr class="hr-soft">`;

  if (orders.length === 0){
    ordersHtml += `<p class="notice">No orders yet.</p>`;
  } else {
    ordersHtml += `<div class="orders">` + orders.map(o => {
      const itemsList = (o.items || []).map(it => `<li>${it.qty} × ${it.name} (€${it.price.toFixed(2)})</li>`).join("");
      return `
        <div class="order-card">
          <h3>Order #${o.id}</h3>
          <p><b>Date:</b> ${o.date}</p>
          <p><b>Status:</b> ${o.status}</p>
          <ul class="order-items">${itemsList}</ul>
        </div>
      `;
    }).join("") + `</div>`;
  }

  box.innerHTML = `
    ${detailsHtml}
    ${ordersHtml}
    <button class="logout" id="logoutBtn" type="button">Logout</button>
  `;

  document.getElementById("logoutBtn").addEventListener("click", logout);
}

function renderAccount(){
  const user = readCurrentUser();
  if (!user) renderLoggedOut();
  else renderLoggedIn(user);
}

renderAccount();
