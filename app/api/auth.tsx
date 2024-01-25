export default async function login(username: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      console.log(`API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
      if (response.status === 401) {
        throw new Error("Invalid username or password.");
      } else {
        throw new Error("An error occurred while logging in.");
      }
    }

    const data = await response.json();
    const authHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.access_token}`,
    };
    return authHeader;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error; // 或者处理错误（例如更新状态或显示错误消息）
  }
}
