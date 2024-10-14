import React, { useEffect, useState } from 'react'
import merchantProducts from '../../services/merchantProduct'
import product from '../../services/products'

import { MDBDataTable } from "mdbreact"

import {
    Card,
    CardBody,
    Col,
    Row,
    Modal,
    Alert,
} from "reactstrap"
import Select from "react-select/creatable"
import { Link, useParams } from 'react-router-dom'

function MerchantProduct({  business_category_id, sendId }) {

    const { id } = useParams()
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [categoryList, setCategoryList] = useState([]);
    const [merchantProductsList, setMerchantProductsList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [addItem, setAddItem] = useState({
        product_id: 0,
        merchant_id: id,
    });
    const [addModel, setAddModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteModel, setDeleteModel] = useState(false)
    const [duplicateItem, setDuplicateItem] = useState(null);
    const [duplicateModel, setDuplicateModel] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    async function selectedEditGroup(selectedGroup) {
        const addProduct = await product.addProduct({ name: selectedGroup.label, business_category_id });
        const finalData = {
            value: addProduct?.data?.data.id,
            label: addProduct?.data?.data.name
        }
        return finalData
    }
    async function selectedDuplicateGroup(selectedGroup) {
        const addProduct = await product.addProduct({ name: selectedGroup.label, business_category_id });
        const finalData = {
            value: addProduct?.data?.data.id,
            label: addProduct?.data?.data.name
        }
        return finalData
    }

    async function handleSelectGroup(selectedGroup) {
        let selectedGroupData = ''
        if (selectedGroup.__isNew__) {
            selectedGroupData = await selectedEditGroup(selectedGroup)

            const res = await product.getProductList(business_category_id, id);
            const { data } = res;
            setCategoryList(data?.data)
        } else {
            selectedGroupData = selectedGroup
        }

        setSelectedGroup(selectedGroupData)
        const product_id = selectedGroupData?.value
        setAddItem({ ...addItem, product_id })
        setEditingItem({ ...editingItem, product_id })
    }

    async function handleDuplicateSelectGroup(selectedGroup) {
        let selectedGroupData = ''
        if (selectedGroup.__isNew__) {
            selectedGroupData = await selectedDuplicateGroup(selectedGroup)

            const res = await product.getProductList(business_category_id, id);
            const { data } = res;
            setCategoryList(data?.data)
        } else {
            selectedGroupData = selectedGroup
        }

        setSelectedGroup(selectedGroupData)
        const product_id = selectedGroupData?.value
        setAddItem({ ...addItem, product_id })
        setDuplicateItem({ ...duplicateItem, product_id })
    }

    async function handleEditSelectGroup(selectedGroup) {
        let selectedGroupData = ''
        if (selectedGroup.__isNew__) {
            selectedGroupData = await selectedEditGroup(selectedGroup)

            const res = await product.getProductList(business_category_id, id);
            const { data } = res;
            setCategoryList(data?.data)
        } else {
            selectedGroupData = selectedGroup
        }

        const product_id = selectedGroupData?.value
        setSelectedGroup(selectedGroupData)
        setAddItem({ ...addItem, product_id })
        setEditingItem({ ...editingItem, product_id })
    }

    const transformedCategoryList = categoryList.map(category => ({
        value: category.id,
        label: category.name
    }));

    const handleEdit = async (id) => {
        const itemToEdit = merchantProductsList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    };
    const handleDuplicate = async (id) => {
        const itemToEdit = merchantProductsList.find((item) => item.id === id);
        setDuplicateItem(itemToEdit);
    };

    const handleDelete = async (id) => {
        const itemToEdit = merchantProductsList.find((item) => item.id === id);
        setDeleteItem(itemToEdit);
    };

    const handleSaveEdit = async (id, updatedData) => {
        const editMerchantProductsData = await merchantProducts.editMerchantProduct(id, updatedData);

        if (editMerchantProductsData.data.status) {
            setEditingItem(null)
            setIsSubmitted(true);
            edit()
            setErrorMessage("")
        } else {
            setErrorMessage(editMerchantProductsData.data.message)
        }
    };
    const handleSaveDuplicate = async (merchant_product_id, product_id) => {
         
        const editMerchantProductsData = await merchantProducts.duplicateMerchantProduct(merchant_product_id, product_id);

        if (editMerchantProductsData.data.status) {
            setDuplicateItem(null)
            setIsSubmitted(true);
            duplicate()
            setErrorMessage("")
        } else {
            setErrorMessage(editMerchantProductsData.data.message)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const addMerchantProducts = await merchantProducts.addMerchantProduct(addItem);

        if (addMerchantProducts.data.status) {
            setAddModel(null)
            setIsSubmitted(true);
            setErrorMessage("")
        } else {
            setErrorMessage(addMerchantProducts.data.message)
        }
    };

    const handleSaveDelete = async (id) => {
        const deleteProductData = await merchantProducts.deleteMerchantProduct(id);

        if (deleteProductData.data.status) {
            setDeleteItem(null)
            setIsSubmitted(true);
            deleteStd()
            setErrorMessage("")
        } else {
            setErrorMessage(deleteProductData.data.message)
        }
    };

    useEffect(() => {
        async function fetchData() {
            console.log(id, "hshshsh");
            
            const res = await merchantProducts.getMerchantProductList(id);
            const { data } = res;

            setMerchantProductsList(data?.data);
        }

        async function fetchProductData() {
            const res = await product.getProductList(business_category_id, id);
            const { data } = res;
            setCategoryList(data?.data)
        }

        fetchProductData();
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted, id, business_category_id]);

    function getId(id) {
        sendId(id);
    }

    console.log();
    const data = {
        columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Product Name", field: "product", sort: "asc" },
            { label: "Actions", field: "actions", sort: "disabled" },
        ],
        rows: merchantProductsList.length > 0 ? merchantProductsList.map((item) => ({
            id: item.id,
            product: (<Link onClick={() => getId(item.id)}>{item?.products?.name}</Link>),
            actions: (
                <div>
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                            handleEdit(item.id);
                            edit();
                            setErrorMessage("")
                            existProductId(item.product_id)
                        }}
                        style={{
                            backgroundColor: "#7a6fbe",
                            color: "#fff",
                            borderColor: "#7a6fbe",
                            marginRight: "10px",
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            handleDelete(item.id);
                            deleteStd();
                            setErrorMessage("")
                        }}
                        style={{ marginRight: "10px", }}
                    >
                        Delete
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                            handleDuplicate(item.id);
                            duplicate()
                            setErrorMessage("")
                        }}
                        style={{ marginRight: "10px", }}
                    >
                        Duplicate
                    </button>
                </div>
            ),
        })) : []
    };

    function tog_standard() {
        setAddModel(!addModel)
        if (!addModel) {
            setAddItem({ product_id: 0, merchant_id: id });
            setErrorMessage("");
            setSelectedGroup(null)
        }
        removeBodyCss()
    }

    async function edit() {
        setEditModel(!editModel)
        removeBodyCss()
    }
    async function duplicate() {
        setDuplicateModel(!duplicateModel)
        setSelectedGroup(null)
        removeBodyCss()
    }

    function deleteStd() {
        setDeleteModel(!deleteModel)
        removeBodyCss()
    }

    async function existProductId(id) {
        const res = await product.getProduct(id);
        const { data } = res;;

        const finalData = {
            value: data?.data?.id,
            label: data?.data?.name
        }
        setSelectedGroup(finalData)
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div className='d-flex justify-content-between'>
                                <h3 className='mt-3'>Merchant Products</h3>
                                <div>
                                    <Col className="d-flex align-items-center">
                                        <div className="text-center">

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    tog_standard()
                                                }}
                                                className="btn btn-primary waves-effect waves-light"
                                                data-toggle="modal"
                                                data-target="#myModal"
                                            >
                                                Add Merchant Products
                                            </button>
                                            <Modal
                                                isOpen={addModel}
                                                toggle={() => {
                                                    tog_standard()
                                                }}
                                            >
                                                <div className="modal-header">
                                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                                        Add Merchant Product
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAddModel(false)
                                                        }}
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
                                                            <label htmlFor="product_id" className='mt-2'>Product</label>
                                                            <Select
                                                                type="number"
                                                                name="product_id"
                                                                value={selectedGroup}
                                                                onChange={handleSelectGroup}
                                                                options={transformedCategoryList}
                                                                classNamePrefix="select2-selection"
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
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <MDBDataTable responsive striped bordered data={data} noRecordsFound="no data found" />
                            </div>
                            <Modal
                                isOpen={editModel}
                                toggle={edit}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title mt-0" id="myModalLabel1">
                                        Edit Merchant Product
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="close"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {editingItem && (
                                        <div style={{ marginTop: "20px" }}>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSaveEdit(editingItem.id, {
                                                        product_id: e.target.product_id.value,
                                                    });
                                                    existProductId(editingItem.product_id)
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}

                                                <div className="form-group">
                                                    <label htmlFor="product_id">Product</label>
                                                    <Select
                                                        type="number"
                                                        name="product_id"
                                                        value={selectedGroup}
                                                        onChange={handleEditSelectGroup}
                                                        options={transformedCategoryList}
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary mt-3"
                                                        onClick={edit}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success waves-effect waves-light mt-3"
                                                        onClick={async () => { await existProductId(editingItem.product_id) }}
                                                    >
                                                        Save changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </Modal>
                            <Modal
                                isOpen={deleteModel}
                                toggle={() => {
                                    deleteStd()
                                }}
                            >
                                <div className="modal-header">
                                    <h3 className="modal-title mt-0" id="myModalLabel1">
                                        Delete Product
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeleteItem(false)
                                        }}
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {deleteItem && (
                                        <div style={{ marginTop: "20px" }}>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSaveDelete(deleteItem.id)
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}

                                                <div className='d-flex text-aline-center'>Are you sure you want to delete this product? </div>
                                                <div className="modal-footer mt-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary mt-3"
                                                        style={{ marginLeft: "10px" }}
                                                        onClick={() => {
                                                            setDeleteItem(null);
                                                            deleteStd();
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-danger waves-effect waves-light  mt-3"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </Modal>
                            <Modal
                                isOpen={duplicateModel}
                                toggle={duplicate}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title mt-0" id="myModalLabel1">
                                        Duplicate Merchant
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={() => setDuplicateItem(null)}
                                        className="close"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {duplicateItem && (
                                        <div style={{ marginTop: "20px" }}>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSaveDuplicate(duplicateItem.id, parseInt(e.target.product_id.value)); 
                                                  
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}

                                                <div className="form-group">
                                                    <label htmlFor="product_id">product</label>
                                                    <Select
                                                        type="number"
                                                        name="product_id"
                                                        value={selectedGroup}
                                                        onChange={handleDuplicateSelectGroup}
                                                        options={transformedCategoryList}
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary mt-3"
                                                        onClick={duplicate}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success waves-effect waves-light mt-3" 
                                                       
                                                    >
                                                        Duplicate Item
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </Modal>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default MerchantProduct
