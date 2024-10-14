import React, { useEffect, useState } from 'react'
import merchantUsers from '../../services/user'
import { MDBDataTable } from "mdbreact"
import { useParams } from 'react-router-dom'


import {
    Card,
    CardBody,
    Col,
    Row,
    Modal,
    Alert,
} from "reactstrap"

function MerchantUser() {
    const { id } = useParams()

    useEffect(() => {
        console.log(id, "km no aavi ");
    }, [id])
    
    const [merchantUsersList, setMerchantUsersList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [addItem, setAddItem] = useState({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        merchant_id: id,
    });
    const [addModel, setAddModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleEdit = async (id) => {
        const itemToEdit = merchantUsersList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    };

    const handleSaveEdit = async (id, updatedData) => {
        const editMerchantUsersData = await merchantUsers.editUser(id, updatedData);

        if (editMerchantUsersData.data.status) {
            setEditingItem(null)
            setIsSubmitted(true);
            edit()
            setErrorMessage("")
        } else {
            setErrorMessage(editMerchantUsersData.data.message)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const addMerchantUsers = await merchantUsers.addUser(addItem);

        if (addMerchantUsers.data.status) {
            setAddModel(null)
            setIsSubmitted(true);
            setErrorMessage("")
        } else {
            setErrorMessage(addMerchantUsers.data.message)
        }
    };

    async function fetchData() {
        console.log(id, "hello");
        
        const res = await merchantUsers.getUserList(id);
        const { data } = res;

        setMerchantUsersList(data?.data);
    }

    useEffect(() => {
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted, id]);

    const data = {
        columns: [
            { label: "ID", field: "id", sort: "asc" },
            { label: "Users Name", field: "name", sort: "asc" },
            { label: "Email", field: "email", sort: "asc" },
            { label: "Phone number", field: "phone_number", sort: "asc" },
            { label: "Actions", field: "actions", sort: "disabled" },
        ],
        rows: merchantUsersList.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone_number: item.phone_number,
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
        if (!addModel) {
            setAddItem({ name: "", email: "", phone_number: "", password: "", merchant_id: id });
            setErrorMessage("");
        }
        removeBodyCss()
    }
    function edit() {
        setEditModel(!editModel)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
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
                                <h3 className='mt-3'>Merchant Users</h3>
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
                                                Add Merchant Users
                                            </button>
                                            <Modal
                                                isOpen={addModel}
                                                toggle={() => {
                                                    tog_standard()
                                                }}
                                            >
                                                <div className="modal-header">
                                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                                        Add Merchant Users
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
                                                            <label htmlFor="name">Name</label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={addItem.name}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />

                                                            <label htmlFor="email" className='mt-2'>Email</label>
                                                            <input
                                                                type="text"
                                                                name="email"
                                                                value={addItem.email}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />
                                                            <label htmlFor="phone_number" className='mt-2'>Contact No</label>
                                                            <input
                                                                type="text"
                                                                name="phone_number"
                                                                value={addItem.phone_number}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                            />
                                                            <label htmlFor="password" className='mt-2'>Password</label>
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                value={addItem.password}
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
                                        Edit Merchant User
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
                                                        email: e.target.email.value,
                                                        phone_number: e.target.phone_number.value,
                                                    });
                                                }}
                                            >
                                                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
                                                <div className="form-group">
                                                    <label htmlFor="name">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        defaultValue={editingItem.name}
                                                        className="form-control"
                                                    />
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        defaultValue={editingItem.email}
                                                        className="form-control"
                                                        disabled
                                                    />
                                                    <label htmlFor="phone_number">Contact No</label>
                                                    <input
                                                        type="text"
                                                        name="phone_number"
                                                        defaultValue={editingItem.phone_number}
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
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default MerchantUser
