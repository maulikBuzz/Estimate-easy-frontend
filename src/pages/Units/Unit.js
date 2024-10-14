import React, { useState, useEffect } from 'react'
import unit from '../../services/unit' 

import { MDBDataTable } from "mdbreact"
import {
    Card,
    CardBody,
    Col,
    Row,
    Modal,
    Alert,
} from "reactstrap"
 

function Unit() {
 
    const [unitList, setUnitList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [addItem, setAddItem] = useState({
        name: "", 
        code: ""
    });
 

    const [modal_standard, setModal_standard] = useState(false);
    const [editModel, setEditModel] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); 
    const [deleteItem, setDeleteItem] = useState(null); 
    const [deleteModel, setDeleteModel] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    const handleEdit = (id) => {
        const itemToEdit = unitList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    }; 
    
    const handleDelete = async (id) => {
        const itemToEdit = unitList.find((item) => item.id === id);
        setDeleteItem(itemToEdit);
    };

    const handleSaveEdit = async (id, updatedData) => { 
        
        const editUnitData = await unit.editUnit(id, updatedData);

        if (editUnitData.data.status) {
            setEditingItem(null);
            setIsSubmitted(true);
            setErrorMessage("");
            edit(); // Close the modal after saving
        } else {
            setErrorMessage(editUnitData.data.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        const addUnit = await unit.addUnit(addItem);

        if (addUnit.data.status) {
            setModal_standard(false);
            setIsSubmitted(true);
            setErrorMessage("");
            setAddItem({ name: "", code: "" });
        } else {
            setErrorMessage(addUnit.data.message);
        }
    };
    
    const handleSaveDelete = async (id) => { 

        const deleteProductData = await unit.deleteUnit(id);

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
            const res = await unit.getUnitList();
            const { data } = res;
            setUnitList(data?.data);
        } 
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted]);

    const data = {
        columns: [
            { label: "ID", field: "id", sort: "asc" }, 
            { label: "Unit Name", field: "name", sort: "asc" }, 
            { label: "Code", field: "code", sort: "asc" }, 
            { label: "Actions", field: "actions", sort: "disabled" },
        ],

        rows: unitList.map((item) => ({
            id: item.id,
            name: item.name,
            code: item.code, 
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
                        style={{

                            marginRight: "10px",
                        }}
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
            setAddItem({ name: "",  code: "" });
           
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
                                <h3 className='mt-3'>Units</h3>
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
                                                Add unit
                                            </button>
                                            <Modal
                                                isOpen={modal_standard}
                                                toggle={tog_standard}
                                            >
                                                <div className="modal-header">
                                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                                        Add Unit
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
                                                            <label htmlFor="name">Unit Name</label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={addItem.name}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />
                                                            
                                                            <label htmlFor="code" className='mt-2'>Code</label>
                                                            <input
                                                                type="text"
                                                                name="code"
                                                                value={addItem.code}
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
                                        Edit Unit
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
                                                        code: e.target.code.value, 
                                                    });
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
                                                <div className="form-group">
                                                    <label htmlFor="name">Unit Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        defaultValue={editingItem.name}
                                                        className="form-control"
                                                    />
                                                    
                                                    <label htmlFor="code">Code</label>
                                                    <input
                                                        type="text"
                                                        name="code"
                                                        defaultValue={editingItem.code}
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

export default Unit
