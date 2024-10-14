import React, { useState, useEffect } from 'react'
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
import { Link } from 'react-router-dom';

function BusinessCategory() {

    const [categoryList, setCategoryList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [addItem, setAddItem] = useState(null);
    const [addModel, setAddModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleEdit = async (id) => {
        const itemToEdit = categoryList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    };

    const handleSaveEdit = async (id, updatedData) => {
        const editCategoryData = await businessCategory.editBusinessCategory(id, updatedData);

        if (editCategoryData.data.status) {
            setEditingItem(null)
            setIsSubmitted(true);
            edit()
            setErrorMessage("")
        } else {
            setErrorMessage(editCategoryData.data.message)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const addCategory = await businessCategory.addBusinessCategory({ name: addItem });

        if (addCategory.data.status) {
            setAddModel(null)
            setIsSubmitted(true);
            setAddItem(null)
            setErrorMessage("")
        } else {
            setErrorMessage(addCategory.data.message)
        }


    };

    useEffect(() => {
        async function fetchData() {
            const res = await businessCategory.getBusinessCategoryList();
            const { data } = res;
            setCategoryList(data?.data)
        }
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted]);

    const data = {
        columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Category Name", field: "name", sort: "asc" },
            { label: "Actions", field: "actions", sort: "disabled" },
        ],
        rows: categoryList.map((item) => ({
            id: item.id,
            name: (<Link to={`/admin/product/${item.id}`}>{item.name}</Link>),
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
                </div>
            ),
        })),
    };

    function tog_standard() {
        setAddModel(!addModel)
        removeBodyCss()
    }

    function edit() {
        setEditModel(!editModel)
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
                                <h3 className='mt-3'>Business Categories</h3>
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
                                                Add category
                                            </button>
                                            <Modal
                                                isOpen={addModel}
                                                toggle={() => {
                                                    tog_standard()
                                                }}
                                            >
                                                <div className="modal-header">
                                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                                        Add Category
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
                                                <div className="modal-body" style={{ marginTop: "10px" }}> 
                                                
                                                    <form onSubmit={handleSubmit}>
                                                        {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
                                                        <div className="form-group">
                                                            <label htmlFor="name">Category Name</label>
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
                                    <h5 className="modal-title mt-0" id="myModalLabel1">
                                        Edit Category
                                    </h5>
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
                                        <div style={{ marginTop: "10px" }}>
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
                                                    <label htmlFor="name">Category Name</label>
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
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );

}

export default BusinessCategory
