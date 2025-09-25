import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { X, Search } from "lucide-react";
import axios from "axios";

const SubCategoryMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";



    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const response = await axios.get(`${API_BASE_URL}/subcategory/getall`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSubCategories(response.data);
        setApiError("");
      } catch (error) {
        console.error("Error fetching categories:", error);
        setApiError(error.response?.data?.error || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };


const fetchCategories = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("authtoken");
    const response = await axios.get(`${API_BASE_URL}/maincategory/get`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setMainCategories(response.data); // Changed from setCategories to setMainCategories
    setApiError("");
  } catch (error) {
    console.error("Error fetching categories:", error);
    setApiError(error.response?.data?.error || "Failed to fetch categories");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  // Get main category name by ID
  const getMainCategoryName = (id) => {
    const category = mainCategories.find(cat => cat.id === id);
    return category ? category.category_name : "Unknown";
  };

  // Filter sub categories based on search term
  const filteredSubCategories = useMemo(() => {
    if (!searchTerm) return subCategories;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return subCategories.filter(subCategory => 
      subCategory.sub_category_name.toLowerCase().includes(lowerSearchTerm) ||
      (subCategory.description && subCategory.description.toLowerCase().includes(lowerSearchTerm)) ||
      getMainCategoryName(subCategory.main_category_id).toLowerCase().includes(lowerSearchTerm)
    );
  }, [subCategories, searchTerm, mainCategories]);

  const validateForm = (subCategoryData) => {
    const newErrors = {};
    if (!subCategoryData.main_category_id) newErrors.main_category_id = "Please select main category";
    if (!subCategoryData.sub_category_name.trim()) newErrors.sub_category_name = "Please enter sub category name";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (subCategory) => {
    setSelectedSubCategory({...subCategory});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedSubCategory(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/subcategory/delete/${selectedSubCategory.id}`);
      
      setSubCategories(subCategories.filter(subCategory => subCategory.id !== selectedSubCategory.id));
      setSuccessMessage("Sub category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error deleting sub category:", error);
      setApiError(error.response?.data?.error || "Failed to delete sub category");
    }
  };

  // Add Sub Category Modal
  const AddModal = ({ showAddModal, closeModal }) => {
    const initialForm = {
      main_category_id: "",
      sub_category_name: "",
      description: "",
      status: 1
    };

    const [newSubCategory, setNewSubCategory] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (showAddModal) {
        setNewSubCategory(initialForm);
        setErrors({});
      }
    }, [showAddModal]);

    const handleReset = () => {
      setNewSubCategory(initialForm);
      setErrors({});
    };

    const validateForm = (subCategoryData) => {
      const newErrors = {};
      if (!subCategoryData.main_category_id) newErrors.main_category_id = "Please select main category";
      if (!subCategoryData.sub_category_name.trim()) newErrors.sub_category_name = "Please enter sub category name";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  const handleAddSubCategory = async () => {
  if (!validateForm(newSubCategory)) return;
  
  try {
    setSubmitting(true);
    const token = localStorage.getItem("authtoken"); 
    const response = await axios.post(`${API_BASE_URL}/subcategory/post`, newSubCategory, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }); // Moved the closing parenthesis to the correct position
    
    setSubCategories([...subCategories, response.data]);
    setSuccessMessage("Sub category added successfully!");
    fetchData();
    setTimeout(() => setSuccessMessage(""), 3000);
    closeModal();
  } catch (error) {
    console.error("Error adding sub category:", error);
    setApiError(error.response?.data?.error || "Failed to add sub category");
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
            <h2 className="thaniya-normal-title">Add Sub Category</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                 <Form.Group className="mb-3">
  <Form.Label>Main Category</Form.Label>
  <select
    className="form-control form-control-lg"
    value={newSubCategory.main_category_id}
    onChange={(e) =>
      setNewSubCategory({ ...newSubCategory, main_category_id: parseInt(e.target.value) })
    }
    isInvalid={!!errors.main_category_id}
  >
    <option value="" disabled>Choose...</option>
    {mainCategories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.category_name} {/* This correctly displays the category name */}
      </option>
    ))}
  </select>
  <Form.Control.Feedback type="invalid">
    {errors.main_category_id}
  </Form.Control.Feedback>
</Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Sub Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter sub category name"
                      value={newSubCategory.sub_category_name}
                      onChange={(e) =>
                        setNewSubCategory({ ...newSubCategory, sub_category_name: e.target.value })
                      }
                      isInvalid={!!errors.sub_category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sub_category_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={newSubCategory.description}
                      onChange={(e) =>
                        setNewSubCategory({ ...newSubCategory, description: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={newSubCategory.status}
                      onChange={(e) =>
                        setNewSubCategory({
                          ...newSubCategory,
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
              onClick={handleAddSubCategory}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Save Sub Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Sub Category Modal
  const EditModal = ({ selectedSubCategory, showEditModal, closeModal }) => {
    const initialForm = selectedSubCategory || {
      main_category_id: "",
      sub_category_name: "",
      description: "",
      status: 1,
    };

    const [editSubCategory, setEditSubCategory] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedSubCategory) {
        setEditSubCategory(selectedSubCategory);
      }
    }, [selectedSubCategory]);

    const handleReset = () => {
      setEditSubCategory(initialForm);
      setErrors({});
    };

    const validateForm = (subCategoryData) => {
      const newErrors = {};
      if (!subCategoryData.main_category_id) newErrors.main_category_id = "Please select main category";
      if (!subCategoryData.sub_category_name.trim()) newErrors.sub_category_name = "Please enter sub category name";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateSubCategory = async () => {
      if (!validateForm(editSubCategory)) return;
      
      try {
        setSubmitting(true);
        await axios.put(`${API_BASE_URL}/subcategory/update/${editSubCategory.id}`, editSubCategory);
        
        setSubCategories(subCategories.map(c => 
          c.id === editSubCategory.id ? editSubCategory : c
        ));
        setSuccessMessage("Sub category updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error updating sub category:", error);
        setApiError(error.response?.data?.error || "Failed to update sub category");
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
            <h2 className="thaniya-normal-title">Edit Sub Category</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Main Category</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editSubCategory.main_category_id}
                      onChange={(e) =>
                        setEditSubCategory({ ...editSubCategory, main_category_id: parseInt(e.target.value) })
                      }
                      isInvalid={!!errors.main_category_id}
                    >
                      <option value="" disabled>Choose...</option>
                      {mainCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                    <Form.Control.Feedback type="invalid">
                      {errors.main_category_id}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Sub Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter sub category name"
                      value={editSubCategory.sub_category_name}
                      onChange={(e) =>
                        setEditSubCategory({ ...editSubCategory, sub_category_name: e.target.value })
                      }
                      isInvalid={!!errors.sub_category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sub_category_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={editSubCategory.description}
                      onChange={(e) =>
                        setEditSubCategory({ ...editSubCategory, description: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editSubCategory.status}
                      onChange={(e) =>
                        setEditSubCategory({
                          ...editSubCategory,
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
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button
              onClick={handleUpdateSubCategory}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Update Sub Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedSubCategory, showDeleteModal, closeModal, handleDelete }) => {
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
            <p>Are you sure you want to delete sub category <strong>{selectedSubCategory?.sub_category_name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDeleteClick} className="s-btn s-btn-grad-danger" disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : "Delete Sub Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Sub Category" motherMenu="Masters" pageContent="Sub Category List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Sub Category Master</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search sub categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Sub Category
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
                  <p className="mt-2">Loading sub categories...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Main Category</th>
                      <th>Sub Category Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubCategories.map((subCategory, index) => (
                      <tr key={subCategory.id}>
                        <th>{index + 1}</th>
                        <td>{getMainCategoryName(subCategory.main_category_id)}</td>
                        <td>{subCategory.sub_category_name}</td>
                        <td>{subCategory.description || "-"}</td>
                        <td>
                          <Badge variant={subCategory.status === 1 ? "success light" : "danger light"}>
                            {subCategory.status === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button 
                              onClick={() => openEditModal(subCategory)}
                              className="btn btn-custom-blue shadow btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>

                            <button 
                              onClick={() => openDeleteModal(subCategory)}
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSubCategories.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          {searchTerm ? `No sub categories found matching "${searchTerm}"` : 'No sub categories found'}
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
        selectedSubCategory={selectedSubCategory} 
        showEditModal={showEditModal} 
        closeModal={closeModal} 
      />
      <DeleteModal 
        selectedSubCategory={selectedSubCategory} 
        showDeleteModal={showDeleteModal} 
        closeModal={closeModal} 
        handleDelete={handleDelete}
      />
    </Fragment>
  );
};

export default SubCategoryMaster;