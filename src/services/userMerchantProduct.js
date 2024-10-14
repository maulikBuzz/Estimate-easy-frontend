import axios from "../config/userAxiosConfig";

const getMerchantProductList = async (id) => {  
    const res = await axios.get(`merchant-product/list?merchant_id=${id}`);
    return res;
};
 
const getMerchantSubProductList = async (id) => {  
    const res = await axios.get(`merchant-sub-product/list?merchant_product_id=${id}`);
    return res;
};
 
const addMerchantSubProduct = async (data) => {
    const res = await axios.post(`merchant-sub-product/add`, data);
    return res;
};


const getUnitList = async () => {
    const query = `unit/list`
    const res = await axios.get(query);
    return res;
};


const api = {
    getMerchantProductList, 
    getMerchantSubProductList,
    addMerchantSubProduct,
    getUnitList
};

export default api;
