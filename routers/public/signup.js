document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const message = document.getElementById('message');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 201) {
                // Signup successful, redirect to login page or display a success message
                message.textContent = 'Signup successful. Please log in.';
            } else {
                // Signup failed, display an error message
                message.textContent = 'Signup failed. Please try again.';
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    });
});