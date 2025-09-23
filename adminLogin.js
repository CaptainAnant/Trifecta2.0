document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;
  const errorMsg = document.getElementById('errorMsg');

  if (!email || !password || !role) {
    errorMsg.textContent = 'Please fill in all fields.';
    return;
  }

  // Simulated login logic
  if (email === 'admin@ecolearn.com' && password === 'admin123' && role === 'admin') {
    alert('Welcome Admin!');
    // Redirect to admin dashboard
  } else if (email === 'faculty@ecolearn.com' && password === 'faculty123' && role === 'faculty') {
    alert('Welcome Faculty!');
    // Redirect to faculty dashboard
  } else {
    errorMsg.textContent = 'Invalid credentials or role.';
  }
});