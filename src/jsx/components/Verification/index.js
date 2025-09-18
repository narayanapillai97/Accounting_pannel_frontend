import React, { Fragment, useState, useMemo, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Form,
  Badge,
  Alert,
  InputGroup,
  Spinner
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search, Loader } from "lucide-react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008/";

const Verification = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [verifications, setVerifications] = useState([]);
  const [newVerification, setNewVerification] = useState({
    employee_id: "",
    aadhar_number: "",
    pan_number: "",
    passport_no: "",
    verification_date: "",
    verified_by: "",
    status: 1,
  });

  // Fetch verifications from API
  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}verification/get`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVerifications(data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching verifications:", error);
      setApiError("Failed to load verification data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter verifications based on search term
  const filteredVerifications = useMemo(() => {
    if (!searchTerm) return verifications;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return verifications.filter(verification => 
      verification.employee_id.toString().includes(lowerSearchTerm) ||
      verification.aadhar_number?.toString().includes(lowerSearchTerm) ||
      verification.pan_number?.toLowerCase().includes(lowerSearchTerm) ||
      (verification.passport_no && verification.passport_no.toLowerCase().includes(lowerSearchTerm)) ||
      verification.verification_date?.toLowerCase().includes(lowerSearchTerm) ||
      verification.verified_by?.toLowerCase().includes(lowerSearchTerm) ||
      (verification.status === 1 ? "verified" : "pending").includes(lowerSearchTerm)
    );
  }, [verifications, searchTerm]);

  const validateForm = (verificationData) => {
    const newErrors = {};
    if (!verificationData.employee_id)
      newErrors.employee_id = "Please enter employee ID";
    if (!verificationData.aadhar_number)
      newErrors.aadhar_number = "Please enter Aadhar number";
    if (!verificationData.pan_number)
      newErrors.pan_number = "Please enter PAN number";
    if (!verificationData.verification_date)
      newErrors.verification_date = "Please select verification date";
    if (!verificationData.verified_by)
      newErrors.verified_by = "Please enter verified by";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openAddModal = () => {
    setNewVerification({
      employee_id: "",
      aadhar_number: "",
      pan_number: "",
      passport_no: "",
      verification_date: "",
      verified_by: "",
      status: 1,
    });
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (verification) => {
    setSelectedVerification({ ...verification });
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (verification) => {
    setSelectedVerification(verification);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedVerification(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}verification/delete/${selectedVerification.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setVerifications(verifications.filter(v => v.id !== selectedVerification.id));
        showSuccessMessage("Verification deleted successfully!");
        closeModal();
      } else {
        throw new Error(result.error || "Failed to delete verification");
      }
    } catch (error) {
      console.error("Error deleting verification:", error);
      setApiError("Failed to delete verification. Please try again.");
    }
  };

  const handleAddVerification = async () => {
    if (!validateForm(newVerification)) return;

    try {
      const response = await fetch(`${API_BASE_URL}verification/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVerification),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh the list
        fetchVerifications();
        showSuccessMessage("Verification added successfully!");
        closeModal();
      } else {
        throw new Error(result.error || "Failed to add verification");
      }
    } catch (error) {
      console.error("Error adding verification:", error);
      setApiError("Failed to add verification. Please try again.");
    }
  };

  const handleUpdateVerification = async () => {
    if (!validateForm(selectedVerification)) return;

    try {
      const response = await fetch(`${API_BASE_URL}verification/update/${selectedVerification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedVerification),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh the list
        fetchVerifications();
        showSuccessMessage("Verification updated successfully!");
        closeModal();
      } else {
        throw new Error(result.error || "Failed to update verification");
      }
    } catch (error) {
      console.error("Error updating verification:", error);
      setApiError("Failed to update verification. Please try again.");
    }
  };

  // Add Verification Modal
const AddModal = ({ showAddModal, closeModal }) => {
  const initialForm = {
    employee_id: "",
    aadhar_number: "",
    pan_number: "",
    passport_no: "",
    verification_date: "",
    verified_by: "",
    status: 1,
  };

  const [newVerification, setNewVerification] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (showAddModal) {
      setNewVerification(initialForm);
      setErrors({});
    }
  }, [showAddModal]);

  const handleReset = () => {
    setNewVerification(initialForm);
    setErrors({});
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.employee_id) newErrors.employee_id = "Please enter employee ID";
    if (!data.aadhar_number) newErrors.aadhar_number = "Please enter Aadhar number";
    if (!data.pan_number.trim()) newErrors.pan_number = "Please enter PAN number";
    if (!data.verification_date) newErrors.verification_date = "Please select verification date";
    if (!data.verified_by.trim()) newErrors.verified_by = "Please enter verified by";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVerification = async () => {
    if (!validateForm(newVerification)) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/verification/post`, newVerification, {
        headers: { Authorization: token },
      });

      // Add new verification record with ID from backend
      setVerifications([
        ...verifications,
        { ...newVerification, verification_id: response.data.verificationId },
      ]);

      setSuccessMessage("Verification added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error adding verification:", error);
      setApiError(error.response?.data?.error || "Failed to add verification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
  };

  if (!showAddModal) return null;

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
          <h2 className="thaniya-normal-title">Add Verification</h2>
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
                    value={newVerification.employee_id}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        employee_id: e.target.value,
                      })
                    }
                    isInvalid={!!errors.employee_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employee_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-lg"
                    placeholder="Enter Aadhar number"
                    value={newVerification.aadhar_number}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        aadhar_number: e.target.value,
                      })
                    }
                    isInvalid={!!errors.aadhar_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.aadhar_number}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter PAN number"
                    value={newVerification.pan_number}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        pan_number: e.target.value,
                      })
                    }
                    isInvalid={!!errors.pan_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pan_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Passport Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter passport number"
                    value={newVerification.passport_no}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        passport_no: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verification Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-lg"
                    value={newVerification.verification_date}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        verification_date: e.target.value,
                      })
                    }
                    isInvalid={!!errors.verification_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verification_date}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verified By</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter verified by"
                    value={newVerification.verified_by}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        verified_by: e.target.value,
                      })
                    }
                    isInvalid={!!errors.verified_by}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verified_by}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={newVerification.status}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        status: parseInt(e.target.value),
                      })
                    }
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
            onClick={handleAddVerification}
            className="s-btn s-btn-grad-danger"
            disabled={submitting}
          >
            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Verification"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

  // Edit Verification Modal
const EditModal = ({ selectedVerification, showEditModal, closeModal, setVerifications, verifications }) => {
  const initialForm = selectedVerification || {
    employee_id: "",
    aadhar_number: "",
    pan_number: "",
    passport_no: "",
    verification_date: "",
    verified_by: "",
    status: 1,
  };

  const [editVerification, setEditVerification] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (selectedVerification) {
      setEditVerification(selectedVerification);
    }
  }, [selectedVerification]);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.employee_id) newErrors.employee_id = "Please enter employee ID";
    if (!data.aadhar_number) newErrors.aadhar_number = "Please enter Aadhar number";
    if (!data.pan_number) newErrors.pan_number = "Please enter PAN number";
    if (!data.verification_date) newErrors.verification_date = "Please select verification date";
    if (!data.verified_by.trim()) newErrors.verified_by = "Please enter verified by";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateVerification = async () => {
    if (!validateForm(editVerification)) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/verification/update/${editVerification.verification_id}`,
        editVerification,
        {
          headers: { Authorization: token },
        }
      );

      // update list in parent state
      setVerifications(
        verifications.map((v) =>
          v.verification_id === editVerification.verification_id ? editVerification : v
        )
      );

      setSuccessMessage("Verification updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error updating verification:", error);
      setApiError(error.response?.data?.error || "Failed to update verification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    setErrors({});
  };

  if (!showEditModal) return null;

  return (
    <div
      className={`thaniya-normal-overlay ${
        showEditModal ? "thaniya-overlay-visible" : ""
      }`}
    >
      <div className="thaniya-normal-backdrop" onClick={handleClose}></div>
      <div
        className={`thaniya-normal-modal ${
          showEditModal ? "thaniya-normal-modal-visible" : ""
        }`}
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Verification</h2>
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
                    value={editVerification.employee_id}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, employee_id: e.target.value })
                    }
                    isInvalid={!!errors.employee_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employee_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-lg"
                    placeholder="Enter Aadhar number"
                    value={editVerification.aadhar_number}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, aadhar_number: e.target.value })
                    }
                    isInvalid={!!errors.aadhar_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.aadhar_number}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter PAN number"
                    value={editVerification.pan_number}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, pan_number: e.target.value })
                    }
                    isInvalid={!!errors.pan_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pan_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Passport Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter passport number"
                    value={editVerification.passport_no}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, passport_no: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verification Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-lg"
                    value={editVerification.verification_date}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, verification_date: e.target.value })
                    }
                    isInvalid={!!errors.verification_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verification_date}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verified By</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter verified by"
                    value={editVerification.verified_by}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, verified_by: e.target.value })
                    }
                    isInvalid={!!errors.verified_by}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verified_by}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={editVerification.status}
                    onChange={(e) =>
                      setEditVerification({ ...editVerification, status: parseInt(e.target.value) })
                    }
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
          <button onClick={handleClose} className="s-btn s-btn-light">
            Cancel
          </button>
          <button
            onClick={handleUpdateVerification}
            className="s-btn s-btn-grad-danger"
            disabled={submitting}
          >
            {submitting ||"Update Verification"}
          </button>
        </div>
      </div>
    </div>
  );
};


  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div
      className={`thaniya-normal-overlay ${
        isAnimating ? "thaniya-overlay-visible" : ""
      }`}
    >
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div
        className={`thaniya-normal-modal ${
          isAnimating ? "thaniya-normal-modal-visible" : ""
        }`}
        style={{ maxWidth: "500px" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Confirm Delete</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
          <p>
            Are you sure you want to delete verification record for Employee ID{" "}
            <strong>{selectedVerification?.employee_id}</strong>?
          </p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <PageTitle
        activeMenu="Verification"
        motherMenu="Employee"
        pageContent="Employee Verification Records"
      />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Employee Verification</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search verifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button
                  className="s-btn s-btn-grad-danger"
                  onClick={openAddModal}
                >
                  + Add Verification
                </Button>
              </div>
            </Card.Header>

            <div className="s-card-body">
              {apiError && (
                <Alert variant="danger" className="mx-3 mt-3">
                  {apiError}
                </Alert>
              )}

              {successMessage && (
                <Alert variant="success" className="mx-3 mt-3">
                  {successMessage}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <Loader size={32} className="spin" />
                  <p className="mt-2">Loading verifications...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
                      <th>Aadhar Number</th>
                      <th>PAN Number</th>
                      <th>Passport No.</th>
                      <th>Verification Date</th>
                      <th>Verified By</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVerifications.length > 0 ? (
                      filteredVerifications.map((verification, index) => (
                        <tr key={verification.id}>
                          <th>{verification.id}</th>
                          <td>{verification.employee_id}</td>
                          <td>{verification.aadhar_number || "N/A"}</td>
                          <td>{verification.pan_number || "N/A"}</td>
                          <td>{verification.passport_no || "N/A"}</td>
                          <td>{verification.verification_date || "N/A"}</td>
                          <td>{verification.verified_by || "N/A"}</td>
                          <td>
                            <Badge
                              variant={
                                verification.status === 1
                                  ? "success light"
                                  : "danger light"
                              }
                            >
                              {verification.status === 1 ? "Verified" : "Pending"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex">
                              <button
                                onClick={() => openEditModal(verification)}
                                className="btn btn-custom-blue shadow btn-xs sharp me-1"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </button>
                              <button
                                onClick={() => openDeleteModal(verification)}
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
                        <td colSpan="9" className="text-center py-4">
                          {searchTerm ? 'No verification records found matching your search.' : 'No verification records available.'}
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

     {showAddModal && (
  <AddModal
    showAddModal={showAddModal}
    closeModal={closeModal}
    setVerifications={setVerifications}
    verifications={verifications}
    setSuccessMessage={setSuccessMessage}
    setApiError={setApiError}
    isAnimating={isAnimating}
  />
)}

{showEditModal && (
  <EditModal
    selectedVerification={selectedVerification}
    showEditModal={showEditModal}
    closeModal={closeModal}
    setVerifications={setVerifications}
    verifications={verifications}
  />
)}

{showDeleteModal && (
  <DeleteModal
    showDeleteModal={showDeleteModal}
    closeModal={closeModal}
    selectedVerification={selectedVerification}
    handleDelete={handleDelete}
    isAnimating={isAnimating}
  />
)}

    </Fragment>
  );
};

export default Verification;