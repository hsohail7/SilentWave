export async function signup(username: string, email: string, password: string) {
    const response = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Signup failed: ${text}`);
    }
    return await response.json();
  }
  
  export async function login(email: string, password: string) {
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Login failed: ${text}`);
    }
    return await response.json();
  }
  