const API_URL = "http://localhost:8080/api/auth";

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

export function getAuthToken() {
  const user = getCurrentUser();
  return user ? user.token || user.accessToken : null;
}

export async function loginClient(email: string, password: string) {
  const res = await fetch(`${API_URL}/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Email ou mot de passe incorrect");
  }

  const data = await res.json();

  if (typeof window !== "undefined") {
    const storageData = data.user ? { ...data.user, token: data.token } : data;
    localStorage.setItem("user", JSON.stringify(storageData));
  }

  return data;
}

export function isAuthenticated() {
  return !!getAuthToken();
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  window.location.href = "/login";
}
