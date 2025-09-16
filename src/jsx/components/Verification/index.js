import React, { Fragment, useState, useMemo } from "react";
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
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import verificationData from "../../../../src/jsx/components/data/data.json";

const Verification = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [newVerification, setNewVerification] = useState({
    employeeId: "",
    aadharNumber: "",
    panNumber: "",
    passportNo: "",
    verificationDate: "",
    verifiedBy: "",
    status: 1,
  });

  const [verifications, setVerifications] = useState(
    verificationData["verifications"].map((item, index) => ({
      id: index + 1,
      employee_id: item.employeeId,
      aadhar_number: item.aadharNumber,
      pan_number: item.panNumber,
      passport_no: item.passportNo,
      verification_date: item.verificationDate,
      verified_by: item.verifiedBy,
      status: item.status === 1 ? 1 : 0,
    }))
  );

  // Filter verifications based on search term
  const filteredVerifications = useMemo(() => {
    if (!searchTerm) return verifications;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return verifications.filter(verification => 
      verification.employee_id.toString().includes(lowerSearchTerm) ||
      verification.aadhar_number.toString().includes(lowerSearchTerm) ||
      verification.pan_number.toLowerCase().includes(lowerSearchTerm) ||
      (verification.passport_no && verification.passport_no.toLowerCase().includes(lowerSearchTerm)) ||
      verification.verification_date.toLowerCase().includes(lowerSearchTerm) ||
      verification.verified_by.toLowerCase().includes(lowerSearchTerm) ||
      (verification.status === 1 ? "verified" : "pending").includes(lowerSearchTerm)
    );
  }, [verifications, searchTerm]);

  const validateForm = (verificationData) => {
    const newErrors = {};
    if (!verificationData.employeeId)
      newErrors.employeeId = "Please enter employee ID";
    if (!verificationData.aadharNumber)
      newErrors.aadharNumber = "Please enter Aadhar number";
    if (!verificationData.panNumber)
      newErrors.panNumber = "Please enter PAN number";
    if (!verificationData.verificationDate)
      newErrors.verificationDate = "Please select verification date";
    if (!verificationData.verifiedBy)
      newErrors.verifiedBy = "Please enter verified by";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewVerification({
      employeeId: "",
      aadharNumber: "",
      panNumber: "",
      passportNo: "",
      verificationDate: "",
      verifiedBy: "",
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

  const handleDelete = () => {
    setVerifications(
      verifications.filter(
        (verification) => verification.id !== selectedVerification.id
      )
    );
    closeModal();
  };

  const handleAddVerification = () => {
    if (!validateForm(newVerification)) return;

    const newId =
      verifications.length > 0
        ? Math.max(...verifications.map((v) => v.id)) + 1
        : 1;
    setVerifications([...verifications, { ...newVerification, id: newId }]);
    closeModal();
  };

  const handleUpdateVerification = () => {
    if (!validateForm(selectedVerification)) return;

    setVerifications(
      verifications.map((v) =>
        v.id === selectedVerification.id ? selectedVerification : v
      )
    );
    closeModal();
  };

  // Add Verification Modal
 const AddModal = () => {
  const initialForm = {
    employeeId: "",
    aadharNumber: "",
    panNumber: "",
    passportNo: "",
    verificationDate: "",
    verifiedBy: "",
    status: 1,
  };

  const [newVerification, setNewVerification] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleReset = () => {
    setNewVerification(initialForm);
    setErrors({});
  };

  const handleAddVerification = () => {
    // ✅ your validation and save API call logic here
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
                    value={newVerification.employeeId}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        employeeId: e.target.value,
                      })
                    }
                    isInvalid={!!errors.employeeId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employeeId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-lg"
                    placeholder="Enter Aadhar number"
                    value={newVerification.aadharNumber}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        aadharNumber: e.target.value,
                      })
                    }
                    isInvalid={!!errors.aadharNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.aadharNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter PAN number"
                    value={newVerification.panNumber}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        panNumber: e.target.value,
                      })
                    }
                    isInvalid={!!errors.panNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.panNumber}
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
                    value={newVerification.passportNo}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        passportNo: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verification Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-lg"
                    value={newVerification.verificationDate}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        verificationDate: e.target.value,
                      })
                    }
                    isInvalid={!!errors.verificationDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verificationDate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verified By</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter verified by"
                    value={newVerification.verifiedBy}
                    onChange={(e) =>
                      setNewVerification({
                        ...newVerification,
                        verifiedBy: e.target.value,
                      })
                    }
                    isInvalid={!!errors.verifiedBy}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verifiedBy}
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
          >
            Save Verification
          </button>
        </div>
      </div>
    </div>
  );
};


  // Edit Verification Modal
  const EditModal = () => (
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
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Verification</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
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
                    value={selectedVerification?.employeeId || ""}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
                        employeeId: e.target.value,
                      })
                    }
                    isInvalid={!!errors.employeeId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employeeId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-lg"
                    placeholder="Enter Aadhar number"
                    value={selectedVerification?.aadharNumber || ""}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
                        aadharNumber: e.target.value,
                      })
                    }
                    isInvalid={!!errors.aadharNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.aadharNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter PAN number"
                    value={selectedVerification?.panNumber || ""}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
                        panNumber: e.target.value,
                      })
                    }
                    isInvalid={!!errors.panNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.panNumber}
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
                    value={selectedVerification?.passportNo || ""}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
                        passportNo: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verification Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-lg"
                    value={selectedVerification?.verificationDate || ""}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
                        verificationDate: e.target.value,
                      })
                    }
                    isInvalid={!!errors.verificationDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verificationDate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verified By</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter verified by"
                    value={selectedVerification?.verifiedBy || ""}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
                        verifiedBy: e.target.value,
                      })
                    }
                    isInvalid={!!errors.verifiedBy}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verifiedBy}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={selectedVerification?.status || 1}
                    onChange={(e) =>
                      setSelectedVerification({
                        ...selectedVerification,
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
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button
            onClick={handleUpdateVerification}
            className="s-btn s-btn-grad-danger"
          >
            Update Verification
          </button>
        </div>
      </div>
    </div>
  );

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
            <strong>{selectedVerification?.employeeId}</strong>?
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
                        <td>{verification.aadhar_number}</td>
                        <td>{verification.pan_number}</td>
                        <td>{verification.passport_no || "N/A"}</td>
                        <td>{verification.verification_date}</td>
                        <td>{verification.verified_by}</td>
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

export default Verification;