import axios from "../config/axiosConfig";

const getBusinessCategoryList = async (data) => {
    const res = await axios.get("business-category/list", data);
    return res;
};

const editBusinessCategory = async (id, data) => {
    const res = await axios.put(`business-category/edit?bus_cat_id=${id}`, data);
    return res;
};
const addBusinessCategory = async (data) => {
    const res = await axios.post(`business-category/add`, data);
    return res;
};

const api = {
    getBusinessCategoryList,
    editBusinessCategory,
    addBusinessCategory
};

export default api;
