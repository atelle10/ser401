import {React, useEffect, useState} from 'react'

let loggedIn = false;
let loginStatus = '';

const Register = () => {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [email, setEmail] = useState('');
      const [phone, setPhone] = useState('');
      const [accountType, setAccountType] = useState('Select Account Type');

      useEffect(() => {
        passwordsMatch();
      }, [password, confirmPassword]);

      const passwordsMatch = () => {
        if (password !== confirmPassword) {
          loginStatus = 'Passwords do not match';
        } else {
          loginStatus = '';
        }
      };

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
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setAccountType('Select Account Type');
      };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r to-blue-400 via-slate-300 from-red-400">
        <div className=" flex items-center justify-center absolute inset-0 max-w-lg w-full mx-auto bg-[url('./src/Components/assets/login_logo.png')] bg-no-repeat bg-center">
            <div className="shadow-xl w-full max-w-md  bg-transprarent backdrop-blur-md rounded-lg border border-white flex flex-col items-center justify-center p-2 ">
              <h1 className='text-xl font-bold mb-4'>Registration Form</h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <input 
                  className='p-1 rounded-lg border text-black border-gray-400 w-1/2 mb-2'
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  />
                  <input 
                  className='p-1 rounded-lg border text-black border-gray-400 w-1/2 mb-2'
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  />
                </div>
                  <input
                    className='p-1 rounded-lg border text-black border-gray-400 w-full mb-2'
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    className='p-1 rounded-lg border text-black border-[borderColor] w-1/2 mb-2'
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    className='p-1 rounded-lg border text-black [borderColor] w-1/2 mb-2'   
                    type="password"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />  
                  <input 
                    className='p-1 rounded-lg border text-black border-gray-400 mb-2 w-full'
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className='p-1 rounded-lg border text-black border-gray-400 mb-2 w-full'
                    type="tel"
                    placeholder="Phone Number"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                <div className='flex justify-center gap-2 m-2'>
                  <select
                    className='p-1 rounded-lg border text-black border-gray-400 m-1'
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="" >Select Account Type</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="monitoring">Monitor Only</option>
                  </select>
                </div>
                <div className='flex justify-center gap-2 m-2'>
                  <button type="submit" className='px-2 py-1 rounded-lg border border-gray-400 bg-blue-500 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:scale-105 pointer-events-auto '>Create Account</button>
                </div>
                <div className='flex text-xs justify-center m-2'>
                  <p>{loginStatus}</p>
                </div>
              </form>
            </div>
        </div>
    </div>
  )
}

export default Register