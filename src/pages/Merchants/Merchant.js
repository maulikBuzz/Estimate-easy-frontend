import React, { useState, useEffect } from 'react'
import merchants from '../../services/Merchants'
import businessCategory from '../../services/businessCategory'

import { MDBDataTable } from "mdbreact"
import {
    Card,
    CardBody,
    Col,
    Row,
    Modal,
    Alert,
} from "reactstrap"

import Select from "react-select"
import { Link } from 'react-router-dom'

function Merchant() {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [merchantList, setMerchantList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [addItem, setAddItem] = useState({
        name: "",
        business_category_id: 0,
        address: "",
        city: "",
        state: ""
    }); 
    const [modal_standard, setModal_standard] = useState(false);
    const [editModel, setEditModel] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null); 
    const [deleteModel, setDeleteModel] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    function handleSelectGroup(selectedGroup) { 
        setSelectedGroup(selectedGroup)
        const business_category_id = selectedGroup.value
        setAddItem({ ...addItem, business_category_id })
        setEditingItem({ ...editingItem, business_category_id })
    }
    const [categoryList, setCategoryList] = useState([]);

    const transformedCategoryList = categoryList.map(category => ({
        value: category.id,
        label: category.name
    }));
 
    const handleEdit = (id) => {
        const itemToEdit = merchantList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    };
    const handleDelete = async (id) => {
        const itemToEdit = merchantList.find((item) => item.id === id);
        setDeleteItem(itemToEdit);
    };

    const handleSaveDelete = async (id) => { 
        const deleteProductData = await merchants.deleteMerchant(id);

        if (deleteProductData.data.status) {
            setDeleteItem(null)
            setIsSubmitted(true);
            deleteStd()
            setErrorMessage("")
        } else {
            setErrorMessage(deleteProductData.data.message)
        }
    };

    const handleSaveEdit = async (id, updatedData) => { 
        const editMerchantData = await merchants.editMerchant(id, updatedData);

        if (editMerchantData.data.status) {
            setEditingItem(null);
            setIsSubmitted(true);
            setErrorMessage("");
            edit();  
        } else {
            setErrorMessage(editMerchantData.data.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();  
        const addMerchant = await merchants.addMerchant(addItem);

        if (addMerchant.data.status) {
            setModal_standard(false);
            setIsSubmitted(true);
            setErrorMessage("");
            setAddItem({ name: "", business_category_id: 0, address: "", city: "", state: "" });
        } else {
            setErrorMessage(addMerchant.data.message);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const res = await merchants.getMerchantList();
            const { data } = res;
            setMerchantList(data?.data);
        }
        async function fetchCategoryData() {
            const res = await businessCategory.getBusinessCategoryList();
            const { data } = res;
            setCategoryList(data?.data)
        }
        fetchCategoryData();
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted]);

    const data = {
        columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Merchant Name", field: "name", sort: "asc" },
            { label: "Business category", field: "businessCategory", sort: "asc" },
            { label: "Address", field: "address", sort: "asc" },
            { label: "City", field: "city", sort: "asc" },
            { label: "State", field: "state", sort: "asc" },
            { label: "Actions", field: "actions", sort: "disabled" },
        ], 
        rows: merchantList.map((item) => ({
            id: item.id,
            name: (<Link to={`/admin/merchant/info/${item.id}`}>{item.name}</Link>),
            address: item.address,
            businessCategory: item.businessCategory.name,
            city: item.city,
            state: item.state,
            actions: (
                <div>
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                            handleEdit(item.id);
                            edit();
                            setErrorMessage("");
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
                        style={{  marginRight: "10px" }}
                    >
                        Delete
                    </button>
                </div>
            ),
        })),
    };

    function tog_standard() {
        setModal_standard(!modal_standard);
        if (!modal_standard) {
            setAddItem({ name: "", business_category_id: 0, address: "", city: "", state: "" });
            setSelectedGroup(null)
            setErrorMessage(""); 
        }
        removeBodyCss();
    }

    function edit() {
        setEditModel(!editModel);
        removeBodyCss();
    }

    function deleteStd() {
        setDeleteModel(!deleteModel)
        removeBodyCss()
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddItem((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div className='d-flex justify-content-between'>
                                <h3 className='mt-3'>Merchants</h3>
                                <div>
                                    <Col className="d-flex align-items-center">
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={tog_standard}
                                                className="btn btn-primary waves-effect waves-light"
                                                data-toggle="modal"
                                                data-target="#myModal"
                                            >
                                                Add merchant
                                            </button>
                                            <Modal
                                                isOpen={modal_standard}
                                                toggle={tog_standard}
                                            >
                                                <div className="modal-header">
                                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                                        Add Merchant
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
                                                            <label htmlFor="name">Merchant Name</label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={addItem.name}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />
                                                            <label htmlFor="businessCategory" className='mt-2'>Business Category</label>
                                                            <Select
                                                                type="number"
                                                                name="business_category_id"
                                                                value={selectedGroup}
                                                                onChange={handleSelectGroup}
                                                                options={transformedCategoryList}
                                                                classNamePrefix="select2-selection"
                                                            />
                                                            <label htmlFor="address" className='mt-2'>Address</label>
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                value={addItem.address}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />
                                                            <label htmlFor="city" className='mt-2'>City</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={addItem.city}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />
                                                            <label htmlFor="state" className='mt-2'>State</label>
                                                            <input
                                                                type="text"
                                                                name="state"
                                                                value={addItem.state}
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
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <MDBDataTable responsive striped bordered data={data} />
                            </div>
                            <Modal
                                isOpen={editModel}
                                toggle={edit}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title mt-0" id="myModalLabel1">
                                        Edit Merchant
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
                                                        name: e.target.name.value,
                                                        business_category_id: e.target.business_category_id.value,
                                                        address: e.target.address.value,
                                                        city: e.target.city.value,
                                                        state: e.target.state.value,
                                                    });
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
                                                <div className="form-group">
                                                    <label htmlFor="name" className='mt-2'>Merchant Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        defaultValue={editingItem.name}
                                                        className="form-control"
                                                    />
                                                    <label htmlFor="business_category_id" className='mt-2'>Business category</label>
                                                    <Select
                                                        type="number"
                                                        name="business_category_id"
                                                        value={selectedGroup}
                                                        onChange={handleSelectGroup}
                                                        options={transformedCategoryList}
                                                        classNamePrefix="select2-selection"
                                                    />
                                                    <label htmlFor="address" className='mt-2'>Address</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        defaultValue={editingItem.address}
                                                        className="form-control"
                                                    />
                                                    <label htmlFor="city" className='mt-2'>City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        defaultValue={editingItem.city}
                                                        className="form-control"
                                                    />
                                                    <label htmlFor="state" className='mt-2'>State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        defaultValue={editingItem.state}
                                                        className="form-control"
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
                                            {/* <div className="p-2 mb-2 bg-danger-subtle text-danger">Are you sure want to delete this product</div> */}
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
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default Merchant;
