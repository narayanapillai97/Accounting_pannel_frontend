import React, { Fragment, useState, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import bankData from "../../../../src/jsx/components/data/data.json"; 

const BankDetails = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedBankDetail, setSelectedBankDetail] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newBankDetail, setNewBankDetail] = useState({
    employeeId: "",
    bankName: "",
    branch: "",
    ifscCode: "",
    accountNumber: "",
    accountType: 1, // 1 for Savings, 2 for Current
    upiId: ""
  });

  const [bankDetails, setBankDetails] = useState(
    bankData["bank-details"].map((item, index) => ({
      id: index + 1,
      employeeId: item.vemployee_id.toString(),
      bankName: item.bank_name,
      branch: item.branch,
      ifscCode: item.ifsc_code,
      accountNumber: item.account_number.toString(),
      accountType: item.account_type === 1 ? 1 : 2,
      upiId: item.upi_id
    }))
  );

  // Filter bank details based on search term
  const filteredBankDetails = useMemo(() => {
    if (!searchTerm) return bankDetails;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return bankDetails.filter(detail => 
      detail.employeeId.toLowerCase().includes(lowerSearchTerm) ||
      detail.bankName.toLowerCase().includes(lowerSearchTerm) ||
      detail.branch.toLowerCase().includes(lowerSearchTerm) ||
      detail.ifscCode.toLowerCase().includes(lowerSearchTerm) ||
      detail.accountNumber.toLowerCase().includes(lowerSearchTerm) ||
      (detail.upiId && detail.upiId.toLowerCase().includes(lowerSearchTerm))
    );
  }, [bankDetails, searchTerm]);

  const validateForm = (bankData) => {
    const newErrors = {};
    if (!bankData.employeeId.trim()) newErrors.employeeId = "Please enter employee ID";
    if (!bankData.bankName.trim()) newErrors.bankName = "Please enter bank name";
    if (!bankData.branch.trim()) newErrors.branch = "Please enter branch";
    if (!bankData.ifscCode.trim()) newErrors.ifscCode = "Please enter IFSC code";
    if (!bankData.accountNumber.trim()) newErrors.accountNumber = "Please enter account number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewBankDetail({
      employeeId: "",
      bankName: "",
      branch: "",
      ifscCode: "",
      accountNumber: "",
      accountType: 1,
      upiId: ""
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

  const handleDelete = () => {
    setBankDetails(bankDetails.filter(detail => detail.id !== selectedBankDetail.id));
    closeModal();
  };

  const handleAddBankDetail = () => {
    if (!validateForm(newBankDetail)) return;
    
    const newId = bankDetails.length > 0 ? Math.max(...bankDetails.map(b => b.id)) + 1 : 1;
    setBankDetails([...bankDetails, {...newBankDetail, id: newId}]);
    closeModal();
  };

  const handleUpdateBankDetail = () => {
    if (!validateForm(selectedBankDetail)) return;
    
    setBankDetails(bankDetails.map(b => 
      b.id === selectedBankDetail.id ? selectedBankDetail : b
    ));
    closeModal();
  };

  // Add Bank Detail Modal
  const AddModal = () => {
    const initialForm = {
      employeeId: "",
      bankName: "",
      branch: "",
      ifscCode: "",
      accountNumber: "",
      accountType: 1,
      upiId: "",
    };

    const [newBankDetail, setNewBankDetail] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const handleReset = () => {
      setNewBankDetail(initialForm);
      setErrors({});
    };

    const handleAddBankDetail = () => {
      // Validation logic here
      const newErrors = {};
      if (!newBankDetail.employeeId.trim()) newErrors.employeeId = "Please enter employee ID";
      if (!newBankDetail.bankName.trim()) newErrors.bankName = "Please enter bank name";
      if (!newBankDetail.branch.trim()) newErrors.branch = "Please enter branch";
      if (!newBankDetail.ifscCode.trim()) newErrors.ifscCode = "Please enter IFSC code";
      if (!newBankDetail.accountNumber.trim()) newErrors.accountNumber = "Please enter account number";
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        const newId = bankDetails.length > 0 ? Math.max(...bankDetails.map(b => b.id)) + 1 : 1;
        setBankDetails([...bankDetails, {...newBankDetail, id: newId}]);
        handleReset();
        closeModal();
      }
    };

    const handleClose = () => {
      handleReset();
      closeModal();
    };

    return (
      <div
        className={`thaniya-normal-overlay ${
          isAnimating ? "thaniya-overlay-visible" : ""
        }`}
      >
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>
        <div
          className={`thaniya-normal-modal ${
            isAnimating ? "thaniya-normal-modal-visible" : ""
          }`}
          style={{ maxWidth: "900px", width: "90%" }}
        >
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
                      value={newBankDetail.employeeId}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          employeeId: e.target.value,
                        })
                      }
                      isInvalid={!!errors.employeeId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.employeeId}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter bank name"
                      value={newBankDetail.bankName}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          bankName: e.target.value,
                        })
                      }
                      isInvalid={!!errors.bankName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bankName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter branch"
                      value={newBankDetail.branch}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          branch: e.target.value,
                        })
                      }
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
                      value={newBankDetail.ifscCode}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          ifscCode: e.target.value,
                        })
                      }
                      isInvalid={!!errors.ifscCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.ifscCode}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter account number"
                      value={newBankDetail.accountNumber}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          accountNumber: e.target.value,
                        })
                      }
                      isInvalid={!!errors.accountNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.accountNumber}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Account Type</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={newBankDetail.accountType}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          accountType: parseInt(e.target.value),
                        })
                      }
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
                      value={newBankDetail.upiId}
                      onChange={(e) =>
                        setNewBankDetail({
                          ...newBankDetail,
                          upiId: e.target.value,
                        })
                      }
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
            <button
              onClick={handleAddBankDetail}
              className="s-btn s-btn-grad-danger"
            >
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
      <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`}   style={{ maxWidth: "900px", width: "90%" }}>
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
                    value={selectedBankDetail?.employeeId || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, employeeId: e.target.value})}
                    isInvalid={!!errors.employeeId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employeeId}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter bank name"
                    value={selectedBankDetail?.bankName || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, bankName: e.target.value})}
                    isInvalid={!!errors.bankName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bankName}
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
                    value={selectedBankDetail?.ifscCode || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, ifscCode: e.target.value})}
                    isInvalid={!!errors.ifscCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ifscCode}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter account number"
                    value={selectedBankDetail?.accountNumber || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, accountNumber: e.target.value})}
                    isInvalid={!!errors.accountNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accountNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Account Type</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={selectedBankDetail?.accountType || 1}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, accountType: parseInt(e.target.value)})}
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
                    value={selectedBankDetail?.upiId || ''}
                    onChange={(e) => setSelectedBankDetail({...selectedBankDetail, upiId: e.target.value})}
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
          <p>Are you sure you want to delete bank details for <strong>{selectedBankDetail?.employeeId}</strong>?</p>
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
              {filteredBankDetails.length === 0 ? (
                <Alert variant="info" className="m-3">
                  {searchTerm ? 'No bank details match your search.' : 'No bank details found.'}
                </Alert>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
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
                            <span className="s-w-space-no">{detail.employeeId}</span>
                          </div>
                        </td>
                        <td>{detail.bankName}</td>
                        <td>{detail.branch}</td>
                        <td>{detail.ifscCode}</td>
                        <td>{detail.accountNumber}</td>
                        <td>
                          <Badge variant={detail.accountType === 1 ? "primary light" : "info light"}>
                            {detail.accountType === 1 ? "Savings" : "Current"}
                          </Badge>
                        </td>
                        <td>{detail.upiId || "-"}</td>
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