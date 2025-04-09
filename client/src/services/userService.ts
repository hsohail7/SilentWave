export async function getCurrentUser(token: string) {
    // /api/user to get user data
    const response = await fetch("http://localhost:8080/api/user", {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Get current user failed: ${text}`);
    }
    return await response.json();
  }
  