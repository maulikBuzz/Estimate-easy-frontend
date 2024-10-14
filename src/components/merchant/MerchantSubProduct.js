import React, { useState, useEffect } from 'react'
import MerchantSubProducts from '../../services/merchantSubProducts'
import Unit from '../../services/unit'

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

async function getUnit(data) {
    return data.map((item) => item.units.name);
}

function MerchantSubProduct({ id, merchant_id }) {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [unitList, setUnitList] = useState([]);
    const [merchantSubProductList, setMerchantSubProductList] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [addItem, setAddItem] = useState({
        name: "",
        merchant_product_id: id,
        merchant_id: merchant_id,
        price: 0,
    });
    const [modal_standard, setModal_standard] = useState(false);
    const [editModel, setEditModel] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteModel, setDeleteModel] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    function handleSelectGroup(selectedGroups) {
        setSelectedGroup(selectedGroups);
        const unit_ids = selectedGroups.map(group => group.value);

        setAddItem({ ...addItem, unit_id: unit_ids });
        setEditingItem({ ...editingItem, unit_id: unit_ids });
    }

    const transformedUnitList = unitList.map(unit => ({
        value: unit.id,
        label: unit.name
    }));

    const handleEdit = (id) => {
        const itemToEdit = merchantSubProductList.find((item) => item.id === id);
        setEditingItem(itemToEdit);
    };


    const handleDelete = async (id) => {
        const itemToEdit = merchantSubProductList.find((item) => item.id === id);
        setDeleteItem(itemToEdit);
    };

    const handleSaveEdit = async (id, updatedData) => {
        const editMerchantSubProductData = await MerchantSubProducts.editMerchantSubProduct(id, updatedData);

        if (editMerchantSubProductData.data.status) {
            setEditingItem(null);
            setIsSubmitted(true);
            setErrorMessage("");
            edit();
        } else {
            setErrorMessage(editMerchantSubProductData.data.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const addMerchantSubProduct = await MerchantSubProducts.addMerchantSubProduct({ ...addItem, merchant_product_id: id, merchant_id: merchant_id });

        if (addMerchantSubProduct.data.status) {
            setModal_standard(false);
            setIsSubmitted(true);
            setErrorMessage("");
            setAddItem({ name: "", price: 0 });
        } else {
            setErrorMessage(addMerchantSubProduct.data.message);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const res = await MerchantSubProducts.getMerchantSubProductList(id);
            const { data } = res;

            setMerchantSubProductList(data?.data);
        }
        async function fetchUnitData() {
            const res = await Unit.getUnitList();
            const { data } = res;

            setUnitList(data?.data)
        }
        fetchUnitData();
        fetchData();
        setIsSubmitted(false);
    }, [isSubmitted, id, merchant_id]);

    const [tableData, setTableData] = useState({ columns: [], rows: [] });

    const handleSaveDelete = async (id) => {
        const deleteProductData = await MerchantSubProducts.deleteMerchantSubProduct(id);

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
        const fetchData = async () => {
            const rowsData = await Promise.all(
                merchantSubProductList.map(async (item) => ({
                    id: item.id,
                    name: item.name,
                    unit: (await getUnit(item?.SubProductUnits)).join(", "),
                    price: item.price,
                    actions: (
                        <div>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => {
                                    handleEdit(item.id);
                                    edit();
                                    setErrorMessage("");
                                    existProductId(item.id)
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
                }))
            );

            setTableData({
                columns: [
                    { label: "id", field: "id", sort: "asc" },
                    { label: "Name", field: "name", sort: "asc" },
                    { label: "Units", field: "unit", sort: "asc" },
                    { label: "Price", field: "price", sort: "asc" },
                    { label: "Actions", field: "actions", sort: "disabled" },
                ],
                rows: rowsData,
            });
        };

        fetchData();
    }, [merchantSubProductList]);

    function tog_standard() {
        setModal_standard(!modal_standard);
        if (!modal_standard) {
            setAddItem({ name: "", merchant_product_id: id, merchant_id: merchant_id, price: 0 });
            setErrorMessage("");
            setSelectedGroup(null)
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

    async function existProductId(id) {
        const res = await Unit.getSubProductUnit(id);
        const { data } = res;
        const finalData = data?.data.map((item) => ({
            value: item.unit_id,
            label: item?.units?.name
        }));

        setSelectedGroup(finalData)
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
                                <h3 className='mt-3'>Merchant Sub Product</h3>
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
                                                Add Merchant Sub Product
                                            </button>
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
                                                                value={selectedGroup}
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
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <MDBDataTable
                                    responsive
                                    striped
                                    bordered
                                    data={tableData} // Pass the fully resolved data
                                />
                            </div>
                            <Modal
                                isOpen={editModel}
                                toggle={edit}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title mt-0" id="myModalLabel1">
                                        Edit Merchant Sub Product
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
                                                        price: e.target.price.value,
                                                        unit_id: selectedGroup.map((option) => option.value),
                                                    });
                                                    existProductId(editingItem.product_id)
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
                                                    <label htmlFor="unit_id" className='mt-2'>Units</label>
                                                    <Select
                                                        name="unit_id"
                                                        value={selectedGroup}
                                                        onChange={handleSelectGroup}
                                                        options={transformedUnitList}
                                                        classNamePrefix="select2-selection"
                                                        isMulti
                                                    />
                                                    <label htmlFor="price">Price</label>
                                                    <input
                                                        type="text"
                                                        name="price"
                                                        defaultValue={editingItem.price}
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

export default MerchantSubProduct
