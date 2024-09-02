// src/components/Login.js
import axios from 'axios';
import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
    } else {
      setError('');
      try{
        const res = await axios.post('https://chatbot-api-2tzx.onrender.com/login', {email,password});
        if (res.data.access_token) {
            window.localStorage.setItem('token', res.data.access_token);
            window.localStorage.setItem('user', res.data.user);
            window.location.href = '/';
            }
        }
        catch (error) {
            setError('Credenciales incorrectas.');
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">Iniciar sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
