// src/lib/auth.js

// PROBLEM: process.env ne radi u browseru - hardkodiraj URL
const API_BASE_URL = 'http://localhost:3001/api';
// Ili koristi window.location za dinamički URL:
// const API_BASE_URL = typeof window !== 'undefined' 
//   ? `${window.location.protocol}//${window.location.hostname}:3001/api`
//   : 'http://localhost:3001/api';

console.log('🔧 API_BASE_URL:', API_BASE_URL);

/**
 * Registruje novog korisnika
 */
export async function registerUser(userData) {
  try {
    console.log('🎯 registerUser FUNKCIJA POZVANA!');
    console.log('📤 Šaljem podatke:', userData);
    console.log('🔗 URL:', `${API_BASE_URL}/auth/register`);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📨 HTTP Status:', response.status);
    console.log('📨 Response OK:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Server error:', errorData);
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    console.log('✅ Server response:', data);

    // Sačuvaj token
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('💾 Sačuvano u localStorage');
    }

    return data;

  } catch (error) {
    console.error('🔥 CATCH ERROR:', error);
    throw error;
  }
}

/**
 * Loguje postojećeg korisnika
 */
export async function loginUser(credentials) {
  try {
    console.log('🔐 loginUser FUNKCIJA POZVANA!');
    console.log('📤 Šaljem podatke:', credentials);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📨 HTTP Status:', response.status);
    console.log('📨 Response OK:', response.ok);

    const data = await response.json();
    console.log('✅ Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Sačuvaj token u localStorage
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('💾 Sačuvano u localStorage');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Ostale funkcije ostaju iste...
export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

export function isUserLoggedIn() {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('authToken');
  return !!token;
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const minLength = 6;
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }
  return {
    isValid: true,
    message: 'Password is valid'
  };
}