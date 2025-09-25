import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search, FileText, Edit, Trash2 } from "lucide-react";
import axios from "axios";

const VendorMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [vendors, setVendors] = useState([]);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(`${API_BASE_URL}/vendormaster/get`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      setVendors(response.data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setApiError(error.response?.data?.error || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filter vendors based on search term
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return vendors.filter(vendor => 
      vendor.vendor_name.toLowerCase().includes(lowerSearchTerm) ||
      (vendor.contact_person && vendor.contact_person.toLowerCase().includes(lowerSearchTerm)) ||
      vendor.mobile_number.toLowerCase().includes(lowerSearchTerm) ||
      vendor.email.toLowerCase().includes(lowerSearchTerm) ||
      (vendor.gst_number && vendor.gst_number.toLowerCase().includes(lowerSearchTerm))
    );
  }, [vendors, searchTerm]);

  const validateForm = (vendorData) => {
    const newErrors = {};
    if (!vendorData.vendor_name.trim()) newErrors.vendor_name = "Please enter vendor name";
    if (!vendorData.mobile_number.trim()) newErrors.mobile_number = "Please enter mobile number";
    if (!vendorData.email.trim()) newErrors.email = "Please enter email";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (vendor) => {
    setSelectedVendor({...vendor});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedVendor(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/vendormaster/delete/${selectedVendor.vendor_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      
      setVendors(vendors.filter(vendor => vendor.vendor_id !== selectedVendor.vendor_id));
      setSuccessMessage("Vendor deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      setApiError(error.response?.data?.error || "Failed to delete vendor");
    }
  };

  // Add Vendor Modal
  const AddModal = ({ showAddModal, closeModal }) => {
    const initialForm = {
      vendor_name: "",
      mobile_number: "",
      gst_number: "",
      address: "",
      status: 1,
      contact_person: "",
      email: "",
      payment_terms: "Net 30",
    };

    const [newVendor, setNewVendor] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (showAddModal) {
        setNewVendor(initialForm);
        setErrors({});
      }
    }, [showAddModal]);

    const handleReset = () => {
      setNewVendor(initialForm);
      setErrors({});
    };

    const validateForm = (vendorData) => {
      const newErrors = {};
      if (!vendorData.vendor_name.trim()) newErrors.vendor_name = "Please enter vendor name";
      if (!vendorData.mobile_number.trim()) newErrors.mobile_number = "Please enter mobile number";
      if (!vendorData.email.trim()) newErrors.email = "Please enter email";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddVendor = async () => {
      if (!validateForm(newVendor)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_BASE_URL}/vendormaster/post`, newVendor, {
          headers: {
             Authorization: `Bearer ${token}`
          }
        });
        
        // Add the new vendor to the list with the ID from the response
        setVendors([...vendors, {...newVendor, vendor_id: response.data.vendorId}]);
        setSuccessMessage("Vendor added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error adding vendor:", error);
        setApiError(error.response?.data?.error || "Failed to add vendor");
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
            <h2 className="thaniya-normal-title">Add Vendor</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vendor Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter vendor name"
                      value={newVendor.vendor_name}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, vendor_name: e.target.value })
                      }
                      isInvalid={!!errors.vendor_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.vendor_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter mobile number"
                      value={newVendor.mobile_number}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, mobile_number: e.target.value })
                      }
                      isInvalid={!!errors.mobile_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter GST number"
                      value={newVendor.gst_number}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, gst_number: e.target.value })
                      }
                      isInvalid={!!errors.gst_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gst_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter address"
                      value={newVendor.address}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, address: e.target.value })
                      }
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={newVendor.status}
                      onChange={(e) =>
                        setNewVendor({
                          ...newVendor,
                          status: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter contact person"
                      value={newVendor.contact_person}
                      onChange={(e) =>
                        setNewVendor({
                          ...newVendor,
                          contact_person: e.target.value,
                        })
                      }
                      isInvalid={!!errors.contact_person}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contact_person}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="form-control-lg"
                      placeholder="Enter email"
                      value={newVendor.email}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment Terms</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={newVendor.payment_terms}
                      onChange={(e) =>
                        setNewVendor({
                          ...newVendor,
                          payment_terms: e.target.value,
                        })
                      }
                    >
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
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
              onClick={handleAddVendor}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Save Vendor"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Vendor Modal
  const EditModal = ({ selectedVendor, showEditModal, closeModal }) => {
    const initialForm = selectedVendor || {
      vendor_name: "",
      mobile_number: "",
      gst_number: "",
      address: "",
      status: 1,
      contact_person: "",
      email: "",
      payment_terms: "Net 30",
    };

    const [editVendor, setEditVendor] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedVendor) {
        setEditVendor(selectedVendor);
      }
    }, [selectedVendor]);

    const handleReset = () => {
      setEditVendor(initialForm);
      setErrors({});
    };

    const validateForm = (vendorData) => {
      const newErrors = {};
      if (!vendorData.vendor_name.trim()) newErrors.vendor_name = "Please enter vendor name";
      if (!vendorData.mobile_number.trim()) newErrors.mobile_number = "Please enter mobile number";
      if (!vendorData.email.trim()) newErrors.email = "Please enter email";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateVendor = async () => {
      if (!validateForm(editVendor)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        await axios.put(`${API_BASE_URL}/vendormaster/update/${editVendor.vendor_id}`, editVendor, {
          headers: {
             Authorization: `Bearer ${token}`
          }
        });
        
        setVendors(vendors.map(v => 
          v.vendor_id === editVendor.vendor_id ? editVendor : v
        ));
        setSuccessMessage("Vendor updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error updating vendor:", error);
        setApiError(error.response?.data?.error || "Failed to update vendor");
      } finally {
        setSubmitting(false);
      }
    };

    const handleClose = () => {
      closeModal();
    };

    if (!showEditModal) return null;

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
            <h2 className="thaniya-normal-title">Edit Vendor</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vendor Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter vendor name"
                      value={editVendor.vendor_name}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, vendor_name: e.target.value })
                      }
                      isInvalid={!!errors.vendor_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.vendor_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter mobile number"
                      value={editVendor.mobile_number}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, mobile_number: e.target.value })
                      }
                      isInvalid={!!errors.mobile_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter GST number"
                      value={editVendor.gst_number}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, gst_number: e.target.value })
                      }
                      isInvalid={!!errors.gst_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gst_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter address"
                      value={editVendor.address}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, address: e.target.value })
                      }
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editVendor.status}
                      onChange={(e) =>
                        setEditVendor({
                          ...editVendor,
                          status: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter contact person"
                      value={editVendor.contact_person}
                      onChange={(e) =>
                        setEditVendor({
                          ...editVendor,
                          contact_person: e.target.value,
                        })
                      }
                      isInvalid={!!errors.contact_person}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contact_person}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="form-control-lg"
                      placeholder="Enter email"
                      value={editVendor.email}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment Terms</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editVendor.payment_terms}
                      onChange={(e) =>
                        setEditVendor({
                          ...editVendor,
                          payment_terms: e.target.value,
                        })
                      }
                    >
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
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
              onClick={handleUpdateVendor}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Update Vendor"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedVendor, showDeleteModal, closeModal, handleDelete }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = async () => {
      setDeleting(true);
      await handleDelete();
      setDeleting(false);
    };

    const handleClose = () => {
      closeModal();
    };

    if (!showDeleteModal) return null;

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`} style={{maxWidth: '500px'}}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Confirm Delete</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>
          <div className="thaniya-normal-body">
            <p>Are you sure you want to delete vendor <strong>{selectedVendor?.vendor_name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDeleteClick} className="s-btn s-btn-grad-danger" disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : "Delete Vendor"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Vendor Master" motherMenu="Masters" pageContent="Vendor Master List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Vendor Master</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Vendor
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
                  <Spinner animation="border" role="status" variant="primary" />
                  <p className="mt-2">Loading vendors...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Vendor Name</th>
                      <th>Contact Person</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>GST Number</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor, index) => (
                      <tr key={vendor.vendor_id}>
                        <th>{index + 1}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={index % 2 === 0 ? avatar1 : avatar2}
                              className="rounded-lg me-2"
                              width="24"
                              alt=""
                            />
                            <span className="s-w-space-no">{vendor.vendor_name}</span>
                          </div>
                        </td>
                        <td>{vendor.contact_person || "-"}</td>
                        <td>{vendor.mobile_number}</td>
                        <td>{vendor.email}</td>
                        <td>{vendor.gst_number || "-"}</td>
                        <td>
                          <Badge variant={vendor.status === 1 ? "success light" : "danger light"}>
                            {vendor.status === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button 
                              onClick={() => openEditModal(vendor)}
                              className="btn btn-custom-blue shadow btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>

                            <button 
                              onClick={() => openDeleteModal(vendor)}
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredVendors.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          {searchTerm ? `No vendors found matching "${searchTerm}"` : 'No vendors found'}
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

      <AddModal showAddModal={showAddModal} closeModal={closeModal} />
      <EditModal 
        selectedVendor={selectedVendor} 
        showEditModal={showEditModal} 
        closeModal={closeModal} 
      />
      <DeleteModal 
        selectedVendor={selectedVendor} 
        showDeleteModal={showDeleteModal} 
        closeModal={closeModal} 
        handleDelete={handleDelete}
      />
    </Fragment>
  );
};

export default VendorMaster;