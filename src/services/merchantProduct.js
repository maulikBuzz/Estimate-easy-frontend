import axios from "../config/axiosConfig";

const getMerchantProductList = async (id) => { 
    const query = id ? `merchant-product/list?merchant_id=${id}` : `merchant-product/list`
    const res = await axios.get(query);
 
    return res;
};

const editMerchantProduct = async (id, data) => {
    const res = await axios.put(`merchant-product/edit?merchant_product_id=${id}`, data);
    return res;
};
const addMerchantProduct = async (data) => {
    const res = await axios.post(`merchant-product/add`, data);
    return res;
};
const deleteMerchantProduct = async (id) => {
    const res = await axios.delete(`merchant-product/delete?merchant_product_id=${id}`);
    return res;
};
const duplicateMerchantProduct = async (merchant_product_id, product_id) => {
    const res = await axios.get(`merchant-product/duplicate?merchant_product_id=${merchant_product_id}&product_id=${product_id}`);
    return res; 
};

const api = {
    getMerchantProductList,
    editMerchantProduct,
    addMerchantProduct,
    deleteMerchantProduct,
    duplicateMerchantProduct
};

export default api;
