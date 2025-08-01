// === Smooth Scroll for Anchor Links ===
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetID = this.getAttribute('href').slice(1);
    if (targetID && document.getElementById(targetID)) {
      e.preventDefault();
      document.getElementById(targetID).scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth < 750) closeNavMenu();
    }
  });
});

// === Mobile Navigation ===
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function openNavMenu() {
  navMenu.style.display = 'flex';
  navMenu.classList.add('show');
}

function closeNavMenu() {
  navMenu.style.display = 'none';
  navMenu.classList.remove('show');
}

navToggle?.addEventListener('click', () => {
  navMenu.style.display === 'flex' ? closeNavMenu() : openNavMenu();
});

document.addEventListener('click', (e) => {
  if (window.innerWidth < 750 && !navMenu.contains(e.target) && e.target !== navToggle) {
    closeNavMenu();
  }
});

window.addEventListener('resize', () => {
  navMenu.style.display = window.innerWidth >= 750 ? 'flex' : 'none';
});

// === Scroll Reveal Effect ===
function revealOnScroll() {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// === Dark Mode Toggle ===
const modeToggle = document.getElementById('modeToggle');

function setDarkMode(on) {
  if (on) {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '☀️';
    localStorage.setItem('campus_dmode', 'on');
  } else {
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '🌙';
    localStorage.setItem('campus_dmode', 'off');
  }
}

modeToggle?.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});

if (localStorage.getItem('campus_dmode') === 'on' ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches &&
    localStorage.getItem('campus_dmode') === null)) {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

// === Authentication Modal ===
const authModal = document.getElementById('authModal');
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeBtn = document.getElementById('closeBtn');
const closeAuth = document.getElementById('closeAuth');

openAuthBtn?.addEventListener('click', () => {
  authModal.classList.remove('hide');
  loginBox.classList.remove('hide');
  registerBox.classList.add('hide');
});
closeBtn?.addEventListener('click', () => authModal.classList.add('hide'));
closeAuth?.addEventListener('click', () => authModal.classList.add('hide'));

document.getElementById('gotoRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  loginBox.classList.add('hide');
  registerBox.classList.remove('hide');
});
document.getElementById('gotoLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  registerBox.classList.add('hide');
  loginBox.classList.remove('hide');
});

// === Contact Form Submission ===
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    contactForm.classList.add('error');
    contactStatus.textContent = "Please fill all fields with a valid email.";
    return;
  }

  const res = await fetch('http://localhost:5000/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });

  const data = await res.json();
  contactStatus.textContent = data.message;
  contactStatus.style.color = res.ok ? "#229238" : "#c92a2a";
  contactForm.reset();
});

// === Login Handler ===
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const status = document.getElementById('loginStatus');

  if (!email || !password) {
    status.textContent = "All fields required.";
    status.style.color = "#c92a2a";
    return;
  }

  const res = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  status.textContent = data.message;
  status.style.color = res.ok ? "#229238" : "#c92a2a";

  if (res.ok) {
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email
    }));

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }
});

// === Register Handler ===
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const status = document.getElementById('registerStatus');

  if (!name || !email || !password) {
    status.textContent = "All fields required!";
    status.style.color = "#c92a2a";
    return;
  }

  const res = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  status.textContent = data.message;
  status.style.color = res.ok ? "#229238" : "#c92a2a";

  if (res.ok) {
    setTimeout(() => {
      registerBox.classList.add('hide');
      loginBox.classList.remove('hide');
      document.getElementById('loginStatus').textContent = "Please log in.";
      document.getElementById('loginStatus').style.color = "#229238";
    }, 1000);
  }
});

// === Password Strength Meter ===
const passwordInput = document.getElementById('regPassword');
const strengthFill = document.getElementById('passwordMeterFill');
const strengthText = document.getElementById('passwordStrength');

passwordInput?.addEventListener('input', () => {
  const val = passwordInput.value;
  let strength = 0;

  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasNumber = /\d/.test(val);
  const hasSymbol = /[!@#$%^&*]/.test(val);
  const isLong = val.length >= 8;

  if (hasUpper) strength++;
  if (hasLower) strength++;
  if (hasNumber) strength++;
  if (hasSymbol) strength++;
  if (isLong) strength++;

  let strengthLabel = '';
  let barColor = '';

  switch (strength) {
    case 0:
    case 1:
      strengthLabel = 'Very Weak';
      barColor = '#d63031';
      break;
    case 2:
      strengthLabel = 'Weak';
      barColor = '#e17055';
      break;
    case 3:
      strengthLabel = 'Moderate';
      barColor = '#fdcb6e';
      break;
    case 4:
      strengthLabel = 'Strong';
      barColor = '#00b894';
      break;
    case 5:
      strengthLabel = 'Very Strong';
      barColor = '#00cec9';
      break;
  }

  strengthText.textContent = strengthLabel;
  strengthText.style.color = barColor;
  strengthFill.style.width = `${(strength / 5) * 100}%`;
  strengthFill.style.backgroundColor = barColor;
});

// === Load Dashboard Data ===
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const nameSpan = document.getElementById('userName');
  const emailSpan = document.getElementById('userEmail');

  if (!user || !user.name || !user.email) {
    window.location.href = "index.html"; // Not logged in
    return;
  }

  if (nameSpan) nameSpan.textContent = user.name;
  if (emailSpan) emailSpan.textContent = user.email;
});

// === Logout Handler ===
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
