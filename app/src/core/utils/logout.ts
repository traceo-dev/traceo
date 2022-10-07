export const logout = () => {
  localStorage.removeItem("session");
  sessionStorage.clear();
  window.location.href = "/login";
};
