// Admin API helpers for fetching users
export async function fetchUsers() {
  const res = await fetch('http://localhost:4000/api/users', {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });
  return res.json();
}
