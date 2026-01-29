const API_URL = "http://localhost:8080/api/auth";

export async function loginClient(email: string, password: string) {
  const res = await fetch(`${API_URL}/login/client`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const user = await res.json();

  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  window.location.href = "/login";
}
