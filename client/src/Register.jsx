import {useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
function Register() {
    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const submitForm = async (e) => {
        e.preventDefault();
        const data = {
            Username: name,
            Email: email,
            Password: password
        }
        try{
            const response = await axios.post('http://localhost:5000/api/auth/register', data);
            console.log(response.data);
            alert(response.data.message || 'Registration successful');

        }
        catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || 'An error occurred during registration');
}

        
    }
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={submitForm}>
            <input placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <br />
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <br />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <br />
            <button type="submit">Register</button>

        </form>
        <p className="mt-4">
  Already have an account?{' '}
  <Link to="/login" className="text-blue-500 underline">
    Login here
  </Link>
</p>

        </div>
        
    );
}
export default Register;