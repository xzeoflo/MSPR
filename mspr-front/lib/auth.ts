const API_URL = "http://localhost:8080/api/auth";

export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getAuthToken() {
  const user = getCurrentUser();
  return user ? user.token : null;
}

export async function loginClient(email: string, password: string) {
  const res = await fetch(`${API_URL}/login/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const data = await res.json();
  localStorage.setItem("user", JSON.stringify(data));
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
