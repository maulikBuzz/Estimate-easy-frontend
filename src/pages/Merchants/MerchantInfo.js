import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import merchants from '../../services/Merchants'
import MerchantUser from '../../components/merchant/MerchantUser'

import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  Alert
} from "reactstrap"

import classnames from "classnames"
import MerchantProduct from 'components/merchant/MerchantProduct'
import MerchantSubProduct from 'components/merchant/MerchantSubProduct'

function MerchantInfo() {
  const { id } = useParams()

  const [merchant, setMerchant] = useState([])
  const [activeTab, setActiveTab] = useState("1");
  const [activeId, setActiveId] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [editModel, setEditModel] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  async function fetchData() { 
    
    const res = await merchants.getMerchantById(id);
    const { data } = res;
    data && setMerchant(data.data); 
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    setIsSubmitted(false);

  }, [id, isSubmitted]);

  const getProductId = (id) => {
    setActiveId(id);
  }; 

  const handleSaveEdit = async (id, updatedData) => {
    const editMerchantData = await merchants.editMerchant(id, updatedData);

    if (editMerchantData.data.status) {
      setEditingItem(null)
      setIsSubmitted(true);
      edit()
      setErrorMessage("")
    } else {
      setErrorMessage(editMerchantData.data.message)
    }
  };

  const handleEdit = async () => {
    setEditingItem(merchant);
  };

  async function edit() {
    setEditModel(!editModel)
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
 

  return (
    <div>
      <Row>
        <Col mg={6} lg={6} xl={3}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <CardTitle className="h4">Merchant Details</CardTitle>
              <CardText>
                Below are the details of the merchant:
              </CardText>
            </CardBody>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <strong>Name:</strong> <span>{merchant.name}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Address:</strong> <span>{merchant.address}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>City:</strong> <span>{merchant.city}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>State:</strong> <span>{merchant.state}</span>
              </li>
            </ul>
            <CardBody>
              <Button color="primary" className="w-100"
                onClick={() => {
                  handleEdit();
                  edit();
                  setErrorMessage("")
                }}>
                Edit
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col lg={9}>
          <Card>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => toggle("1")}
                  >
                    Product
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggle("2")}
                  >
                    Users
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">
                        <MerchantUser  />
                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">

                        {activeId ?
                          <nav aria-label="breadcrumb">
                            <ol style={{ listStyle: 'none', display: 'flex', padding: 0, margin: "10px 0px 20px 0px" }}>
                              <li style={{ marginRight: '0.5rem' }}>
                                <Link to="" style={{ textDecoration: 'none', color: '#007bff' }} onClick={async () => await setActiveId(null)}>Products</Link>
                              </li>
                              <span><strong>{">"}</strong></span>
                              <li style={{ marginRight: '0.5rem', marginLeft: '0.5rem', color: '#6c757d' }}>
                                Sub Products
                              </li>
                            </ol>
                          </nav>
                          :
                          ""
                        }
                        {activeId ?

                          <MerchantSubProduct id={activeId} merchant_id={merchant.id} />
                          :
                          <MerchantProduct id={merchant?.id} business_category_id={merchant.business_category_id} sendId={getProductId} />
                        }
                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>

      </Row>
      <Modal
        isOpen={editModel}
        toggle={edit}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myModalLabel1">
            Edit Merchant Info
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
            <div  >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(editingItem.id, {
                    name: e.target.name.value,
                    address: e.target.address.value,
                    city: e.target.city.value,
                    state: e.target.state.value,
                  });

                }}
              >
                {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
                <div className="form-group">
                  <label htmlFor="name" className='mt-2'>Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={editingItem.name}
                    className="form-control"
                  />
                  <label htmlFor="address" className='mt-2'>Address</label>
                  <input
                    type="text"
                    id="address"
                    defaultValue={editingItem.address}
                    className="form-control"
                  />
                  <label htmlFor="city" className='mt-2'>City</label>
                  <input
                    type="text"
                    id="city"
                    defaultValue={editingItem.city}
                    className="form-control"
                  />
                  <label htmlFor="state" className='mt-2'>State</label>
                  <input
                    type="text"
                    id="state"
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
    </div>
  )
}

export default MerchantInfo
