import React, { Fragment, useState, useMemo, useEffect } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, InputGroup, Spinner } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { X, Search } from "lucide-react";
import axios from "axios";

const SubCategoryMaster = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    main_category_id: "",
    sub_category_name: "",
    description: "",
    status: 1
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subCategoriesRes, mainCategoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/subcategory/getall`),
        axios.get(`${API_BASE_URL}/api/maincategory/getall`)
      ]);
      
      setSubCategories(subCategoriesRes.data);
      setMainCategories(mainCategoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    setNewSubCategory({
      main_category_id: "",
      sub_category_name: "",
      description: "",
      status: 1
    });
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
      setSaving(true);
      await axios.delete(`${API_BASE_URL}/api/subcategory/delete/${selectedSubCategory.id}`);
      setSubCategories(subCategories.filter(item => item.id !== selectedSubCategory.id));
      closeModal();
      alert("Sub category deleted successfully!");
    } catch (error) {
      console.error("Error deleting sub category:", error);
      alert("Failed to delete sub category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubCategory = async () => {
    if (!validateForm(newSubCategory)) return;
    
    try {
      setSaving(true);
      const response = await axios.post(`${API_BASE_URL}/api/subcategory/post`, newSubCategory);
      setSubCategories([...subCategories, response.data]);
      closeModal();
      alert("Sub category added successfully!");
    } catch (error) {
      console.error("Error adding sub category:", error);
      alert("Failed to add sub category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubCategory = async () => {
    if (!validateForm(selectedSubCategory)) return;
    
    try {
      setSaving(true);
      await axios.put(`${API_BASE_URL}/api/subcategory/update/${selectedSubCategory.id}`, selectedSubCategory);
      setSubCategories(subCategories.map(item => 
        item.id === selectedSubCategory.id ? selectedSubCategory : item
      ));
      closeModal();
      alert("Sub category updated successfully!");
    } catch (error) {
      console.error("Error updating sub category:", error);
      alert("Failed to update sub category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Add Sub Category Modal
  const AddModal = () => {
    const [localSubCategory, setLocalSubCategory] = useState({
      main_category_id: "",
      sub_category_name: "",
      description: "",
      status: 1
    });
    const [localErrors, setLocalErrors] = useState({});

    const handleReset = () => {
      setLocalSubCategory({
        main_category_id: "",
        sub_category_name: "",
        description: "",
        status: 1
      });
      setLocalErrors({});
    };

    const handleSave = async () => {
      if (!localSubCategory.main_category_id) {
        setLocalErrors({ main_category_id: "Please select main category" });
        return;
      }
      if (!localSubCategory.sub_category_name.trim()) {
        setLocalErrors({ sub_category_name: "Please enter sub category name" });
        return;
      }
      
      try {
        setSaving(true);
        const response = await axios.post(`${API_BASE_URL}/api/subcategory/post`, localSubCategory);
        setSubCategories([...subCategories, response.data]);
        closeModal();
        alert("Sub category added successfully!");
      } catch (error) {
        console.error("Error adding sub category:", error);
        alert("Failed to add sub category. Please try again.");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "700px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Sub Category</h2>
            <button onClick={closeModal} className="thaniya-normal-close">
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
                      value={localSubCategory.main_category_id}
                      onChange={(e) => setLocalSubCategory({...localSubCategory, main_category_id: parseInt(e.target.value)})}
                    >
                      <option value="" disabled>Choose...</option>
                      {mainCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                    {localErrors.main_category_id && (
                      <div className="text-danger small mt-1">
                        {localErrors.main_category_id}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Sub Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter sub category name"
                      value={localSubCategory.sub_category_name}
                      onChange={(e) => setLocalSubCategory({...localSubCategory, sub_category_name: e.target.value})}
                      isInvalid={!!localErrors.sub_category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {localErrors.sub_category_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={localSubCategory.description}
                      onChange={(e) => setLocalSubCategory({...localSubCategory, description: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={localSubCategory.status}
                      onChange={(e) => setLocalSubCategory({...localSubCategory, status: parseInt(e.target.value)})}
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
            <button onClick={handleReset} className="s-btn s-btn-light" disabled={saving}>
              Reset
            </button>
            <button onClick={handleSave} className="s-btn s-btn-grad-danger" disabled={saving}>
              {saving ? <Spinner animation="border" size="sm" /> : "Save Sub Category"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Sub Category Modal
  const EditModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`} style={{ maxWidth: "900px", width: "90%" }}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Sub Category</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Main Category</Form.Label>
                  <div className="form-group d-flex align-items-center">
                    <select
                      className="form-control form-control-lg"
                      value={selectedSubCategory?.main_category_id || ''}
                      onChange={(e) => setSelectedSubCategory({...selectedSubCategory, main_category_id: parseInt(e.target.value)})}
                      style={{width: '100%'}}
                    >
                      <option value="" disabled>Choose...</option>
                      {mainCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.main_category_id && (
                    <div className="text-danger small mt-1">{errors.main_category_id}</div>
                  )}
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Sub Category Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter sub category name"
                    value={selectedSubCategory?.sub_category_name || ''}
                    onChange={(e) => setSelectedSubCategory({...selectedSubCategory, sub_category_name: e.target.value})}
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
                    value={selectedSubCategory?.description || ''}
                    onChange={(e) => setSelectedSubCategory({...selectedSubCategory, description: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <div className="form-group d-flex align-items-center">
                    <select
                      className="form-control form-control-lg"
                      value={selectedSubCategory?.status || 1}
                      onChange={(e) => setSelectedSubCategory({...selectedSubCategory, status: parseInt(e.target.value)})}
                      style={{width: '100%'}}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleUpdateSubCategory} className="s-btn s-btn-grad-danger" disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : "Update Sub Category"}
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
          <p>Are you sure you want to delete sub category <strong>{selectedSubCategory?.sub_category_name}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger" disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : "Delete Sub Category"}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
              <div className="me-3" style={{ width: "300px" }}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search sub categories..."
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
                  + Add Sub Category
                </Button>
              </div>
            </Card.Header>

            <div className="s-card-body">
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
                  {filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((subCategory) => (
                      <tr key={subCategory.id}>
                        <th>{subCategory.id}</th>
                        <td>{getMainCategoryName(subCategory.main_category_id)}</td>
                        <td>{subCategory.sub_category_name}</td>
                        <td>{subCategory.description}</td>
                        <td>
                          <Badge bg={subCategory.status === 1 ? "success" : "danger"}>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        {searchTerm ? "No sub categories match your search" : "No sub categories found"}
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
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
    </Fragment>
  );
};

export default SubCategoryMaster;