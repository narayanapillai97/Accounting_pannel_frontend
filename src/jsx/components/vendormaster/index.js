import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search, FileText, Edit, Trash2 } from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json"; 

const VendorMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  const [vendors, setVendors] = useState(
    Data["vendors"].map((item, index) => ({
      id: index + 1,
      vendorName: item.vendorName,
      contactPerson: item.contactPerson,
      mobile: item.mobile,
      email: item.email,
      gst: item.gst,
      address: item.address,
      paymentTerms: item.paymentTerms,
      status: item.status === 1 ? 1 : 0
    }))
  );

  // Filter vendors based on search term
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return vendors.filter(vendor => 
      vendor.vendorName.toLowerCase().includes(lowerSearchTerm) ||
      vendor.contactPerson.toLowerCase().includes(lowerSearchTerm) ||
      vendor.mobile.toLowerCase().includes(lowerSearchTerm) ||
      vendor.email.toLowerCase().includes(lowerSearchTerm) ||
      vendor.gst.toLowerCase().includes(lowerSearchTerm)
    );
  }, [vendors, searchTerm]);

  const validateForm = (vendorData) => {
    const newErrors = {};
    if (!vendorData.vendorName.trim()) newErrors.vendorName = "Please enter vendor name";
    if (!vendorData.contactPerson.trim()) newErrors.contactPerson = "Please enter contact person";
    if (!vendorData.mobile.trim()) newErrors.mobile = "Please enter mobile number";
    if (!vendorData.email.trim()) newErrors.email = "Please enter email";
    if (!vendorData.gst.trim()) newErrors.gst = "Please enter GST number";
    if (!vendorData.address.trim()) newErrors.address = "Please enter address";
    
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

  const handleDelete = () => {
    setVendors(vendors.filter(vendor => vendor.id !== selectedVendor.id));
    closeModal();
  };

  // Add Vendor Modal
  const AddModal = ({ showAddModal, closeModal }) => {
    const initialForm = {
      vendorName: "",
      mobile: "",
      gst: "",
      address: "",
      status: 1,
      contactPerson: "",
      email: "",
      paymentTerms: "Net 30",
    };

    const [newVendor, setNewVendor] = useState(initialForm);
    const [errors, setErrors] = useState({});

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
      if (!vendorData.vendorName.trim()) newErrors.vendorName = "Please enter vendor name";
      if (!vendorData.contactPerson.trim()) newErrors.contactPerson = "Please enter contact person";
      if (!vendorData.mobile.trim()) newErrors.mobile = "Please enter mobile number";
      if (!vendorData.email.trim()) newErrors.email = "Please enter email";
      if (!vendorData.gst.trim()) newErrors.gst = "Please enter GST number";
      if (!vendorData.address.trim()) newErrors.address = "Please enter address";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddVendor = () => {
      if (!validateForm(newVendor)) return;
      
      const newId = vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1;
      setVendors([...vendors, {...newVendor, id: newId}]);
      closeModal();
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
                      value={newVendor.vendorName}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, vendorName: e.target.value })
                      }
                      isInvalid={!!errors.vendorName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.vendorName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter mobile number"
                      value={newVendor.mobile}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, mobile: e.target.value })
                      }
                      isInvalid={!!errors.mobile}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter GST number"
                      value={newVendor.gst}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, gst: e.target.value })
                      }
                      isInvalid={!!errors.gst}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gst}
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
                      value={newVendor.contactPerson}
                      onChange={(e) =>
                        setNewVendor({
                          ...newVendor,
                          contactPerson: e.target.value,
                        })
                      }
                      isInvalid={!!errors.contactPerson}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactPerson}
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
                      value={newVendor.paymentTerms}
                      onChange={(e) =>
                        setNewVendor({
                          ...newVendor,
                          paymentTerms: e.target.value,
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
            >
              Save Vendor
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Vendor Modal
  const EditModal = ({ selectedVendor, showEditModal, closeModal }) => {
    const initialForm = selectedVendor || {
      vendorName: "",
      mobile: "",
      gst: "",
      address: "",
      status: 1,
      contactPerson: "",
      email: "",
      paymentTerms: "Net 30",
    };

    const [editVendor, setEditVendor] = useState(initialForm);
    const [errors, setErrors] = useState({});

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
      if (!vendorData.vendorName.trim()) newErrors.vendorName = "Please enter vendor name";
      if (!vendorData.contactPerson.trim()) newErrors.contactPerson = "Please enter contact person";
      if (!vendorData.mobile.trim()) newErrors.mobile = "Please enter mobile number";
      if (!vendorData.email.trim()) newErrors.email = "Please enter email";
      if (!vendorData.gst.trim()) newErrors.gst = "Please enter GST number";
      if (!vendorData.address.trim()) newErrors.address = "Please enter address";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateVendor = () => {
      if (!validateForm(editVendor)) return;
      
      setVendors(vendors.map(v => 
        v.id === editVendor.id ? editVendor : v
      ));
      closeModal();
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
                      value={editVendor.vendorName}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, vendorName: e.target.value })
                      }
                      isInvalid={!!errors.vendorName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.vendorName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter mobile number"
                      value={editVendor.mobile}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, mobile: e.target.value })
                      }
                      isInvalid={!!errors.mobile}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter GST number"
                      value={editVendor.gst}
                      onChange={(e) =>
                        setEditVendor({ ...editVendor, gst: e.target.value })
                      }
                      isInvalid={!!errors.gst}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gst}
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
                      value={editVendor.contactPerson}
                      onChange={(e) =>
                        setEditVendor({
                          ...editVendor,
                          contactPerson: e.target.value,
                        })
                      }
                      isInvalid={!!errors.contactPerson}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactPerson}
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
                      value={editVendor.paymentTerms}
                      onChange={(e) =>
                        setEditVendor({
                          ...editVendor,
                          paymentTerms: e.target.value,
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
            >
              Update Vendor
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedVendor, showDeleteModal, closeModal, handleDelete }) => {
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
            <p>Are you sure you want to delete vendor <strong>{selectedVendor?.vendorName}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
              Delete Vendor
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
                    <tr key={vendor.id}>
                      <th>{vendor.id}</th>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={index % 2 === 0 ? avatar1 : avatar2}
                            className="rounded-lg me-2"
                            width="24"
                            alt=""
                          />
                          <span className="s-w-space-no">{vendor.vendorName}</span>
                        </div>
                      </td>
                      <td>{vendor.contactPerson}</td>
                      <td>{vendor.mobile}</td>
                      <td>{vendor.email}</td>
                      <td>{vendor.gst}</td>
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
                        No vendors found {searchTerm ? `matching "${searchTerm}"` : ''}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
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