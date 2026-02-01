import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth-token';

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const loginClient = async (email: string, password: string) => {
  const response = await fetch("http://localhost:8080/api/auth/login/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorDetail = await response.json().catch(() => ({}));
    console.error("Erreur Backend:", errorDetail);
    throw new Error(errorDetail.message || "Email ou mot de passe incorrect");
  }

  const data = await response.json();

  const token = data.token || data.accessToken;

  if (token) {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return data;
};


export const getCurrentUser = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = typeof window === 'undefined'
      ? Buffer.from(base64, 'base64').toString()
      : decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erreur décodage JWT:", e);
    return null;
  }
};

export const logout = () => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  localStorage.clear();
  window.location.href = '/login';
};
