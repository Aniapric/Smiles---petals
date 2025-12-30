const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

const countryInput = document.getElementById("country");
const countyInput = document.getElementById("county");
const cityInput = document.getElementById("city");
const addressInput = document.getElementById("address");
const dobInput = document.getElementById("dob");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const msg = document.getElementById("msg");

// regex (cerință)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// optional: un regex simplu pt nume/locație (litere + spații + -)
const textRegex = /^[A-Za-zÀ-ž\s\-]{2,}$/;

function readUsers(){
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users){
  localStorage.setItem("users", JSON.stringify(users));
}

function setMessage(text, ok=false){
  msg.style.color = ok ? "#2f8f5b" : "#c44a61";
  msg.textContent = text;
}

function redirectAfterLogin(){
  const target = localStorage.getItem("afterLoginRedirect");
  if (target){
    localStorage.removeItem("afterLoginRedirect");
    window.location.href = target;
  } else {
    window.location.href = "account.html";
  }
}

function calcAge(dobStr){
  // dobStr e de forma "YYYY-MM-DD"
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

registerBtn.addEventListener("click", function(){
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passInput.value;

  const country = countryInput ? countryInput.value.trim() : "";
  const county = countyInput ? countyInput.value.trim() : "";
  const city = cityInput ? cityInput.value.trim() : "";
  const address = addressInput ? addressInput.value.trim() : "";
  const dob = dobInput ? dobInput.value : "";

  // validări
  if (name.length < 2){
    setMessage("Name is too short.");
    return;
  }
  if (!emailRegex.test(email)){
    setMessage("Invalid email.");
    return;
  }
  if (pass.length < 6){
    setMessage("Password must be at least 6 characters.");
    return;
  }

  // câmpuri extra (simple)
  if (!country || !textRegex.test(country)){
    setMessage("Please enter a valid country.");
    return;
  }
  if (!county || !textRegex.test(county)){
    setMessage("Please enter a valid county.");
    return;
  }
  if (!city || !textRegex.test(city)){
    setMessage("Please enter a valid city.");
    return;
  }
  if (!address || address.length < 5){
    setMessage("Address is too short.");
    return;
  }
  if (!dob){
    setMessage("Please select your date of birth.");
    return;
  }

  const age = calcAge(dob);
  if (age === null){
    setMessage("Invalid date of birth.");
    return;
  }
  if (age < 10){
    setMessage("Date of birth looks incorrect.");
    return;
  }

  const users = readUsers();
  const existing = users.find(u => u.email === email);
  if (existing){
    setMessage("Account already exists. Please login.");
    return;
  }

  // salvăm user-ul complet
  const user = { name, email, pass, country, county, city, address, dob };
  users.push(user);
  saveUsers(users);

  // sesiune (cerință) - salvăm și detaliile ca să le afișezi în account.html
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ name, email, country, county, city, address, dob })
  );

  setMessage("Account created ✅", true);
  setTimeout(redirectAfterLogin, 600); // setTimeout (cerință)
});

loginBtn.addEventListener("click", function(){
  const email = emailInput.value.trim();
  const pass = passInput.value;

  if (!emailRegex.test(email)){
    setMessage("Invalid email.");
    return;
  }

  const users = readUsers();
  const user = users.find(u => u.email === email && u.pass === pass);

  if (!user){
    setMessage("Wrong email or password.");
    return;
  }

  // punem în sesiune TOATE datele (ca să se vadă pe account.html)
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      name: user.name,
      email: user.email,
      country: user.country,
      county: user.county,
      city: user.city,
      address: user.address,
      dob: user.dob
    })
  );

  setMessage("Logged in ✅", true);
  setTimeout(redirectAfterLogin, 600);
});

logoutBtn.addEventListener("click", function(){
  localStorage.removeItem("currentUser");
  setMessage("Logged out.", true);
});
