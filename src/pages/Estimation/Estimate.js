import React, { useState, useEffect } from 'react';

import {
    Modal,
    Alert,
} from "reactstrap"
import Select from 'react-select'
import merchantProducts from '../../services/userMerchantProduct'
import MerchantSubProducts from '../../services/userMerchantProduct'
import Estimation from '../../services/estimateService'
import Unit from '../../services/userMerchantProduct'
import user from '../../services/userAuthService'
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';


function Estimate() {
    const [addModel, setAddModel] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [productList, setProductList] = useState([]);
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        address: '',
        reference: '',
    });
    const [quotation, setQuotation] = useState({
        quotationNo: '',
        date: '',
        salesRep: '',
        salesContact: ''
    });
    const [tables, setTables] = useState([]);
    const [transformedProductList, setTransformedProductList] = useState([]);
    const [modal_standard, setModal_standard] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedGroup1, setSelectedGroup1] = useState(null)
    const [unitList, setUnitList] = useState([]);
    const [merchant_id, setMerchantId] = useState();
    const [id, setMerchantProductId] = useState();
    const [isEnabled, setIsEnabled] = useState(true)

    const [addItem, setAddItem] = useState({
        name: "",
        merchant_product_id: id,
        merchant_id: merchant_id,
        price: 0,
        unit_id: []
    });

    function handleSelectGroup(selectedGroups) {
        setSelectedGroup1(selectedGroups);
        const unit_ids = selectedGroups.map(group => group.value);
        setAddItem({ ...addItem, unit_id: unit_ids });
    }
    const handelUnitsChange = (selectedOption, index, i) => {
        console.log( index, i);
        
        const data = {
            units: {
                name: selectedOption.label
            }
        }; 

        const updatedTables = [...tables];

        updatedTables[i].subProduct[index].SubProductUnits.push(data);

        setTables(updatedTables); 
    };

    const transformedUnitList = unitList.map(unit => ({
        value: unit.id,
        label: unit.name
    }));

    const handleDuplicateItem = (i) => {
        const duplicatedItem = tables[i];
        const updatedTables = [
            ...tables.slice(0, i + 1),
            { ...duplicatedItem, images : [] },
            ...tables.slice(i + 1),
        ];
        setTables(updatedTables);
    };

    useEffect(() => {
        async function fetchUnitData() {
            const res = await Unit.getUnitList();
            const { data } = res;
            setUnitList(data?.data)
        }
        fetchUnitData();
        setIsSubmitted(false);
    }, [isSubmitted, id, merchant_id]);

    const handleDeleteItem = (i) => {
        const updatedTables = tables.filter((_, index) => index !== i);
        setTables(updatedTables);
    };

    const handleItemChange = async (index, e, i) => {
        const updatedItems = tables.map((Products, io) => {
            if (io === i) {
                const data = Products.subProduct.map((item, it) => {
                    if (it === index) {
                        setMerchantProductId(Products.id)
                        let updatedItem = { ...item };

                        if (["qty", "name", "price"].includes(e.target.name)) {
                            const newValue = e.target.value;

                            if (e.target.name === "qty") {
                                updatedItem.qty = newValue || 0;
                            } else if (e.target.name === "name") {
                                updatedItem.name = newValue;
                            } else if (e.target.name === "price") {
                                updatedItem.price = newValue;
                            }
                            const price = parseFloat(updatedItem.price) || 0;
                            const qty = parseFloat(updatedItem.qty) || 0;
                            updatedItem.amount = price * qty;
                        }
                        return updatedItem;
                    }
                    return item;
                });

                const total = data.reduce((acc, item) => acc + (item.amount || 0), 0);
                let name = Products.name
                if (e.target.name === "productName") {
                    name = e.target.value
                }

                return {
                    ...Products,
                    subProduct: data,
                    total,
                    name

                };
            }

            return Products;
        });
        setTables(updatedItems);
    };

    async function handleEditSelectGroup(selectedGroup) {
        setSelectedGroup(selectedGroup);
        const subProduct = await handleSubProduct(selectedGroup.merchant_product_id);

        selectedGroup.item_name = selectedGroup.label
        const updatedGroup = { ...selectedGroup, subProduct, images: [] };



        setTables([...tables, updatedGroup]);
        setErrorMessage("")
        setAddModel(!addModel);
    }

    useEffect(() => {
        const totalData = tables.map((item) => item.total)
        const hasInvalidValue = totalData.some(value => value === null || value === undefined || value === 0);

        setIsEnabled(hasInvalidValue ? true : false);

    }, [tables]);
    useEffect(() => {
        if (productList.length > 0) {
            const transformed = productList.map(product => ({
                value: product.id,
                label: product.products.name,
                merchant_product_id: product.id,
                product_id: product.product_id,
                id: product.id,
            }));

            setTransformedProductList(transformed);
        }
    }, [productList, isSubmitted]);

    const handleSubProduct = async (id) => {
        const res = await merchantProducts.getMerchantSubProductList(id);
        const { data } = res;
        return data?.data
    };

    useEffect(() => {
        async function fetchUserData() {
            let userDataRecord = []
            const res = await user.getUser();
            const { data } = res;

            userDataRecord = data?.data

            setMerchantId(userDataRecord.merchant_id)
            if (userDataRecord != null) {

                const res = await merchantProducts.getMerchantProductList(userDataRecord.merchant_id);
                const { data } = res;

                setProductList(data?.data)
            }

            setQuotation((prevQuotation) => ({
                ...prevQuotation,
                salesRep: (quotation.salesRep !== "") ? quotation.salesRep : data?.data?.name,
                salesContact: data?.data?.phone_number,
                date: new Date().toISOString().slice(0, 10)
            }));

        }
        fetchUserData();
    }, [isSubmitted]);

    const handleCustomerChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
    };
    const handleQuotationChange = (e) => {
        setQuotation({
            ...quotation,
            [e.target.name]: e.target.value,
        });
    };
    const setUpdateSubProductData = (e, data) => {
        tables.map((product) => {
            let nameExists = false;

            product.subProduct.map((subProduct) => {
                if (subProduct.name === e?.data.name) {
                    nameExists = true;
                }
            });
            if (!nameExists) {
                const finalData = {
                    id: e?.data.id,
                    merchant_product_id: e?.data.merchant_product_id,
                    merchant_id: e?.data.merchant_id,
                    name: e?.data.name,
                    price: e?.data.price,
                    SubProductUnits: data
                }
                product.subProduct.push(finalData)
            }
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const addMerchantSubProduct = await MerchantSubProducts.addMerchantSubProduct({ ...addItem, merchant_product_id: id, merchant_id: merchant_id });

        if (addMerchantSubProduct.data.status) {
            setModal_standard(false);
            setIsSubmitted(true);
            setErrorMessage("");

            setUpdateSubProductData(addMerchantSubProduct.data, addMerchantSubProduct?.data?.SubProductUnits)
            setAddItem({ name: "", price: 0, unit_id: [] });
        } else {
            setErrorMessage(addMerchantSubProduct.data.message);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddItem((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    function tog_large() {
        setAddModel(!addModel)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    function tog_standard() {
        setModal_standard(!modal_standard);
        if (!modal_standard) {
            setAddItem({ name: "", merchant_product_id: id, merchant_id: merchant_id, price: 0, unit_id: [] });
            setErrorMessage("");
            setSelectedGroup(null)
        }
        removeBodyCss();
    }
 

    async function createEstimate(e) {
        e.preventDefault();
        console.log(e.target.name.value, "kaik");
        
        try {
            const isPdf = (e.nativeEvent.submitter.id === "save_pdf");

            // if (!customer.phone || !/^\d{10}$/.test(customer.phone)) {
            //     setErrorMessage("Please enter a valid 10-digit phone number.");
            //     setShowAlert(true);
            //     return;
            // }

            if (tables.length !== 0) {
                const mappedData = tables.map(item => {
                    return {
                        item_name: item.item_name,
                        product_id: item.product_id,
                        total: item.total,
                        name: item.name,
                        images: item.images,
                        material: item.subProduct.map(sub => {
                            return {
                                material_id: sub.id,
                                name: sub.name,
                                qty: sub.qty || "0",
                                price: sub.price,
                                unit_of_measure: sub.SubProductUnits.map(unit => unit.units.name).join(', ')
                            };
                        })
                    };
                });


                const finalData = {
                    name: customer.name,
                    isPdf: isPdf,
                    address: customer.address,
                    sales_rep: quotation.salesRep,
                    salesContact: quotation.salesContact,
                    date: quotation.date,
                    contact_no: customer.phone,
                    quote_by: customer.reference,
                    merchant_id: merchant_id,
                    quotationItems: mappedData,
                };

                const formData = new FormData();
 
                formData.append('name', customer.name);
                formData.append('isPdf', isPdf);
                formData.append('address', customer.address);
                formData.append('sales_rep', quotation.salesRep);
                formData.append('salesContact', quotation.salesContact);
                formData.append('date', quotation.date);
                formData.append('contact_no', customer.phone);
                formData.append('quote_by', customer.reference);
                formData.append('contact_no', customer.phone);
                formData.append('quotationItems', mappedData);

                const data = await Estimation.createEstimate(finalData);

                if (isPdf) {
                    const response = await Estimation.generatePdf(data?.data?.data.customer_id);
                    if (response.data) {
                        const file = new Blob([response.data], { type: 'application/pdf' });
                        const fileURL = URL.createObjectURL(file);

                        const contentDisposition = response.headers['content-disposition'];
                        let customFileName = 'default_filename.pdf';

                        if (contentDisposition) {
                            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                            if (matches != null && matches[1]) {
                                customFileName = matches[1].replace(/['"]/g, '');
                            }
                        }
                        window.open(fileURL, '_blank');
                        const link = document.createElement('a');
                        link.href = fileURL;
                        link.download = customFileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        console.error('No PDF data received.');
                    }
                }

                if (data?.data?.errors) {
                    setErrorMessage(data?.data?.errors[0].msg);
                    setShowAlert(true);
                } else {
                    setErrorMessage('');
                    console.log(2);
                    setTables([]);

                    setCustomer({
                        name: '',
                        phone: '',
                        address: '',
                        reference: '',
                    });

                    setIsSubmitted(true);
                    setSuccessMessage(data?.data?.message);
                    setShowAlert(true);
                }
            } else {
                setErrorMessage("Please provide at least one estimate.");
            }
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred.');
        }
    }

    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setShowAlert(false);
                setErrorMessage('')
                setSuccessMessage('')
            }, 3000);
            return () => {
                clearTimeout(timer)
                setShowAlert(true);
            };
        }
    }, [errorMessage, successMessage]);
    

    const handleFileChange = (index, e, i) => {
        const maxFiles = 5; 
        const updatedItems = tables.map((Products, io) => {

            if (io === i) {
                const files = e.target.files;
                const fileArray = Array.from(files);
                const finalData = files.length + Products.images.length
             
                if (finalData > maxFiles) {
                    alert(`You can only upload up to ${maxFiles} images.`);
                    e.target.value = "";
                    return Products;
                } 

                const maxSize = 1 * 1024 * 1024;
                const oversizedFiles = fileArray.filter(file => file.size > maxSize);
                if (oversizedFiles.length > 0) {
                    alert("Each image must be less than 1MB in size.");
                    e.target.value = "";
                    return Products;
                }

                return {
                    ...Products,
                    images: Products.images.concat(fileArray)
                };
            }
            return Products
        })
        setTables(updatedItems)
        e.target.value = null;
    };
 
    const [imageInFullScreen, setImageInFullScreen] = useState(null); 
  
    const handleImageClick = (imageIndex) => {
      setImageInFullScreen(imageInFullScreen === imageIndex ? null : imageIndex);  
    };
 

    const handleDeleteImage = async (tableIndex, imageIndex) => {
        console.log(tableIndex, imageIndex, "tableIndex, imageIndex");
        tables.map((item)=>[
            item.images.map((image)=>{
              console.log(image);
              
            })
          ])
        
        setTables((prevTables) =>
          prevTables.map((table, i) =>
            i === tableIndex
              ? {
                  ...table,
                  images: table.images.filter((_, idx) => idx !== imageIndex)
                }
              : table
          )
        );
      };
   
    tables.map((item) => {
        console.log(item, "k");
        item.images.map((items) => {
            const imageUrl = URL.createObjectURL(items);
            console.log(imageUrl, "em na thsy");

        })
    })
 console.log(tables);
 
    return (
        <React.Fragment>
            {showAlert && successMessage ? (
                <Alert color="success">
                    {successMessage}
                </Alert>
            ) : null}
            <div className="container my-4 p-4 border rounded shadow bg-white">
                <h1 className="mb-4">Estimate</h1>
                <form onSubmit={(e) => {
                    createEstimate(e, true, false);
                }}>
                    <h2 className="mb-3">Customer Details</h2>
                    <div className='row'>

                        <div className="col-md-6">
                            <div className="form-group row mb-3">
                                <label htmlFor="name" className="col-4 col-form-label">Name</label>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={customer.name}
                                        onChange={handleCustomerChange}
                                        className="form-control"
                                        placeholder="Enter name"
                                        required
                                    />

                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="phone" className="col-4 col-form-label">Phone</label>
                                <div className="col-8">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={customer.phone}
                                        onChange={handleCustomerChange}
                                        className="form-control"
                                        placeholder="Enter phone number"
                                        maxLength="10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="address" className="col-4 col-form-label">Address</label>
                                <div className="col-8">
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={customer.address}
                                        onChange={handleCustomerChange}
                                        className="form-control"
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="reference" className="col-4 col-form-label">Reference</label>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        id="reference"
                                        name="reference"
                                        value={customer.reference}
                                        onChange={handleCustomerChange}
                                        className="form-control"
                                        placeholder="Enter reference"
                                        required
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group row mb-3">
                                <label htmlFor="date" className="col-4 col-form-label">Date</label>
                                <div className="col-8">
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={quotation.date}
                                        onChange={handleQuotationChange}
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="salesRep" className="col-4 col-form-label">Sales Rep</label>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        id="salesRep"
                                        name="salesRep"
                                        value={quotation.salesRep}
                                        onChange={handleQuotationChange}
                                        className="form-control"
                                        placeholder="Enter sales representative"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="salesContact" className="col-4 col-form-label">Sales Contact</label>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        id="salesContact"
                                        name="salesContact"
                                        value={quotation.salesContact}
                                        onChange={handleQuotationChange}
                                        className="form-control"
                                        placeholder="Enter sales contact"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="mb-3">Items</h2>

                    <button
                        type="button"
                        className="btn btn-success mb-3"
                        onClick={() => {
                            tog_large()
                        }}
                    >
                        + Add Item
                    </button>

                    {showAlert && errorMessage ? (
                        <Alert color="danger">
                            {errorMessage}
                        </Alert>
                    ) : null}

                    <div className='mt-3'>
                        <div className="table-responsive mb-3" >
                            <table className="table table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Item</th>
                                        <th>Material</th>
                                        <th>Uom</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Amount</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                {tables.map((item, i) => (
                                    <tbody>
                                        {item.subProduct && item.subProduct.map((subProduct, index) => (
                                            <tr key={index}>
                                                {index === 0 && (
                                                    <td rowSpan={item.subProduct.length} className=''>
                                                        <label htmlFor="name">{item.label}</label>
                                                        <input
                                                            type="text"
                                                            name="productName"
                                                            value={item.name}
                                                            onChange={(e) => handleItemChange(index, e, i)}
                                                            className="form-control"
                                                            placeholder="Name"
                                                            disabled={false}
                                                            required
                                                        />

                                                        <div className='mt-3' style={{ display: 'flex', gap: '10px' }}>
                                                            <Tooltip title="Add Material" arrow>
                                                                <IconButton
                                                                    onClick={(e) => {
                                                                        handleItemChange(index, e, i);
                                                                        tog_standard();
                                                                    }}
                                                                    color="primary"
                                                                    aria-label="add"
                                                                    size="large"
                                                                    sx={{
                                                                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                                                        '&:hover': { backgroundColor: 'rgba(0, 0, 255, 0.2)' }
                                                                    }}
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Delete Item" arrow>
                                                                <IconButton
                                                                    onClick={() => handleDeleteItem(i)}
                                                                    color="secondary"
                                                                    aria-label="delete"
                                                                    size="large"
                                                                    sx={{
                                                                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                                        '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.2)' }
                                                                    }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Duplicate Item" arrow>
                                                                <IconButton
                                                                    onClick={() => handleDuplicateItem(i)}
                                                                    color="default"
                                                                    aria-label="duplicate"
                                                                    size="large"
                                                                    sx={{
                                                                        backgroundColor: 'rgba(128, 128, 128, 0.1)',
                                                                        '&:hover': { backgroundColor: 'rgba(128, 128, 128, 0.2)' }
                                                                    }}
                                                                >
                                                                    <FileCopyIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                        <div className='mt-3' >
                                                            <input type="file"
                                                                name="image"
                                                                accept="image/*"
                                                                multiple onChange={(e) => handleFileChange(index, e, i)}
                                                                ref={(input) => {
                                                                    if (input) input.setAttribute('data-max-files', 5);
                                                                }}
                                                            />
                                                            <div>
                                                                {item.images != null && (
                                                                    <div>
                                                                        {item.images.map((imageFile, io) => {
                                                                            const imageUrl = URL.createObjectURL(imageFile); 
                                                                            return (
                                                                                <div key={io} className="image-wrapper" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
                                                                                    <img
                                                                                        src={imageUrl}
                                                                                        alt={`image-${io}`}
                                                                                        onClick={() => handleImageClick(io)}
                                                                                        style={{
                                                                                            maxWidth: imageInFullScreen === io ? '100%' : '80px',
                                                                                            height: imageInFullScreen === io ? '100vh' : 'auto',
                                                                                            margin: '5px',
                                                                                            cursor: 'pointer',
                                                                                            objectFit: imageInFullScreen === io ? 'contain' : 'cover',
                                                                                            position: imageInFullScreen === io ? 'fixed' : 'static',
                                                                                            top: imageInFullScreen === io ? '0' : 'auto',
                                                                                            left: imageInFullScreen === io ? '0' : 'auto',
                                                                                            zIndex: imageInFullScreen === io ? 1000 : 'auto',
                                                                                            backgroundColor: imageInFullScreen === io ? 'rgba(0,0,0,0.9)' : 'transparent',
                                                                                        }}
                                                                                       
                                                                                    />

                                                                                    <Tooltip title="View Image" arrow>
                                                                                        <IconButton
                                                                                            onClick={() => handleImageClick(io)} // Handle fullscreen view
                                                                                            color="primary"
                                                                                            size="small"
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                top: '5px',
                                                                                                right: '45px',
                                                                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                                                            }}
                                                                                        >
                                                                                            <VisibilityIcon />
                                                                                        </IconButton>
                                                                                    </Tooltip>

                                                                                    <Tooltip title="Delete Image" arrow>
                                                                                        <IconButton
                                                                                            onClick={() => handleDeleteImage(i, io)} // Delete the image
                                                                                            color="secondary"
                                                                                            size="small"
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                top: '5px',
                                                                                                right: '5px',
                                                                                                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                                                                            }}
                                                                                        >
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </td>
                                                )}
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={subProduct.name}
                                                        onChange={(e) => handleItemChange(index, e, i)}
                                                        className="form-control"
                                                        placeholder="Material"
                                                    />
                                                </td>
                                                <td>
                                                    {subProduct.SubProductUnits?.length === 0 ? (
                                                        <Select
                                                            name="unit_id" 
                                                            onChange={(selectedOption) => handelUnitsChange(selectedOption, index, i)}
                                                            options={transformedUnitList}
                                                            classNamePrefix="select2-selection" 
                                                        />
                                                    ) : (
                                                        subProduct.SubProductUnits.map((unit, i) => (
                                                            <div key={unit.units.name}>{unit.units.name}</div> 
                                                        ))
                                                    )}

                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="qty"
                                                        value={subProduct.qty}
                                                        onChange={(e) => handleItemChange(index, e, i)}
                                                        className="form-control"
                                                        placeholder="Quantity"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={subProduct.price}
                                                        onChange={(e) => handleItemChange(index, e, i)}
                                                        className="form-control"
                                                        placeholder="Rate"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="amount"
                                                        value={subProduct.amount}
                                                        onChange={(e) => handleItemChange(index, e, i)}
                                                        className="form-control"
                                                        placeholder="Amount"
                                                    />
                                                </td>
                                                {index === 0 && (
                                                    <td rowSpan={item.subProduct.length} className='align-content-center'>
                                                        <div className='d-flex'>

                                                            <input
                                                                type="text"
                                                                name="total"
                                                                value={item.total}
                                                                onChange={(e) => handleItemChange(index, e, i)}
                                                                className="form-control"
                                                                placeholder="Total"
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div>
                    <button
                        type="submit"
                        id='save'
                        className="btn btn-primary mb-3"
                        disabled={isEnabled}
                    >
                        save
                    </button>
                    <button
                        type="submit"
                        id='save_pdf'
                        className="btn btn-danger mb-3 mx-3"
                        disabled={isEnabled}
                    >
                        save & pdf
                    </button>

                </form>
            </div>
            <Modal
                size="md"
                isOpen={addModel}
                toggle={() => {
                    tog_large()
                }}
                centered
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="myLargeModalLabel"
                    >
                        Products
                    </h5>
                    <button
                        onClick={() => {
                            setAddModel(false)
                        }}
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Select
                        type="number"
                        name="product_id"
                        value={selectedGroup}
                        onChange={handleEditSelectGroup}
                        options={transformedProductList}
                        classNamePrefix="select2-selection"
                    />
                </div>
            </Modal>
            <Modal
                isOpen={modal_standard}
                toggle={tog_standard}
            >
                <div className="modal-header">
                    <h5 className="modal-title mt-0" id="myModalLabel">
                        Add Merchant Sub Product
                    </h5>
                    <button
                        type="button"
                        onClick={() => setModal_standard(false)}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
                        <div className="form-group">
                            <label htmlFor="name"> Name</label>
                            <input
                                type="text"
                                name="name"
                                value={addItem.name}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                            <label htmlFor="unit_id" className='mt-2'>Units</label>
                            <Select
                                name="unit_id"
                                value={selectedGroup1}
                                onChange={handleSelectGroup}
                                options={transformedUnitList}
                                classNamePrefix="select2-selection"
                                isMulti
                            />
                            <label htmlFor="price" className='mt-2'>Price</label>
                            <input
                                type="text"
                                name="price"
                                value={addItem.price}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary mt-3"
                                onClick={tog_standard}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success waves-effect waves-light mt-3"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </React.Fragment>
    );
}

export default Estimate;
