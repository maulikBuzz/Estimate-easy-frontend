import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
import { Link } from 'react-router-dom';

function Product() {
    const { id } = useParams()

    const [productList, setProductList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [addItem, setAddItem] = useState(null);
    const [addModel, setAddModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [deleteModel, setDeleteModel] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleEdit = async (id) => {
        const itemToEdit = productList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    };

    const handleDelete = async (id) => {
        const itemToEdit = productList.find((item) => item.id === id);
        setDeleteItem(itemToEdit);
    };

    const handleSaveEdit = async (id, updatedData) => {
        const editProductData = await product.editProduct(id, updatedData);

        if (editProductData.data.status) {
            setEditingItem(null)
            setIsSubmitted(true);
            edit()
            setErrorMessage("")
        } else {
            setErrorMessage(editProductData.data.message)
        }
    };
    const handleSaveDelete = async (id) => {
        const deleteProductData = await product.deleteProduct(id);

        if (deleteProductData.data.status) {
            setDeleteItem(null)
            setIsSubmitted(true);
            deleteStd()
            setErrorMessage("")
        } else {
            setErrorMessage(deleteProductData.data.message)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const addProduct = await product.addProduct({ name: addItem, business_category_id: id });

        if (addProduct.data.status) {
            setAddItem(null)
            setAddModel(null)
            setIsSubmitted(true);
            setErrorMessage("")
        } else {
            setErrorMessage(addProduct.data.message)
        }
    };

    useEffect(() => {
        async function fetchData() {
            const res = await product.getProductList(id);
            const { data } = res;
            setProductList(data?.data)
        }
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted, id]);

    const idData = {
        columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Product Name", field: "name", sort: "asc" },
            { label: "Actions", field: "actions", sort: "disabled" },
        ],

        rows: productList.map((item) => ({
            id: item.id,
            name: item.name,
            actions: (
                <div>
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                            handleEdit(item.id);
                            edit();
                            setErrorMessage("")
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
                        style={{ marginRight: "10px" }}
                    >
                        Delete
                    </button>
                </div>
            ),
        })),
    };

    const allData = {
        columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Product Name", field: "name", sort: "asc" },
            { label: "Business Category", field: "businessCategory", sort: "asc" }
        ],
        rows: productList.map((item) => ({
            id: item.id,
            name: item.name,
            businessCategory: (<Link to={`/admin/product/${item.businessCategory.id}`}>{item.businessCategory.name}</Link>)
        })),
    };

    const data = (id == null) ? allData : idData

    function tog_standard() {
        setAddModel(!addModel)
        removeBodyCss()
    }
    function edit() {
        setEditModel(!editModel)
        removeBodyCss()
    }
    function deleteStd() {
        setDeleteModel(!deleteModel)
        removeBodyCss()
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
                                {id ? <h3 className='mt-3'>Business Products</h3> : <h3 className='mt-3'>All Business Products</h3>} 
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
                                                Add product
                                            </button>
                                            <Modal
                                                isOpen={addModel}
                                                toggle={() => {
                                                    tog_standard()
                                                }}
                                            >
                                                <div className="modal-header">
                                                    <h3 className="modal-title mt-0" id="myModalLabel">
                                                        Add Product
                                                    </h3>
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
                                                            <label htmlFor="name">Product Name</label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                value={addItem}
                                                                onChange={(e) => setAddItem(e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary mt-3"
                                                                style={{ marginLeft: "10px" }}
                                                                onClick={() => {
                                                                    setAddModel(null);
                                                                    tog_standard();
                                                                }}
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
                                toggle={() => {
                                    edit()
                                }}
                            >
                                <div className="modal-header">
                                    <h3 className="modal-title mt-0" id="myModalLabel1">
                                        Edit Product
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingItem(false)
                                        }}
                                        className="close"
                                        data-dismiss="modal"
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
                                                    });
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}

                                                <div className="form-group">
                                                    <label htmlFor="name" className='mt-2'>Product Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        defaultValue={editingItem.name}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary mt-3"
                                                        style={{ marginLeft: "10px" }}
                                                        onClick={() => {
                                                            setEditingItem(null);
                                                            edit();
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success waves-effect waves-light  mt-3"
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
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default Product
