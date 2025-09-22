import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import axios from "axios";

const VariantMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch variants from API
  const fetchVariants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/variant/getall`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVariants(response.data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching variants:", error);
      setApiError(error.response?.data?.error || "Failed to fetch variants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  // Filter variants based on search term
  const filteredVariants = useMemo(() => {
    if (!searchTerm) return variants;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return variants.filter(variant => 
      variant.variant_name.toLowerCase().includes(lowerSearchTerm) ||
      variant.option_values.toLowerCase().includes(lowerSearchTerm) ||
      (variant.description && variant.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [variants, searchTerm]);

  const validateForm = (variantData) => {
    const newErrors = {};
    if (!variantData.variant_name.trim()) newErrors.variant_name = "Please enter variant name";
    if (!variantData.option_values.trim()) newErrors.option_values = "Please enter option values";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (variant) => {
    setSelectedVariant({...variant});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (variant) => {
    setSelectedVariant(variant);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedVariant(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/variant/delete/${selectedVariant.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setVariants(variants.filter(variant => variant.id !== selectedVariant.id));
      setSuccessMessage("Variant deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error deleting variant:", error);
      setApiError(error.response?.data?.error || "Failed to delete variant");
    }
  };

  // Add Variant Modal
  const AddModal = ({ showAddModal, closeModal }) => {
    const initialForm = {
      variant_name: "",
      option_values: "",
      description: "",
    };

    const [newVariant, setNewVariant] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (showAddModal) {
        setNewVariant(initialForm);
        setErrors({});
      }
    }, [showAddModal]);

    const handleReset = () => {
      setNewVariant(initialForm);
      setErrors({});
    };

    const validateForm = (variantData) => {
      const newErrors = {};
      if (!variantData.variant_name.trim()) newErrors.variant_name = "Please enter variant name";
      if (!variantData.option_values.trim()) newErrors.option_values = "Please enter option values";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddVariant = async () => {
      if (!validateForm(newVariant)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_BASE_URL}/variant/post`, newVariant, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Add the new variant to the list with the ID from the response
        setVariants([...variants, {...newVariant, id: response.data.id}]);
        setSuccessMessage("Variant added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error adding variant:", error);
        setApiError(error.response?.data?.error || "Failed to add variant");
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
          style={{ maxWidth: "700px", width: "90%" }}
        >
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Variant</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  {/* Variant Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Variant Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="e.g., Color, Size"
                      value={newVariant.variant_name}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          variant_name: e.target.value,
                        })
                      }
                      isInvalid={!!errors.variant_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.variant_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Option Values */}
                  <Form.Group className="mb-3">
                    <Form.Label>Option Values</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Comma separated values (e.g., Red,Blue,Green)"
                      value={newVariant.option_values}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          option_values: e.target.value,
                        })
                      }
                      isInvalid={!!errors.option_values}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.option_values}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Separate multiple values with commas
                    </Form.Text>
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={newVariant.description}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          description: e.target.value,
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
              onClick={handleAddVariant}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Save Variant"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Variant Modal
  const EditModal = ({ selectedVariant, showEditModal, closeModal }) => {
    const initialForm = selectedVariant || {
      variant_name: "",
      option_values: "",
      description: "",
    };

    const [editVariant, setEditVariant] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedVariant) {
        setEditVariant(selectedVariant);
      }
    }, [selectedVariant]);

    const handleReset = () => {
      setEditVariant(initialForm);
      setErrors({});
    };

    const validateForm = (variantData) => {
      const newErrors = {};
      if (!variantData.variant_name.trim()) newErrors.variant_name = "Please enter variant name";
      if (!variantData.option_values.trim()) newErrors.option_values = "Please enter option values";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateVariant = async () => {
      if (!validateForm(editVariant)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        await axios.put(`${API_BASE_URL}/variant/update/${editVariant.id}`, editVariant, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setVariants(variants.map(v => 
          v.id === editVariant.id ? editVariant : v
        ));
        setSuccessMessage("Variant updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error updating variant:", error);
        setApiError(error.response?.data?.error || "Failed to update variant");
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
          style={{ maxWidth: "700px", width: "90%" }}
        >
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Edit Variant</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Variant Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="e.g., Color, Size"
                      value={editVariant.variant_name}
                      onChange={(e) =>
                        setEditVariant({ ...editVariant, variant_name: e.target.value })
                      }
                      isInvalid={!!errors.variant_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.variant_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Option Values</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Comma separated values"
                      value={editVariant.option_values}
                      onChange={(e) =>
                        setEditVariant({ ...editVariant, option_values: e.target.value })
                      }
                      isInvalid={!!errors.option_values}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.option_values}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={editVariant.description}
                      onChange={(e) =>
                        setEditVariant({ ...editVariant, description: e.target.value })
                      }
                    />
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
              onClick={handleUpdateVariant}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Update Variant"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedVariant, showDeleteModal, closeModal, handleDelete }) => {
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
            <p>Are you sure you want to delete variant <strong>{selectedVariant?.variant_name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDeleteClick} className="s-btn s-btn-grad-danger" disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : "Delete Variant"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Variants" motherMenu="Masters" pageContent="Variants List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Product Variants</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search variants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Variant
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
                  <p className="mt-2">Loading variants...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Variant Name</th>
                      <th>Option Values</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVariants.map((variant, index) => (
                      <tr key={variant.id}>
                        <th>{index + 1}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={index % 2 === 0 ? avatar1 : avatar2}
                              className="rounded-lg me-2"
                              width="24"
                              alt=""
                            />
                            <span className="s-w-space-no">{variant.variant_name}</span>
                          </div>
                        </td>
                        <td>
                          {variant.option_values.split(',').map((value, i) => (
                            <Badge key={i} variant="light" className="me-1 text-dark">
                              {value.trim()}
                            </Badge>
                          ))}
                        </td>
                        <td>{variant.description || "-"}</td>
                        <td>
                          <div className="d-flex">
                            <button 
                              onClick={() => openEditModal(variant)}
                              className="btn btn-custom-blue shadow btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>

                            <button 
                              onClick={() => openDeleteModal(variant)}
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredVariants.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          {searchTerm ? `No variants found matching "${searchTerm}"` : 'No variants found'}
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
        selectedVariant={selectedVariant} 
        showEditModal={showEditModal} 
        closeModal={closeModal} 
      />
      <DeleteModal 
        selectedVariant={selectedVariant} 
        showDeleteModal={showDeleteModal} 
        closeModal={closeModal} 
        handleDelete={handleDelete}
      />
    </Fragment>
  );
};

export default VariantMaster;