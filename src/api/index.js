import axios from "axios";

export const token = localStorage.getItem("token");
export const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
        token: token ? token : ""
    }
});

if (token) axios.defaults.headers["token"] = token;

const callApi = () => {
    return {
        async get(endpoint) {
            try {
                console.log(token);
                const res = await api.get(endpoint);
                return res.data;
            } catch (error) {
                return error.response;
            }
        },

        async post(endpoint, body) {
            try {
                const res = await api.post(endpoint, body);
                return res.data;
            } catch (error) {
                return error.response;
            }
        }
    };
};

export default callApi();
