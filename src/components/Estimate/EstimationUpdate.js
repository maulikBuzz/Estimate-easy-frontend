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
import { APP_URL } from "../../config/constants";


import { useParams, useNavigate } from 'react-router-dom'

function EstimationUpdate() {
  const navigate = useNavigate();
  const { customer_id } = useParams()

  const [isEnabled, setIsEnabled] = useState(false)
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedGroup1, setSelectedGroup1] = useState(null)
  const [unitList, setUnitList] = useState([]);
  const [merchant_id, setMerchantId] = useState();
  const [id, setMerchantProductId] = useState();
  const [showAlert, setShowAlert] = useState(true);

  const [addItem, setAddItem] = useState({
    name: "",
    merchant_product_id: '',
    merchant_id: merchant_id,
    price: 0,
    unit_id: []
  });

  function handleSelectGroup(selectedGroups) {
    setSelectedGroup1(selectedGroups);
    const unit_ids = selectedGroups.map(group => group.value);

    setAddItem({ ...addItem, unit_id: unit_ids });
  }

  const transformedUnitList = unitList.map(unit => ({
    value: unit.id,
    label: unit.name
  }));

  const handleDuplicateItem = (i) => {
    const { id, subProduct, ...duplicatedItem } = tables[i];

    const updatedSubProduct = subProduct.map(({ id, ...restSubProduct }) => ({
      ...restSubProduct,
    }));

    const updatedTables = [
      ...tables.slice(0, i + 1),
      { ...duplicatedItem, subProduct: updatedSubProduct, images: [] },
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

  async function fetchGetEstimate() {
    const res = await Estimation.getEstimate({ customer_id });
    const { data } = res;

    const existCustomer = data?.data.customer
    const existQuotationDetail = data?.data.quotation.quotationDetail
    const existQuotationItems = data?.data.quotation.quotationItem ? data?.data.quotation.quotationItem : []

    const customerData = {
      name: existCustomer.name,
      phone: existCustomer.contact_no,
      address: existCustomer.address,
      reference: existQuotationDetail.quote_by,
    }

    const formattedDate = new Date(existCustomer.created_at).toISOString().slice(0, 10);
    const QuotationDetailData = {
      quotationNo: existQuotationDetail.quote_number,
      date: formattedDate,
      salesRep: existQuotationDetail.sales_rep,
    }

    setCustomer(customerData)
    setQuotation(QuotationDetailData)

    setTables(existQuotationItems)
  }

  useEffect(() => {
    fetchGetEstimate();
    setIsSubmitted(false);
  }, []);

  const handleDeleteItem = async (i) => {
    const updatedTables = tables.filter((_, index) => index !== i);

    await Estimation.deleteQuotationItem(tables[i].id);
    setTables(updatedTables);
  };


  const handleItemChange = (index, e, i) => {
    const updatedItems = tables.map((subProducts, io) => {
      if (io === i) {
        const data = subProducts.subProduct.map((item, it) => {
          if (it === index) {
            setMerchantProductId(item.merchant_product_id)

            let updatedItem = { ...item };

            if (["qty", "name", "price"].includes(e.target.name)) {
              const newValue = e.target.value;

              if (e.target.name === "qty") {
                updatedItem.qty = newValue;
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
        let name = subProducts.name
        if (e.target.name === "productName") {
          name = e.target.value
        }
        return {
          ...subProducts,
          subProduct: data,
          total,
          name

        };
      }
      return subProducts;
    });
    setTables(updatedItems);
  };

  useEffect(() => {
    const totalData = tables.map((item) => item.total)
    const hasInvalidValue = totalData.some(value => value === null || value === undefined || value === 0);

    setIsEnabled(hasInvalidValue ? true : false);
  }, [tables]);

  async function handleEditSelectGroup(selectedGroup) {
    setSelectedGroup(selectedGroup);

    const subProduct1 = await handleSubProduct(selectedGroup.merchant_product_id);

    selectedGroup.item_name = selectedGroup.label

    const subProduct = subProduct1.map(product => {
      const { id, ...rest } = product;

      // const unit_of_measure = product.SubProductUnits.length > 0 ? product.SubProductUnits.map((item) => item.units.name)[0] : '';
      const unit_of_measure = product.unit_of_measure == null ? product.SubProductUnits.map((item) => item.units.name)[0] : '';

      const updatedProduct = { material_id: id, ...rest, unit_of_measure };

      return updatedProduct;
    });

    const updatedGroup = { ...selectedGroup, subProduct };
    console.log(updatedGroup);

    setTables([...tables, updatedGroup]);

    setAddModel(!addModel);
  }

  useEffect(() => {
    if (productList.length > 0) {
      const transformed = productList.map(product => ({
        value: product.id,
        label: product.products.name,
        product_id: product.product_id,
        merchant_product_id: product.id
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
      let userDataRecord = [];
      const res = await user.getUser();
      const { data } = res;

      userDataRecord = data?.data;

      setMerchantId(userDataRecord.merchant_id);
      if (userDataRecord != null) {
        const res = await merchantProducts.getMerchantProductList(userDataRecord.merchant_id);
        const { data } = res;

        setProductList(data?.data);
      }

      setQuotation((prevQuotation) => ({
        ...prevQuotation,
        salesRep: prevQuotation.salesRep !== "" ? prevQuotation.salesRep : data?.data?.name,
        salesContact: data?.data?.phone_number,
      }));
    }

    fetchUserData();
  }, [isSubmitted, quotation.salesRep]);

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

        const { id, ...rest } = finalData;
        const updatedProduct = { material_id: id, ...rest };

        product.subProduct.push(updatedProduct)
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
      setAddItem({ name: "", merchant_product_id: '', merchant_id: merchant_id, price: 0, unit_id: [] });
      setErrorMessage("");
      setSelectedGroup(null)
    }
    removeBodyCss();
  }

  async function createEstimate(e) {
    e.preventDefault()

    if (!customer.phone || !/^\d{10}$/.test(customer.phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      setShowAlert(true);
      return;
    }
    const isPdf = (e.nativeEvent.submitter.id === "save_pdf") ? true : false
    if (tables.length !== 0) {
      const mappedData = tables.map(item => {
        return {
          item_name: item.item_name,
          total: item.total,
          product_id: item.product_id,
          name: item.name,
          id: item.id,
          images: item.images,
          material: item.subProduct.map(sub => {
            console.log(sub.SubProductUnits, "hema");

            return {
              material_id: sub.material_id,
              id: sub.id ? sub.id : '',
              qty: sub.qty ? sub.qty : "0",
              price: sub.price,
              unit_of_measure: sub.unit_of_measure
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
        quote_number: quotation.quotationNo,
        quote_by: customer.reference,
        merchant_id: merchant_id,
        quotationItems: mappedData
      }

      const data = await Estimation.updateEstimate({ finalData, customer_id });
      if (isPdf) {
        const response = await Estimation.generatePdf(data?.data?.data.customer_id);
        if (response.data) {
          const { data, name } = await response.data;

          const byteCharacters = atob(data);
          const byteNumbers = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const file = new Blob([byteNumbers], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);

          let customFileName = `${name}.pdf`;
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
      } else {
        setErrorMessage('');
        navigate("/user/customer/list");
      }

    } else {
      setErrorMessage("Please provide at least one estimate.")
    }
  }

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setErrorMessage('')
      }, 3000);
      return () => {
        clearTimeout(timer)
        setShowAlert(true);
      };
    }
  }, [errorMessage]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageInFullScreen, setImageInFullScreen] = useState(null); // Track which image is in full screen

  const handleImageClick = (imageIndex) => {
    setImageInFullScreen(imageInFullScreen === imageIndex ? null : imageIndex); // Toggle full-screen
  };

  const handleDeleteImage = async (tableIndex, imageIndex, id) => {

    if (id != null) {
      await Estimation.deleteQuotationImage(id);

      setTables((prevTables) =>
        prevTables.map((table) => ({
          ...table,
          images: table.images.filter(image => image.id !== id)
        }))
      );
    } else {
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
    }
  };

  const handelUnitsChange = (selectedOption, index, i) => {

    const data = {
      units: {
        name: selectedOption.label
      }
    };

    const updatedTables = [...tables];

    updatedTables[i].subProduct[index].SubProductUnits.push(data);

    updatedTables[i].subProduct[index].unit_of_measure = selectedOption.label
    setTables(updatedTables);
  };

  const [selectedImages] = useState(tables.map(() => []));

  const handleFileChange = (index, e, i) => {
    const maxFiles = 5;

    const updatedItems = tables.map((Products, io) => {

      if (io === i) {
        const files = e.target.files;

        const fileArray = Array.from(files);

        const productFileCount = Products?.images != null ? Products?.images.length : 0
        const finalData = files?.length + productFileCount

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
        if (Products?.images == null) {
          return {
            ...Products,
            images: [...fileArray]
          };
        } else {
          return {
            ...Products,
            images: [...Products.images, ...fileArray]
          };
        }
      }
      return Products
    })

    setTables(updatedItems)
    e.target.value = null;
  };

  return (
    <React.Fragment>
      <div className="container my-4 p-4 border rounded shadow bg-white">
        <h1 className="mb-4">Estimate</h1>
        <form onSubmit={createEstimate} >
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
                <label htmlFor="quotationNo" className="col-4 col-form-label">Quotation No.</label>
                <div className="col-8">
                  <input
                    type="text"
                    id="quotationNo"
                    name="quotationNo"
                    value={quotation.quotationNo}
                    onChange={handleQuotationChange}
                    className="form-control"
                    placeholder="Enter quotation number"
                    disabled
                  />
                </div>
              </div>
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
              <div className={isFullScreen ? 'full-screen' : ''}> {/* Full-screen class */}
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
                    <tbody key={i}>
                      {item.subProduct && item.subProduct.map((subProduct, index) => (
                        <tr key={index}>
                          {index === 0 && (
                            <td rowSpan={item.subProduct.length} className=''>
                              <label htmlFor="name">{item.item_name}</label>
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

                              <div className='mt-3' style={{ display: 'flex', gap: '10px' }}>
                                <input type="file" name="image" accept="image/*" multiple onChange={(e) => handleFileChange(index, e, i)} ref={(input) => {
                                  if (input) input.setAttribute('data-max-files', 5);
                                }} />
                                <div>
                                  {selectedImages.length > 0 && (
                                    <div>
                                      {selectedImages.map((image, index) => (
                                        <img
                                          key={index}
                                          src={image}
                                          alt={`preview-${index}`}
                                          style={{ width: "80px", margin: "5px" }}
                                        />

                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className='mt-5'>
                                <div className="image-container">
                                  {item.images && item.images.map((image, io) => {
                                    const imageUrl = (APP_URL + image.image_url) ?? URL.createObjectURL(image);
                                    return (
                                      <div className="image-wrapper" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
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
                                            onClick={() => handleDeleteImage(i, io, image.id)} // Delete the image
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

                              disabled
                            />
                          </td>
                          <td>
                            {/* {subProduct.unit_of_measure == "" ? (
                              <Select
                                name="unit_id"
                                onChange={(selectedOption) => handelUnitsChange(selectedOption, index, i)}
                                options={transformedUnitList}
                                classNamePrefix="select2-selection"
                              />
                            ) : (
                              
                                <div key={subProduct.unit_of_measure}>{subProduct.unit_of_measure}</div>
                             
                            )} */}
                            {(subProduct.SubProductUnits && subProduct.SubProductUnits.length > 0) ? (
                              subProduct.SubProductUnits.map((unit, i) => (
                                <div key={unit.units.name}>{unit.units.name}</div>
                              ))
                            ) : (
                              (subProduct.unit_of_measure === "" || subProduct.unit_of_measure == null) ? (
                                <Select
                                  name="unit_id"
                                  onChange={(selectedOption) => handelUnitsChange(selectedOption, index, i)}
                                  options={transformedUnitList}
                                  classNamePrefix="select2-selection"
                                />
                              ) : (
                                <div key={subProduct.unit_of_measure}>{subProduct.unit_of_measure}</div>
                              )
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
            Add Material
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

export default EstimationUpdate
