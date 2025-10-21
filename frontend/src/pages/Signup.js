import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate(); // Initialize navigate function

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    code: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      dispatch({ type: 'LOGIN', payload: data });
      navigate('/'); // Redirect to home page after successful signup
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            name="code"
            id="code"
            value={form.code}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Signup</button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;

