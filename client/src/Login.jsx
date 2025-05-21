import {useState} from 'react';
import axios from 'axios';
function Login() {
    const [name , setName] = useState('');
    const [password , setPassword] = useState('');
  
    const submitForm = async (e) => {
        e.preventDefault();
        const data = {
            Username: name,
            Password: password
        }
        try{
            const response = await axios.post('http://localhost:5000/api/auth/login', data);
            localStorage.setItem('token', response.data.token);
            console.log(response.data);
           if (response.data.token) {
    alert('Login successful');
} else {
    alert('Login failed');
}

        }
       catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || 'An error occurred during Login');
}

        
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={submitForm}>
            <input placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <br />
           
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <br />
            <button type="submit">Login</button>

        </form>
        </div>
        
    );
}
export default Login;