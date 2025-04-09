export async function sendMessage(token: string, senderId: number, content: string) {
    const response = await fetch("http://localhost:8080/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ senderId, content }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Send message failed: ${text}`);
    }
    return await response.json();
  }
  
  export async function fetchMessages(token: string) {
    const response = await fetch("http://localhost:8080/api/messages", {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Fetch messages failed: ${text}`);
    }
    return await response.json();
  }
  