import axios from "../config/axiosConfig";

const getUserList = async (id) => { 
    
    const query = id ? `user/list?merchant_id=${id}` : `user/list`
    const res = await axios.get(query);
    return res;
};

const editUser = async (id, data) => {
    const res = await axios.put(`user/edit?user_id=${id}`, data);
    return res;
};
const addUser = async (data) => {
    const res = await axios.post(`user/add`, data);
    return res;
};
const deleteUser = async (id) => {
    const res = await axios.post(`user/add?user_id=${id}`);
    return res;
};

const api = {
    getUserList,
    editUser,
    addUser,
    deleteUser
};

export default api;
