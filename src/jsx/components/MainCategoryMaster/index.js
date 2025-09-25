import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import axios from "axios";

const MainCategoryMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(`${API_BASE_URL}/maincategory/get`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(response.data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching categories:", error);
      setApiError(error.response?.data?.error || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.category_name.toLowerCase().includes(lowerSearchTerm) ||
      (category.description && category.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [categories, searchTerm]);

  const validateForm = (categoryData) => {
    const newErrors = {};
    if (!categoryData.category_name.trim()) newErrors.category_name = "Please enter category name";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (category) => {
    setSelectedCategory({...category});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedCategory(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      await axios.delete(`${API_BASE_URL}/maincategory/delete/${selectedCategory.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCategories(categories.filter(category => category.id !== selectedCategory.id));
      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error deleting category:", error);
      setApiError(error.response?.data?.error || "Failed to delete category");
    }
  };

  // Add Category Modal
  const AddModal = ({ showAddModal, closeModal }) => {
    const initialForm = {
      category_name: "",
      description: "",
      status: 1
    };

    const [newCategory, setNewCategory] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (showAddModal) {
        setNewCategory(initialForm);
        setErrors({});
      }
    }, [showAddModal]);

    const handleReset = () => {
      setNewCategory(initialForm);
      setErrors({});
    };

    const validateForm = (categoryData) => {
      const newErrors = {};
      if (!categoryData.category_name.trim()) newErrors.category_name = "Please enter category name";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddCategory = async () => {
      if (!validateForm(newCategory)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("authtoken");
        const response = await axios.post(`${API_BASE_URL}/maincategory/post`, newCategory, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Add the new category to the list with the ID from the response
        setCategories([...categories, {...newCategory, id: response.data.categoryId}]);
        setSuccessMessage("Category added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error adding category:", error);
        setApiError(error.response?.data?.error || "Failed to add category");
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
            <h2 className="thaniya-normal-title">Add Main Category</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter category name"
                      value={newCategory.category_name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, category_name: e.target.value })
                      }
                      isInvalid={!!errors.category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.category_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, description: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={newCategory.status}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
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
              onClick={handleAddCategory}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Save Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Category Modal
  const EditModal = ({ selectedCategory, showEditModal, closeModal }) => {
    const initialForm = selectedCategory || {
      category_name: "",
      description: "",
      status: 1,
    };

    const [editCategory, setEditCategory] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedCategory) {
        setEditCategory(selectedCategory);
      }
    }, [selectedCategory]);

    const handleReset = () => {
      setEditCategory(initialForm);
      setErrors({});
    };

    const validateForm = (categoryData) => {
      const newErrors = {};
      if (!categoryData.category_name.trim()) newErrors.category_name = "Please enter category name";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateCategory = async () => {
      if (!validateForm(editCategory)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("authtoken");
        await axios.put(`${API_BASE_URL}/maincategory/update/${editCategory.id}`, editCategory, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setCategories(categories.map(c => 
          c.id === editCategory.id ? editCategory : c
        ));
        setSuccessMessage("Category updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error updating category:", error);
        setApiError(error.response?.data?.error || "Failed to update category");
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
            <h2 className="thaniya-normal-title">Edit Main Category</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter category name"
                      value={editCategory.category_name}
                      onChange={(e) =>
                        setEditCategory({ ...editCategory, category_name: e.target.value })
                      }
                      isInvalid={!!errors.category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.category_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={editCategory.description}
                      onChange={(e) =>
                        setEditCategory({ ...editCategory, description: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editCategory.status}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
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
              onClick={handleUpdateCategory}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Update Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedCategory, showDeleteModal, closeModal, handleDelete }) => {
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
            <p>Are you sure you want to delete category <strong>{selectedCategory?.category_name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDeleteClick} className="s-btn s-btn-grad-danger" disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : "Delete Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Main Category" motherMenu="Masters" pageContent="Main Category List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Main Category</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Category
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
                  <p className="mt-2">Loading categories...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category, index) => (
                      <tr key={category.id}>
                        <th>{index + 1}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={index % 2 === 0 ? avatar1 : avatar2}
                              className="rounded-lg me-2"
                              width="24"
                              alt=""
                            />
                            <span className="s-w-space-no">{category.category_name}</span>
                          </div>
                        </td>
                        <td>{category.description || "-"}</td>
                        <td>
                          <Badge variant={category.status === 1 ? "success light" : "danger light"}>
                            {category.status === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button 
                              onClick={() => openEditModal(category)}
                              className="btn btn-custom-blue shadow btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>

                            <button 
                              onClick={() => openDeleteModal(category)}
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCategories.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          {searchTerm ? `No categories found matching "${searchTerm}"` : 'No categories found'}
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
        selectedCategory={selectedCategory} 
        showEditModal={showEditModal} 
        closeModal={closeModal} 
      />
      <DeleteModal 
        selectedCategory={selectedCategory} 
        showDeleteModal={showDeleteModal} 
        closeModal={closeModal} 
        handleDelete={handleDelete}
      />
    </Fragment>
  );
};

export default MainCategoryMaster;