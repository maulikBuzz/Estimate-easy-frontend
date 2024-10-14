import axios from "../config/axiosConfig";

const Login = async (data) => {
    const res = await axios.post("login", data);
    return res;
};

const api = {
    Login,
};

export default api;
