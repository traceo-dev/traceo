export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/";
};
