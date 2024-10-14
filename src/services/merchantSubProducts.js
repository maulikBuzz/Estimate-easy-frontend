import axios from "../config/axiosConfig";

const getMerchantSubProductList = async (id) => {
    const query = id ? `merchant-sub-product/list?merchant_product_id=${id}` : `merchant-sub-product/list`
    const res = await axios.get(query);
    return res;
};

const editMerchantSubProduct = async (id, data) => {
    const res = await axios.put(`merchant-sub-product/edit?merchant_sub_product_id=${id}`, data);
    return res;
};
const addMerchantSubProduct = async (data) => {
    const res = await axios.post(`merchant-sub-product/add`, data);
    return res;
};
const deleteMerchantSubProduct = async (id) => {
    const res = await axios.delete(`merchant-sub-product/delete?merchant_sub_product_id=${id}`);
    return res;
};
const getMerchantSubProduct = async (id) => {
    const res = await axios.get(`merchant-sub-product/get?merchant_sub_product_id=${id}`);
    return res;
};

const api = {
    getMerchantSubProductList,
    editMerchantSubProduct,
    addMerchantSubProduct,
    deleteMerchantSubProduct,
    getMerchantSubProduct
};

export default api;
