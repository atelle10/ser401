    import React, { use, useState } from 'react';
    import Home from './Home';

    let loggedIn = false;

    const Login = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');

      if (loggedIn) {
        return <Home />;
      }
      
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here (e.g., send credentials to an API)
        console.log('Username:', username, 'Password:', password);
        loggedIn = true; // Update loggedIn status upon successful login
        setUsername('');
        setPassword('');
      };

      const handleSignUp = (e) => {
        e.preventDefault(); 
        // Handle sign-up logic here (e.g., send credentials to an API)
        console.log('Sign Up - Username:', username, 'Password:', password);
        setUsername('');
        setPassword('');
      };

      return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
          <div className='absolute inset-0 bg-[url("./src/Components/assets/login_logo.png")] bg-no-repeat bg-center opacity-70'></div>
          <div className="p-2 bg-gray-200 rounded-3xl shadow-xl bg-transparent backdrop-blur-sm border border-white space-y-4">
            <div>
              <img src="./src/Components/assets/famar_logo.png" alt="Famar Logo" className="mx-auto object-center w-32 h-32" />
            </div>
            <div className="flex flex-col items-center justify-center bg-transparent rounded-lg p-2">
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    className='p-1 rounded-lg border bg-transparent text-white border-gray-400 m-1'
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    className='p-1 rounded-lg border bg-transparent text-white border-gray-400 m-1'
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className='flex justify-center gap-2 m-2'>
                  <button type="submit" className='px-2 py-1 rounded-lg border border-gray-400 bg-blue-500 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-105 pointer-events-auto '>Login</button>
                </div>
                <div className='flex text-xs justify-center m-2'>
                  <p>Don't have an account? <a onClick={handleSignUp} className="text-blue-700 hover:underline" href='#'>Register</a></p>
                </div>
              </form>
            </div>
        </div>
      </div>
      );
    };

    export default Login;