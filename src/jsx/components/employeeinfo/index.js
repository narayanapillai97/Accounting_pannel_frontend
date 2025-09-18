import React, { Fragment, useState, useMemo, useEffect, useRef } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, InputGroup, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

const EmployeeMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Refs for focus management
  const firstNameRef = useRef(null);
  const editFirstNameRef = useRef(null);

  // Initial employee state
  const initialEmployee = {
    full_name: "",
    designation: "",
    department: "",
    mobile_number: "",
    email: "",
    joining_date: "",
    status: 1
  };
  
  const [newEmployee, setNewEmployee] = useState(initialEmployee);

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/employee/get`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching employees:", error);
      setApiError(error.response?.data?.error || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return employees.filter(employee => 
      employee.full_name?.toLowerCase().includes(lowerSearchTerm) ||
      employee.designation?.toLowerCase().includes(lowerSearchTerm) ||
      employee.department?.toLowerCase().includes(lowerSearchTerm) ||
      employee.mobile_number?.toLowerCase().includes(lowerSearchTerm) ||
      employee.email?.toLowerCase().includes(lowerSearchTerm) ||
      employee.joining_date?.toLowerCase().includes(lowerSearchTerm) ||
      (employee.status === 1 ? "active" : "inactive").includes(lowerSearchTerm)
    );
  }, [employees, searchTerm]);

  const validateForm = (employeeData) => {
    const newErrors = {};
    if (!employeeData.full_name?.trim()) newErrors.full_name = "Please enter full name";
    if (!employeeData.designation?.trim()) newErrors.designation = "Please enter designation";
    if (!employeeData.department?.trim()) newErrors.department = "Please enter department";
    if (!employeeData.mobile_number?.trim()) newErrors.mobile_number = "Please enter mobile number";
    if (!employeeData.email?.trim()) newErrors.email = "Please enter email";
    if (!employeeData.joining_date?.trim()) newErrors.joining_date = "Please select joining date";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openAddModal = () => {
    setNewEmployee(initialEmployee);
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => {
      setIsAnimating(true);
      // Focus on the first input field after animation completes
      setTimeout(() => {
        if (firstNameRef.current) {
          firstNameRef.current.focus();
        }
      }, 100);
    }, 10);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee({...employee});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => {
      setIsAnimating(true);
      // Focus on the first input field after animation completes
      setTimeout(() => {
        if (editFirstNameRef.current) {
          editFirstNameRef.current.focus();
        }
      }, 100);
    }, 10);
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      setErrors({});
      setSubmitting(false);
      setDeleting(false);
    }, 300);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/employee/delete/${selectedEmployee.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      showSuccessMessage("Employee deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setApiError(error.response?.data?.error || "Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!validateForm(newEmployee)) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/employee/post`, newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add the new employee to the list with the ID from the response
      setEmployees([...employees, {...newEmployee, id: response.data.employeeId}]);
      showSuccessMessage("Employee added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding employee:", error);
      setApiError(error.response?.data?.error || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!validateForm(selectedEmployee)) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/employee/update/${selectedEmployee.id}`, selectedEmployee, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? selectedEmployee : emp
      ));
      showSuccessMessage("Employee updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating employee:", error);
      setApiError(error.response?.data?.error || "Failed to update employee");
    } finally {
      setSubmitting(false);
    }
  };

  // Add Employee Modal
// Add Employee Modal
const AddModal = ({ showAddModal, closeModal }) => {
  const initialEmployee = {
    full_name: "",
    designation: "",
    department: "",
    mobile_number: "",
    email: "",
    joining_date: "",
    status: 1,
  };

  const [newEmployee, setNewEmployee] = useState(initialEmployee);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const firstNameRef = useRef(null);

  useEffect(() => {
    if (showAddModal) {
      setNewEmployee(initialEmployee);
      setErrors({});
      setApiError("");
      setSuccessMessage("");
    }
  }, [showAddModal]);

  const handleReset = () => {
    setNewEmployee(initialEmployee);
    setErrors({});
    setTimeout(() => {
      if (firstNameRef.current) {
        firstNameRef.current.focus();
      }
    }, 100);
  };

  const validateForm = (employeeData) => {
    const newErrors = {};
    if (!employeeData.full_name.trim()) newErrors.full_name = "Please enter full name";
    if (!employeeData.designation.trim()) newErrors.designation = "Please enter designation";
    if (!employeeData.department.trim()) newErrors.department = "Please enter department";
    if (!employeeData.mobile_number.trim()) newErrors.mobile_number = "Please enter mobile number";
    if (!employeeData.email.trim()) newErrors.email = "Please enter email";
    if (!employeeData.joining_date.trim()) newErrors.joining_date = "Please select joining date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateForm(newEmployee)) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/employeemaster/post`, newEmployee, {
        headers: { Authorization: token },
      });

      // Add employee to list (adjust based on your state management)
      setEmployees([...employees, { ...newEmployee, employee_id: response.data.employeeId }]);
      setSuccessMessage("Employee added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error adding employee:", error);
      setApiError(error.response?.data?.error || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
  };

  if (!showAddModal) return null;

  return (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={handleClose}></div>
      <div
        className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`}
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Add Employee</h2>
          <button onClick={handleClose} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>

        <div className="thaniya-normal-body">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    ref={firstNameRef}
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter full name"
                    value={newEmployee.full_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
                    isInvalid={!!errors.full_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.full_name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter designation"
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                    isInvalid={!!errors.designation}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.designation}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    isInvalid={!!errors.department}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.department}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter mobile number"
                    value={newEmployee.mobile_number}
                    onChange={(e) => setNewEmployee({ ...newEmployee, mobile_number: e.target.value })}
                    isInvalid={!!errors.mobile_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile_number}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="form-control-lg"
                    placeholder="Enter email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-lg"
                    value={newEmployee.joining_date}
                    onChange={(e) => setNewEmployee({ ...newEmployee, joining_date: e.target.value })}
                    isInvalid={!!errors.joining_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.joining_date}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={newEmployee.status}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, status: parseInt(e.target.value) })
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
            onClick={handleAddEmployee}
            className="s-btn s-btn-grad-danger"
            disabled={submitting}
          >
            {submitting ? <Spinner animation="border" size="sm" /> : "Save Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};


  // Edit Employee Modal
const EditModal = ({
  showEditModal,
  closeModal,
  isAnimating,
  selectedEmployee,
  setEmployees,
  employees,
}) => {
  const initialForm = selectedEmployee || {
    full_name: "",
    mobile_number: "",
    email: "",
    designation: "",
    department: "",
    joining_date: "",
    address: "",
    status: 1,
  };

  const [editEmployee, setEditEmployee] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (selectedEmployee) {
      setEditEmployee(selectedEmployee);
      setErrors({});
    }
  }, [selectedEmployee]);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.full_name.trim())
      newErrors.full_name = "Please enter full name";
    if (!data.mobile_number.trim())
      newErrors.mobile_number = "Please enter mobile number";
    if (!data.email.trim()) newErrors.email = "Please enter email";
    if (!data.joining_date.trim())
      newErrors.joining_date = "Please select joining date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEmployee = async () => {
    if (!validateForm(editEmployee)) return;

    try {
      setSubmitting(true);
      setApiError("");
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/employeemaster/update/${editEmployee.employee_id}`,
        editEmployee,
        { headers: { Authorization: token } }
      );

      const updated = employees.map((emp) =>
        emp.employee_id === editEmployee.employee_id ? editEmployee : emp
      );
      setEmployees(updated);

      setSuccessMessage("Employee updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error updating employee:", error);
      setApiError(error.response?.data?.error || "Failed to update employee");
    } finally {
      setSubmitting(false);
    }
  };

  if (!showEditModal) return null;

  return (
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
          <h2 className="thaniya-normal-title">Edit Employee</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>

        <div className="thaniya-normal-body">
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter full name"
                    value={editEmployee.full_name}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        full_name: e.target.value,
                      })
                    }
                    isInvalid={!!errors.full_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.full_name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter mobile number"
                    value={editEmployee.mobile_number}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        mobile_number: e.target.value,
                      })
                    }
                    isInvalid={!!errors.mobile_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile_number}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="form-control-lg"
                    placeholder="Enter email"
                    value={editEmployee.email}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        email: e.target.value,
                      })
                    }
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter designation"
                    value={editEmployee.designation}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        designation: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter department"
                    value={editEmployee.department}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        department: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-lg"
                    value={editEmployee.joining_date}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        joining_date: e.target.value,
                      })
                    }
                    isInvalid={!!errors.joining_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.joining_date}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="form-control-lg"
                    placeholder="Enter address"
                    value={editEmployee.address}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        address: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    value={editEmployee.status}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
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
            onClick={handleUpdateEmployee}
            className="s-btn s-btn-grad-danger"
            disabled={submitting}
          >
            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Employee"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


  // Delete Confirmation Modal
  const DeleteModal = () => {
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
            <p>Are you sure you want to delete employee <strong>{selectedEmployee?.full_name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDelete} className="s-btn s-btn-grad-danger" disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : "Delete Employee"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Employee Master" motherMenu="Masters" pageContent="Employee Master List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Employee Master</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center"> 
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add Employee
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
                  <p className="mt-2">Loading employees...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Full Name</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Joining Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee, index) => (
                        <tr key={employee.id}>
                          <th>{index + 1}</th>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={index % 2 === 0 ? avatar1 : avatar2}
                                className="rounded-lg me-2"
                                width="24"
                                alt=""
                              />
                              <span className="s-w-space-no">{employee.full_name}</span>
                            </div>
                          </td>
                          <td>{employee.designation || "N/A"}</td>
                          <td>{employee.department || "N/A"}</td>
                          <td>{employee.mobile_number}</td>
                          <td>{employee.email}</td>
                          <td>{employee.joining_date || "N/A"}</td>
                          <td>
                            <Badge variant={employee.status === 1 ? "success light" : "danger light"}>
                              {employee.status === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex">
                              <button 
                                onClick={() => openEditModal(employee)}
                                className="btn btn-custom-blue shadow btn-xs sharp me-1"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </button>
                              <button 
                                onClick={() => openDeleteModal(employee)}
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
                          {searchTerm ? 'No employees found matching your search.' : 'No employees available.'}
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

     <AddModal 
  showAddModal={showAddModal} 
  closeModal={closeModal} 
  isAnimating={isAnimating} 
  setEmployees={setEmployees} 
  employees={employees}
/>

     <EditModal
  showEditModal={showEditModal}
  closeModal={closeModal}
  isAnimating={isAnimating}
  selectedEmployee={selectedEmployee}
  setEmployees={setEmployees}
  employees={employees}
/>
      <DeleteModal />
    </Fragment>
  );
};

export default EmployeeMaster;