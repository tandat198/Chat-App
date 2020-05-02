import axios from "axios";
export const token = localStorage.getItem("token");
const apiUrl = 'https://chat-app-datng.herokuapp.com'

export const api = axios.create({
    baseURL: `${apiUrl}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.token = token ? token : "";
    return config;
});

const callApi = () => {
    return {
        async get(endpoint) {
            try {
                const res = await api.get(endpoint);
                return res.data;
            } catch (error) {
                return error.response;
            }
        },

        async post(endpoint, body, contentType) {
            try {
                const res = await api.post(endpoint, body, contentType === "formData" && { headers: { "content-type": "multipart/form-data" } });
                return res.data;
            } catch (error) {
                return error.response;
            }
        },

        async delete(endpoint) {
            try {
                const res = await api.delete(endpoint);
                return res.data;
            } catch (error) {
                return error.response;
            }
        }
    };
};

export default callApi();
