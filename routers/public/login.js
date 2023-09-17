document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                // Login successful, store the token and redirect to data display page
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);
                window.location.href = 'index.html'; // Redirect to your data display page
            } else {
                // Login failed, display an error message
                message.textContent = 'Login failed. Please try again.';
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });
});