import api from "./api";

// LOGIN
export async function login({ email, password }) {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    if (!token) {
      throw new Error("errors.noTokenFromServer");
    }

    return { token, user };
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "errors.loginFailed";

    throw new Error(message);
  }
}

// REGISTER
export async function register({ email, password, name }) {
  try {
    const res = await api.post("/auth/register", { email, password, name });
    return { message: res.data.message || "ok" };
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "errors.registerFailed";

    throw new Error(message);
  }
}
