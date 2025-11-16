    // Login.js
    import React, { useState } from 'react';

    let loggedIn = false;

    const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here (e.g., send credentials to an API)
        console.log('Email:', email, 'Password:', password);
        loggedIn = true; // Update loggedIn status upon successful login
        // Clear form fields after submission (optional)
        setEmail('');
        setPassword('');
      };

      return (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Log In</button>
          </form>
        </div>
      );
    };

    export let loggedInStatus = {loggedIn};
    export default Login;