import axios from "../config/userAxiosConfig";

const Login = async (data) => { 
    const res = await axios.post("/login", data); 
    return res;
};
const getUser = async () => {
    const query = `user/get`
    const res = await axios.get(query);
    return res;
};
 

const api = {
    Login,
    getUser
};

export default api;
