const container = document.getElementById("bouquetContainer");

/* =========================
   CART - localStorage
========================= */
function readCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = readCart();

  const existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart(cart);
  alert(product.name + " a fost adăugat în coș!");
}

/* =========================
   LOAD PRODUCTS (AJAX)
========================= */
function loadProducts() {
  fetch("data/products.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(function (products) {
      container.innerHTML = "";

      products.forEach(function (p) {
        const card = document.createElement("div");
        card.classList.add("bouquet-card");

        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">€${p.price.toFixed(2)}</p>
          <button class="buy-btn">Add to Cart</button>
        `;

        const button = card.querySelector(".buy-btn");
        button.addEventListener("click", function () {
          addToCart(p);
        });

        container.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error(error);
      container.innerHTML = "<p>Nu pot încărca produsele.</p>";
    });
}

loadProducts();
