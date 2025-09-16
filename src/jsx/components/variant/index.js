import React, { Fragment, useState, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json"; 

const VariantMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newVariant, setNewVariant] = useState({
    variant_name: "",
    option_values: "",
    description: ""
  });
  
  const [variants, setVariants] = useState(
    Data["variants"]?.map((item, index) => ({
      id: item.id || index + 1,
      variant_name: item.name || "",
      option_values: "Option 1,Option 2", // Default values or map from your data
      description: `Subcategory ID: ${item.subcategory_id}` // Or any other mapping
    })) || []
  );

  // Filter variants based on search term
  const filteredVariants = useMemo(() => {
    if (!searchTerm) return variants;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return variants.filter(variant => 
      variant.variant_name.toLowerCase().includes(lowerSearchTerm) ||
      variant.option_values.toLowerCase().includes(lowerSearchTerm) ||
      variant.description.toLowerCase().includes(lowerSearchTerm)
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
    setNewVariant({
      variant_name: "",
      option_values: "",
      description: ""
    });
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

  const handleDelete = () => {
    setVariants(variants.filter(variant => variant.id !== selectedVariant.id));
    closeModal();
  };

  const handleAddVariant = () => {
    if (!validateForm(newVariant)) return;
    
    const newId = variants.length > 0 ? Math.max(...variants.map(v => v.id)) + 1 : 1;
    setVariants([...variants, {...newVariant, id: newId}]);
    closeModal();
  };

  const handleUpdateVariant = () => {
    if (!validateForm(selectedVariant)) return;
    
    setVariants(variants.map(v => 
      v.id === selectedVariant.id ? selectedVariant : v
    ));
    closeModal();
  };

  // Add Variant Modal
  const AddModal = () => {
    const initialForm = {
      variant_name: "",
      option_values: "",
      description: "",
    };

    const [newVariant, setNewVariant] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const handleReset = () => {
      setNewVariant(initialForm);
      setErrors({});
    };

    const handleAddVariant = () => {
      // ✅ validation + API call logic here
      // if success:
      handleReset(); // reset form
      closeModal();
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
            >
              Save Variant
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Variant Modal
  const EditModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`} style={{ maxWidth: "900px", width: "90%" }}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Variant</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
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
                    value={selectedVariant?.variant_name || ''}
                    onChange={(e) => setSelectedVariant({...selectedVariant, variant_name: e.target.value})}
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
                    value={selectedVariant?.option_values || ''}
                    onChange={(e) => setSelectedVariant({...selectedVariant, option_values: e.target.value})}
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
                    value={selectedVariant?.description || ''}
                    onChange={(e) => setSelectedVariant({...selectedVariant, description: e.target.value})}
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
          <button onClick={handleUpdateVariant} className="s-btn s-btn-grad-danger">
            Update Variant
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
          <p>Are you sure you want to delete variant <strong>{selectedVariant?.variant_name}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
            Delete Variant
          </button>
        </div>
      </div>
    </div>
  );

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
                <InputGroup style={{ width: '300px', marginRight: '15px' }}>
                  <InputGroup.Text>
                    <Search size={16} />
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
              {filteredVariants.length === 0 && variants.length > 0 ? (
                <Alert variant="info" className="m-3">
                  No variants found matching your search criteria.
                </Alert>
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
                        <th>{variant.id}</th>
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
                            <Badge key={i} bg="light" className="me-1 text-dark">
                              {value.trim()}
                            </Badge>
                          ))}
                        </td>
                        <td>{variant.description}</td>
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

export default VariantMaster;