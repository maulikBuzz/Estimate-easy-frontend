import axios from "../config/axiosConfig";

const getProductList = async (id, merchant_id) => {
    const query = id ? `product/list?business_category_id=${id}&is_exist=true&merchant_id=${merchant_id}` : `product/list`
    const res = await axios.get(query);
    return res;
};

const editProduct = async (id, data) => {
    const res = await axios.put(`product/edit?product_id=${id}`, data);
    return res;
};
const addProduct = async (data) => {
    const res = await axios.post(`product/add`, data);
    return res;
};
const deleteProduct = async (id) => {
    const res = await axios.delete(`product/delete?product_id=${id}`);
    return res;
};
const getProduct = async (id) => {
    const res = await axios.get(`product/get?product_id=${id}`);
    return res;
};

const api = {
    getProductList,
    editProduct,
    addProduct,
    deleteProduct,
    getProduct
};

export default api;
