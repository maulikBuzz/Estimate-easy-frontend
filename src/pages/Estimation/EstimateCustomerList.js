import React, { useState, useEffect } from 'react'
import Estimate from '../../services/estimateService'
import user from '../../services/userAuthService'

import { MDBDataTable } from "mdbreact"
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  Alert,
} from "reactstrap"

import { Link } from 'react-router-dom'

function EstimateCustomerList() {
  const [estimateCustomersList, setEstimateCustomersList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [merchant_id, setMerchantId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchUserData() {

      let userDataRecord = [];

      const res = await user.getUser();
      const { data } = res;
      userDataRecord = data?.data;
      setMerchantId(userDataRecord?.merchant_id);

    }

    fetchUserData();
    setIsSubmitted(false);
  }, [isSubmitted]);

  useEffect(() => {
    if (merchant_id) {
      async function fetchData() {
        try {
          const res = await Estimate.getEstimateCustomers(merchant_id);
          const { data } = res; 
          setEstimateCustomersList(data?.data);
        } catch (error) {
          console.error("Error fetching estimate customers:", error);
        }
      }

      fetchData();
    }
  }, [merchant_id, isSubmitted]); 

  const handleDelete = async (id) => { 

    const itemToEdit = estimateCustomersList.find((item) => item.id === id);
    setDeleteItem(itemToEdit);
  };

  const handleSaveDelete = async (id) => { 

    const deleteProductData = await Estimate.deleteEstimate(id);

    if (deleteProductData.data.status) {
      setDeleteItem(null)
      setIsSubmitted(true);
      deleteStd()
      setErrorMessage("")
    } else {
      setErrorMessage(deleteProductData.data.message)
    }
  };
  const savePdf = async (id) => {
    const response = await Estimate.generatePdf(id);
 
    if (response.data) {
      console.log(response.data, "hello");

      const { data, name } = await response.data;
      

      const byteCharacters = atob(data); // Decode Base64 string
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const file = new Blob([byteNumbers], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const contentDisposition = response.headers['content-disposition'];
      let customFileName = `${name}.pdf`;

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

  }; 
 
  const data = {
    columns: [
      { label: "Quotation Number", field: "quote_no", sort: "asc" },
      { label: "Customer Name", field: "name", sort: "asc" },
      { label: "Contact Number", field: "contact_no", sort: "asc" },
      { label: "Sales representative", field: "quote_by", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: estimateCustomersList.map((item) => ({
      quote_no: (<Link to={`/user/list/${item.id}`}>{item.quote_number}</Link>),
      name: item.name,
      contact_no: item.contact_no,
      quote_by: item.sales_rep,
      actions: (
        <div>
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
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              savePdf(item.id)
            }}
            style={{ marginRight: "10px" }}
          >
            Pdf
          </button>
        </div>
      ),
    })),
  };



  function deleteStd() {
    setDeleteModel(!deleteModel)
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className='d-flex justify-content-between'>
                <h3 className='mt-3'>Estimate Customers</h3>
              </div>
              <div className='mt-3'>
                <MDBDataTable responsive striped bordered data={data} />
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>
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

                <div className='d-flex text-aline-center'>Are you sure you want to delete this quotation? </div>
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
    </React.Fragment>

  )
}

export default EstimateCustomerList
