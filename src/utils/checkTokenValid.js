import jwtDecode from 'jwt-decode'

const checkTokenValid = () => {
    const token = localStorage.getItem('token')
    if (!token) return null;
    const decoded = jwtDecode(token);
    if (decoded.exp > Date.now() / 1000) return decoded;
    return null;
}

export default checkTokenValid