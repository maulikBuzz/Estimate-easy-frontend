import axios from "../config/axiosConfig";

const getMerchantList = async () => {
    const res = await axios.get("merchant/list");
    return res;
};
const getMerchantById = async (id) => {
    const res = await axios.get(`merchant/get?merchant_id=${id}`);
    return res;
};

const editMerchant = async (id, data) => {
    const res = await axios.put(`merchant/edit?merchant_id=${id}`, data);
    return res;
};
const addMerchant = async (data) => {
    const res = await axios.post(`merchant/add`, data);
    return res;
};

const deleteMerchant = async (id) => {
    const res = await axios.delete(`merchant/delete?merchant_id=${id}`);
    return res;
};

const api = {
    getMerchantList,
    editMerchant,
    addMerchant,
    getMerchantById,
    deleteMerchant
};

export default api;
