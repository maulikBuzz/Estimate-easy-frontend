import axios from "../config/userAxiosConfig";


const createEstimate = async (data) => { 
    const formData = new FormData();

    console.log(data.quotationItems);
    
    console.log(data.quotationItems[0].images, "gagag");

    formData.append('name', data.name);
    formData.append('isPdf', data.isPdf);
    formData.append('address', data.address);
    formData.append('sales_rep', data.sales_rep);
    formData.append('salesContact', data.salesContact);
    formData.append('date', data.date);
    formData.append('contact_no', data.contact_no);
    formData.append('quote_by', data.quote_by); 
    formData.append('merchant_id', data.merchant_id); 
    formData.append('quotationItems', JSON.stringify(data.quotationItems));

    
    for (let i = 0; i < data.quotationItems.length; i++) {
        const element = data.quotationItems[i];
        const imageInput = element.images
        // console.log(element, "a");
        if (imageInput && imageInput.length > 0) {
            for (let index = 0; index < imageInput.length; index++) {
              
                formData.append(`${element.name}-${i}`, imageInput[index]);
            }
        }
    }
 
    const res = await axios.post(`estimate/add`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  
        }
    });
    return res;
};

const deleteQuotationItem = async (id) => {
    const res = await axios.delete(`quotation-item/delete?quotation_item_id=${id}`);
    return res;
};
const deleteQuotationImage = async (id) => {
    const res = await axios.delete(`quotation-image/delete?quotation_image_id=${id}`);
    return res;
};

const deleteEstimate = async (id) => {
    const res = await axios.delete(`estimate/delete?customer_id=${id}`);
    return res;
};

const updateEstimate = async ({finalData, customer_id}) => {
    console.log(finalData, "hehe");
    
    const formData = new FormData();
    
    formData.append('name', finalData.name);
    formData.append('isPdf', finalData.isPdf);
    formData.append('address', finalData.address);
    formData.append('sales_rep', finalData.sales_rep);
    formData.append('salesContact', finalData.salesContact);
    formData.append('date', finalData.date);
    formData.append('contact_no', finalData.contact_no);
    formData.append('quote_by', finalData.quote_by); 
    formData.append('merchant_id', finalData.merchant_id); 
    formData.append('quote_number', finalData.quote_number); 
    formData.append('quotationItems', JSON.stringify(finalData.quotationItems));

    
    for (let i = 0; i < finalData.quotationItems.length; i++) {
        const element = finalData.quotationItems[i];
        console.log(element, "erterererer");
        
        const imageInput = element.images 
        console.log(imageInput);
        
        if (imageInput && imageInput.length > 0) {
            for (let index = 0; index < imageInput.length; index++) {
                console.log(`${element.name}-${i}`, imageInput[index], "kaik to che ");
                
              
                formData.append(`${element.name}-${i}`, imageInput[index]);
            }
        }
    }
    const res = await axios.put(`estimate/edit?user_customer_id=${customer_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  
        }
    });
    return res;
};
const getEstimateCustomers = async (merchant_id) => { 
    console.log(merchant_id);
    
    const query = `estimate/customer/list?merchant_id=${merchant_id}`
    const res = await axios.get(query);
 
    return res;
};
const getEstimate = async ({customer_id, id}) => { 
    let query = '' 
    
    console.log(id, "ahahahah");
    if(id){
        console.log("ahahahah");

        query = `estimate/get?user_customer_id=${customer_id}&merchant_product_id=${id}`
    }
    else{

        query = `estimate/get?user_customer_id=${customer_id}`
    }
       
    const res = await axios.get(query);
    console.log(res, "user_customer_id");
    return res;
};
const generatePdf = async (user_customer_id) => {  
       
    const query = `generate/pdf?user_customer_id=${user_customer_id}`
    const res = await axios.get(query,   {
        responseType : 'blob',
        headers : {
          "Accept" : "application/pdf"
        }
      }); 
  
    return res;
};
 

const api = {
    createEstimate,
    getEstimateCustomers,
    getEstimate,
    updateEstimate,
    deleteEstimate,
    deleteQuotationItem,
    generatePdf,
    deleteQuotationImage
};

export default api;


