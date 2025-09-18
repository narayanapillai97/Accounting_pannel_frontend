import React, { Fragment, useState, useMemo, useEffect } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import axios from "axios";

const BankDetails = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedBankDetail, setSelectedBankDetail] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008/";

  // Fetch bank details on component mount
  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}bankdetails/get`);
      setBankDetails(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setErrorMessage("Failed to load bank details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [newBankDetail, setNewBankDetail] = useState({
    employee_id: "",
    bank_name: "",
    branch: "",
    ifsc_code: "",
    account_number: "",
    account_type: 1, // 1 for Savings, 2 for Current
    upi_id: ""
  });

  // Filter bank details based on search term
  const filteredBankDetails = useMemo(() => {
    if (!searchTerm) return bankDetails;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return bankDetails.filter(detail => 
      detail.employee_id?.toString().toLowerCase().includes(lowerSearchTerm) ||
      detail.bank_name?.toLowerCase().includes(lowerSearchTerm) ||
      detail.branch?.toLowerCase().includes(lowerSearchTerm) ||
      detail.ifsc_code?.toLowerCase().includes(lowerSearchTerm) ||
      detail.account_number?.toString().toLowerCase().includes(lowerSearchTerm) ||
      (detail.upi_id && detail.upi_id.toLowerCase().includes(lowerSearchTerm))
    );
  }, [bankDetails, searchTerm]);

  const validateForm = (bankData) => {
    const newErrors = {};
    if (!bankData.employee_id?.toString().trim()) newErrors.employee_id = "Please enter employee ID";
    if (!bankData.bank_name?.trim()) newErrors.bank_name = "Please enter bank name";
    if (!bankData.branch?.trim()) newErrors.branch = "Please enter branch";
    if (!bankData.ifsc_code?.trim()) newErrors.ifsc_code = "Please enter IFSC code";
    if (!bankData.account_number?.toString().trim()) newErrors.account_number = "Please enter account number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewBankDetail({
      employee_id: "",
      bank_name: "",
      branch: "",
      ifsc_code: "",
      account_number: "",
      account_type: 1,
      upi_id: ""
    });
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (bankDetail) => {
    setSelectedBankDetail({...bankDetail});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (bankDetail) => {
    setSelectedBankDetail(bankDetail);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedBankDetail(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}bankdetails/delete/${selectedBankDetail.id}`);
      setBankDetails(bankDetails.filter(detail => detail.id !== selectedBankDetail.id));
      closeModal();
    } catch (error) {
      console.error("Error deleting bank detail:", error);
      setErrorMessage("Failed to delete bank details. Please try again.");
    }
  };

  const handleAddBankDetail = async () => {
    if (!validateForm(newBankDetail)) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/bank-details/post`, newBankDetail);
      // Refetch to get the complete data including employee information
      await fetchBankDetails();
      closeModal();
    } catch (error) {
      console.error("Error adding bank detail:", error);
      setErrorMessage("Failed to add bank details. Please try again.");
    }
  };

  const handleUpdateBankDetail = async () => {
    if (!validateForm(selectedBankDetail)) return;
    
    try {
      await axios.put(`${API_BASE_URL}bankdetails/update/${selectedBankDetail.id}`, selectedBankDetail);
      setBankDetails(bankDetails.map(b => 
        b.id === selectedBankDetail.id ? selectedBankDetail : b
      ));
      closeModal();
    } catch (error) {
      console.error("Error updating bank detail:", error);
      setErrorMessage("Failed to update bank details. Please try again.");
    }
  };

  // Add Bank Detail Modal
  const AddModal = () => {
    const initialForm = {
      employee_id: "",
      bank_name: "",
      branch: "",
      ifsc_code: "",
      account_number: "",
      account_type: 1,
      upi_id: "",
    };

    const [localBankDetail, setLocalBankDetail] = useState(initialForm);
    const [localErrors, setLocalErrors] = useState({});

    const handleReset = () => {
      setLocalBankDetail(initialForm);
      setLocalErrors({});
    };

    const handleAdd = async () => {
      const newErrors = {};
      if (!localBankDetail.employee_id.toString().trim()) newErrors.employee_id = "Please enter employee ID";
      if (!localBankDetail.bank_name.trim()) newErrors.bank_name = "Please enter bank name";
      if (!localBankDetail.branch.trim()) newErrors.branch = "Please enter branch";
      if (!localBankDetail.ifsc_code.trim()) newErrors.ifsc_code = "Please enter IFSC code";
      if (!localBankDetail.account_number.toString().trim()) newErrors.account_number = "Please enter account number";
      
      setLocalErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        try {
          await axios.post(`${API_BASE_URL}bankdetails/post`, localBankDetail);
          await fetchBankDetails();
          handleReset();
          closeModal();
        } catch (error) {
          console.error("Error adding bank detail:", error);
          setErrorMessage("Failed to add bank details. Please try again.");
        }
      }
    };

    const handleClose = () => {
      handleReset();
      closeModal();
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "900px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Bank Details</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control
                      type="number"
                      className="form-control-lg"
                      placeholder="Enter employee ID"
                      value={localBankDetail.employee_id}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, employee_id: e.target.value})}
                      isInvalid={!!localErrors.employee_id}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.employee_id}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter bank name"
                      value={localBankDetail.bank_name}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, bank_name: e.target.value})}
                      isInvalid={!!localErrors.bank_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.bank_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter branch"
                      value={localBankDetail.branch}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, branch: e.target.value})}
                      isInvalid={!!localErrors.branch}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.branch}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>IFSC Code</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter IFSC code"
                      value={localBankDetail.ifsc_code}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, ifsc_code: e.target.value})}
                      isInvalid={!!localErrors.ifsc_code}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.ifsc_code}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter account number"
                      value={localBankDetail.account_number}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, account_number: e.target.value})}
                      isInvalid={!!localErrors.account_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.account_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Account Type</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={localBankDetail.account_type}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, account_type: parseInt(e.target.value)})}
                    >
                      <option value={1}>Savings</option>
                      <option value={2}>Current</option>
                    </select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter UPI ID"
                      value={localBankDetail.upi_id}
                      onChange={(e) => setLocalBankDetail({...localBankDetail, upi_id: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="thaniya-normal-footer">
            <button onClick={handleReset} className="s-btn s-btn-light">
              Reset
            </button>
            <button onClick={handleAdd} className="s-btn s-btn-grad-danger">
              Save Bank Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Bank Detail Modal
  const EditModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`} style={{ maxWidth: "900px", width: "90%" }}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Bank Details</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter employee ID"
                    value={selectedBankDetail?.employee_id || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, employee_id: e.target.value})}
                    isInvalid={!!errors.employee_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employee_id}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter bank name"
                    value={selectedBankDetail?.bank_name || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, bank_name: e.target.value})}
                    isInvalid={!!errors.bank_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bank_name}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter branch"
                    value={selectedBankDetail?.branch || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, branch: e.target.value})}
                    isInvalid={!!errors.branch}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.branch}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>IFSC Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter IFSC code"
                    value={selectedBankDetail?.ifsc_code || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, ifsc_code: e.target.value})}
                    isInvalid={!!errors.ifsc_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ifsc_code}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter account number"
                    value={selectedBankDetail?.account_number || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, account_number: e.target.value})}
                    isInvalid={!!errors.account_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.account_number}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Account Type</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={selectedBankDetail?.account_type || 1}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, account_type: parseInt(e.target.value)})}
                  >
                    <option value={1}>Savings</option>
                    <option value={2}>Current</option>
                  </select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>UPI ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter UPI ID"
                    value={selectedBankDetail?.upi_id || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, upi_id: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleUpdateBankDetail} className="s-btn s-btn-grad-danger">
            Update Bank Details
          </button>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`} style={{maxWidth: '500px'}}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Confirm Delete</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
          <p>Are you sure you want to delete bank details for <strong>{selectedBankDetail?.employee_id}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
            Delete Bank Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <PageTitle activeMenu="Bank Details" motherMenu="Employee" pageContent="Employee Bank Details" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Bank Details</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search bank details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Bank Details
                </Button>
              </div>
            </Card.Header>

            <div className="s-card-body">
              {errorMessage && (
                <Alert variant="danger" className="m-3">
                  {errorMessage}
                </Alert>
              )}
              
              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading bank details...</p>
                </div>
              ) : filteredBankDetails.length === 0 ? (
                <Alert variant="info" className="m-3">
                  {searchTerm ? 'No bank details match your search.' : 'No bank details found.'}
                </Alert>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Bank Name</th>
                      <th>Branch</th>
                      <th>IFSC Code</th>
                      <th>Account Number</th>
                      <th>Account Type</th>
                      <th>UPI ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBankDetails.map((detail, index) => (
                      <tr key={detail.id}>
                        <th>{detail.id}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={index % 2 === 0 ? avatar1 : avatar2}
                              className="rounded-lg me-2"
                              width="24"
                              alt=""
                            />
                            <span className="s-w-space-no">{detail.employee_id}</span>
                          </div>
                        </td>
                        <td>{detail.full_name || 'N/A'}</td>
                        <td>{detail.bank_name}</td>
                        <td>{detail.branch || '-'}</td>
                        <td>{detail.ifsc_code || '-'}</td>
                        <td>{detail.account_number}</td>
                        <td>
                          <Badge variant={detail.account_type === 1 ? "primary light" : "info light"}>
                            {detail.account_type === 1 ? "Savings" : "Current"}
                          </Badge>
                        </td>
                        <td>{detail.upi_id || "-"}</td>
                        <td>
                          <div className="d-flex">
                            <button 
                              onClick={() => openEditModal(detail)}
                              className="btn btn-custom-blue shadow btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button 
                              onClick={() => openDeleteModal(detail)}
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {showAddModal && <AddModal />}
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
    </Fragment>
  );
};

export default BankDetails;