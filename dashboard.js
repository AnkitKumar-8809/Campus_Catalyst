// === Logout Handler (call via onclick="logout()" or via event) ===
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
} 