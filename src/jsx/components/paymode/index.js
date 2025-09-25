import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008/";

const PayModeMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPayMode, setSelectedPayMode] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [newPayMode, setNewPayMode] = useState({
    payment_method: "",
    description: "",
    status: 1
  });

  const [payModes, setPayModes] = useState([]);

  // Fetch payment methods from API
  useEffect(() => {
    fetchPayModes();
  }, []);

  const fetchPayModes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${API_BASE_URL}paymode/get`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPayModes(data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setApiError("Failed to load payment methods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter pay modes based on search term
  const filteredPayModes = useMemo(() => {
    if (!searchTerm) return payModes;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return payModes.filter(payMode => 
      payMode.payment_method.toLowerCase().includes(lowerSearchTerm) ||
      (payMode.description && payMode.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [payModes, searchTerm]);

  const validateForm = (payModeData) => {
    const newErrors = {};
    if (!payModeData.payment_method.trim()) newErrors.payment_method = "Please enter payment method";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewPayMode({
      payment_method: "",
      description: "",
      status: 1
    });
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (payMode) => {
    setSelectedPayMode({...payMode});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (payMode) => {
    setSelectedPayMode(payMode);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedPayMode(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}paymode/delete/${selectedPayMode.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the list after deletion
      await fetchPayModes();
      closeModal();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      setApiError("Failed to delete payment method. Please try again.");
    }
  };

  const handleAddPayMode = async (payModeData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}paymode/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payModeData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the list after adding
      await fetchPayModes();
      closeModal();
    } catch (error) {
      console.error("Error adding payment method:", error);
      setApiError("Failed to add payment method. Please try again.");
    }
  };

  const handleUpdatePayMode = async (payModeData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}paymode/update/${payModeData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method: payModeData.payment_method,
          description: payModeData.description
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the list after updating
      await fetchPayModes();
      closeModal();
    } catch (error) {
      console.error("Error updating payment method:", error);
      setApiError("Failed to update payment method. Please try again.");
    }
  };

  // Add Pay Mode Modal
  const AddModal = () => {
    const [localPayMode, setLocalPayMode] = useState({
      payment_method: "",
      description: "",
      status: 1
    });
    const [localErrors, setLocalErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (showAddModal) {
        setLocalPayMode({
          payment_method: "",
          description: "",
          status: 1
        });
        setLocalErrors({});
      }
    }, [showAddModal]);

    const handleReset = () => {
      setLocalPayMode({
        payment_method: "",
        description: "",
        status: 1
      });
      setLocalErrors({});
    };

    const handleSave = async () => {
      if (!validateForm(localPayMode)) return;
      
      setSubmitting(true);
      try {
        await handleAddPayMode(localPayMode);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "700px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Payment Method</h2>
            <button onClick={closeModal} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter payment method"
                      value={localPayMode.payment_method}
                      onChange={(e) => setLocalPayMode({...localPayMode, payment_method: e.target.value})}
                      isInvalid={!!localErrors.payment_method}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.payment_method}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={localPayMode.description}
                      onChange={(e) => setLocalPayMode({...localPayMode, description: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={localPayMode.status}
                      onChange={(e) => setLocalPayMode({...localPayMode, status: parseInt(e.target.value)})}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
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
              onClick={handleSave} 
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Payment Method"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Pay Mode Modal
  const EditModal = () => {
    const [localPayMode, setLocalPayMode] = useState(selectedPayMode || {
      payment_method: "",
      description: "",
      status: 1
    });
    const [localErrors, setLocalErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedPayMode) {
        setLocalPayMode({...selectedPayMode});
      }
    }, [selectedPayMode]);

    const handleSave = async () => {
      if (!validateForm(localPayMode)) return;
      
      setSubmitting(true);
      try {
        await handleUpdatePayMode(localPayMode);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "900px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Edit Payment Method</h2>
            <button onClick={closeModal} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter payment method"
                      value={localPayMode.payment_method}
                      onChange={(e) => setLocalPayMode({...localPayMode, payment_method: e.target.value})}
                      isInvalid={!!localErrors.payment_method}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.payment_method}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={localPayMode.description}
                      onChange={(e) => setLocalPayMode({...localPayMode, description: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={localPayMode.status}
                      onChange={(e) => setLocalPayMode({...localPayMode, status: parseInt(e.target.value)})}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="thaniya-normal-footer">
            <button onClick={closeModal} className="s-btn s-btn-light">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Payment Method"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    const [deleting, setDeleting] = useState(false);
    
    const handleDeleteConfirm = async () => {
      setDeleting(true);
      try {
        await handleDelete();
      } finally {
        setDeleting(false);
      }
    };
    
    return (
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
            <p>Are you sure you want to delete payment method <strong>{selectedPayMode?.payment_method}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={closeModal} className="s-btn s-btn-light">
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm} 
              className="s-btn s-btn-grad-danger"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Payment Method"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Payment Methods" motherMenu="Masters" pageContent="Payment Methods List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Payment Methods</Card.Title>
              </div>
              {/* Search Input */}
              <div className="mb-3 d-flex justify-content-end">
                <div style={{ width: "300px" }}>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search payment methods..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear
                      </Button>
                    )}
                  </InputGroup>
                </div>
              </div>
              <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                + Add Payment Method
              </Button>
            </Card.Header>

            <div className="s-card-body">
              {apiError && (
                <Alert variant="danger" className="mx-3 mt-3">
                  {apiError}
                </Alert>
              )}
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-2">Loading payment methods...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Payment Method</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayModes.length > 0 ? (
                      filteredPayModes.map((payMode, index) => (
                        <tr key={payMode.id}>
                          <th>{payMode.id}</th>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={index % 2 === 0 ? avatar1 : avatar2}
                                className="rounded-lg me-2"
                                width="24"
                                alt=""
                              />
                              <span className="s-w-space-no">{payMode.payment_method}</span>
                            </div>
                          </td>
                          <td>{payMode.description}</td>
                          <td>
                            <Badge bg={payMode.status === 1 ? "success" : "danger"}>
                              {payMode.status === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex">
                              <button 
                                onClick={() => openEditModal(payMode)}
                                className="btn btn-custom-blue shadow btn-xs sharp me-1"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </button>
                              <button 
                                onClick={() => openDeleteModal(payMode)}
                                className="btn btn-danger shadow btn-xs sharp"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          {searchTerm ? "No payment methods match your search" : "No payment methods found"}
                        </td>
                      </tr>
                    )}
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

export default PayModeMaster;