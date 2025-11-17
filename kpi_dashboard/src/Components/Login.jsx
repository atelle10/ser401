    import React, { useState } from 'react';
    import Home from './Home';

    let loggedIn = false;

    const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      if (loggedIn) {
        return <Home />;
      }
      
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here (e.g., send credentials to an API)
        console.log('Email:', email, 'Password:', password);
        loggedIn = true; // Update loggedIn status upon successful login
        setEmail('');
        setPassword('');
      };

      const handleSignUp = (e) => {
        e.preventDefault(); 
        // Handle sign-up logic here (e.g., send credentials to an API)
        console.log('Sign Up - Email:', email, 'Password:', password);
        setEmail('');
        setPassword('');
      };

      return (
        <div className="min-w-6xl h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-slate-300 to-red-400">
          <div className="p-2 bg-gray-200 rounded-3xl shadow-lg grid grid-cols-2 gap-1">
            <div>
              <img src="./src/Components/assets/Famar Logo.png" alt="Famar Logo" className="mx-auto object-center w-32 h-32" />
            </div>
          <div className="flex flex-col items-center justify-center bg-gray-100 p-2 rounded-2xl shadow-md">
            <h1 className="rounded"> Login</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email: </label>
                <input
                  className='w-24 rounded-lg border border-gray-400'
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password: </label>
                <input
                  className='w-24 rounded-lg border border-gray-400'
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-2 m-2'>
                <button onClick={handleSignUp} className='px-2 py-1 rounded-lg border bg-gray-400'>Sign Up</button>
                <button type="submit" className='px-2 py-1 rounded-lg border border-gray-400 bg-blue-400'>Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      );
    };

    export default Login;