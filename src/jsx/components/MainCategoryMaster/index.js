import React, { Fragment, useState,useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json"; 

const MainCategoryMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    description: "",
    status: 1
  });

  const [categories, setCategories] = useState(
    Data["mainCategories"]?.map((item, index) => ({
      id: index + 1,
      category_name: item.category_name || "",
      description: item.description || "",
      status: item.status === 1 ? 1 : 0
    })) || []
  );

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
    setNewCategory({
      category_name: "",
      description: "",
      status: 1
    });
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

  const handleDelete = () => {
    setCategories(categories.filter(category => category.id !== selectedCategory.id));
    closeModal();
  };

  const handleAddCategory = () => {
    if (!validateForm(newCategory)) return;
    
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, {...newCategory, id: newId}]);
    closeModal();
  };

  const handleUpdateCategory = () => {
    if (!validateForm(selectedCategory)) return;
    
    setCategories(categories.map(c => 
      c.id === selectedCategory.id ? selectedCategory : c
    ));
    closeModal();
  };

  // Add Category Modal
  const AddModal = () => {
    const [localCategory, setLocalCategory] = useState({
      category_name: "",
      description: "",
      status: 1
    });
    const [localErrors, setLocalErrors] = useState({});

    const handleReset = () => {
      setLocalCategory({
        category_name: "",
        description: "",
        status: 1
      });
      setLocalErrors({});
    };

    const handleSave = () => {
      if (!localCategory.category_name.trim()) {
        setLocalErrors({ category_name: "Please enter category name" });
        return;
      }
      
      const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      setCategories([...categories, {...localCategory, id: newId}]);
      closeModal();
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "700px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Main Category</h2>
            <button onClick={closeModal} className="thaniya-normal-close">
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
                      value={localCategory.category_name}
                      onChange={(e) => setLocalCategory({...localCategory, category_name: e.target.value})}
                      isInvalid={!!localErrors.category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.category_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={localCategory.description}
                      onChange={(e) => setLocalCategory({...localCategory, description: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={localCategory.status}
                      onChange={(e) => setLocalCategory({...localCategory, status: parseInt(e.target.value)})}
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
            <button onClick={handleSave} className="s-btn s-btn-grad-danger">
              Save Category
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Category Modal
const EditModal = ({ selectedCategory, closeModal }) => {
  const initialForm = selectedCategory || {
    category_name: "",
    description: "",
    status: 1,
  };

  const [editCategory, setEditCategory] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCategory) {
      setEditCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleReset = () => {
    setEditCategory(initialForm);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    closeModal();
  };

  const handleUpdateCategory = () => {
    // ✅ validation + API call logic here
    // if success:
    handleClose();
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
                      setEditCategory({
                        ...editCategory,
                        category_name: e.target.value,
                      })
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
                      setEditCategory({
                        ...editCategory,
                        description: e.target.value,
                      })
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
          >
            Update Category
          </button>
        </div>
      </div>
    </div>
  );
};



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
          <p>Are you sure you want to delete category <strong>{selectedCategory?.category_name}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );

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
               <div className="me-3" style={{ width: "300px" }}>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search categories..."
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
              <div className="d-flex align-items-center">

               
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Category
                </Button>
              </div>
            </Card.Header>

            <div className="s-card-body">
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
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <tr key={category.id}>
                        <th>{category.id}</th>
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
                        <td>{category.description}</td>
                        <td>
                          <Badge bg={category.status === 1 ? "success" : "danger"}>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        {searchTerm ? "No categories match your search" : "No categories found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>

      {showAddModal && <AddModal />}
      {showEditModal && (
  <EditModal 
    closeModal={() => setShowEditModal(false)}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    errors={errors}
    handleUpdateCategory={handleUpdateCategory}
  />
)}
      {showDeleteModal && <DeleteModal />}
    </Fragment>
  );
};

export default MainCategoryMaster;