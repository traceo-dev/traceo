const isAuthenticated = (): boolean => (localStorage.getItem("session") ? true : false);
export default isAuthenticated;
