export const auth = () => {
	return JSON.parse(localStorage.getItem('auth')) || {}
}
export const setAuth = (data) => {
	return localStorage.setItem('auth', JSON.stringify(data))
}