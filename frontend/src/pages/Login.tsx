import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-serif text-stone-800 text-center mb-2">Himalayan Kitchen</h1>
        <p className="text-stone-500 text-center text-sm mb-8">Restaurant Management System</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-medium text-stone-800">Sign in</h2>

          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

          <div>
            <label className="block text-sm text-stone-600 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>

          <button type="submit" className="w-full bg-stone-800 text-white rounded py-2 text-sm hover:bg-stone-700 transition">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
