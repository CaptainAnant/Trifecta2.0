// Handle Login Form Submission (Placeholder for database integration)
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Log the data to the console
    console.log('--- Login Attempt ---');
    console.log('Email:', email);
    console.log('Password:', password); // In a real app, never log passwords!

    // This is where you would add your database/Firebase logic
    alert('Login attempt captured in the console. Ready for integration!');
});
