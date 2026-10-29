import axios from 'axios';

// Create an axios instance with a base URL pointing to the Express backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Export the raw axios instance so it can be extended if needed
export { api };

// Fetch all users
export async function fetchUsers() {
  const response = await api.get('/users');
  return response.data;
}

// Fetch a single user by id
export async function fetchUser(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// Create a new user
export async function createUser(userData) {
  const response = await api.post('/users', userData);
  return response.data;
}

// Update an existing user
export async function updateUser(id, userData) {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
}

// Delete a user
export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
