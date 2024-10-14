import axios from "../config/axiosConfig";

const getUnitList = async () => {
    const query = `unit/list`
    const res = await axios.get(query);
    return res;
};

const editUnit = async (id, data) => {
    const res = await axios.put(`unit/edit?unit_id=${id}`, data);
    return res;
};
const addUnit = async (data) => {
    const res = await axios.post(`unit/add`, data);
    return res;
};
const deleteUnit = async (id) => {
    const res = await axios.delete(`unit/delete?unit_id=${id}`);
    return res;
};
const getUnit = async (id) => {
    const res = await axios.get(`unit/get?unit_id=${id}`);
    return res;
};
const getSubProductUnit = async (id) => {
    const res = await axios.get(`sub-product-unit/list?sub_product_id=${id}`);
    return res;
};

const api = {
    getUnitList,
    editUnit,
    addUnit,
    deleteUnit,
    getUnit,
    getSubProductUnit
};

export default api;
