import React, { Fragment, useState, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json";

const EmployeeMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    full_name: "",
    designation: "",
    department: "",
    mobile_number: "",
    email: "",
    joining_date: "",
    status: 1
  });
  const initialEmployee = {
    full_name: "",
    designation: "",
    department: "",
    mobile_number: "",
    email: "",
    joining_date: "",
    status: 1,
  };

  const [employees, setEmployees] = useState(
    Data["employees"]?.map((item, index) => ({
      id: index + 1,
      full_name: item.full_name,
      designation: item.designation,
      department: item.department,
      mobile_number: item.mobile_number,
      email: item.email,
      joining_date: item.joining_date,
      status: item.status === 1 ? 1 : 0
    })) || []
  );

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return employees.filter(employee => 
      employee.full_name.toLowerCase().includes(lowerSearchTerm) ||
      employee.designation.toLowerCase().includes(lowerSearchTerm) ||
      employee.department.toLowerCase().includes(lowerSearchTerm) ||
      employee.mobile_number.toLowerCase().includes(lowerSearchTerm) ||
      employee.email.toLowerCase().includes(lowerSearchTerm) ||
      employee.joining_date.toLowerCase().includes(lowerSearchTerm) ||
      (employee.status === 1 ? "active" : "inactive").includes(lowerSearchTerm)
    );
  }, [employees, searchTerm]);

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

  const openAddModal = () => {
    setNewEmployee({
      full_name: "",
      designation: "",
      department: "",
      mobile_number: "",
      email: "",
      joining_date: "",
      status: 1
    });
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee({...employee});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
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
    }, 300);
  };

  const handleDelete = () => {
    setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    closeModal();
  };

  const handleAddEmployee = () => {
    if (!validateForm(newEmployee)) return;
    
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees([...employees, {...newEmployee, id: newId}]);
    closeModal();
  };

  const handleUpdateEmployee = () => {
    if (!validateForm(selectedEmployee)) return;
    
    setEmployees(employees.map(e => 
      e.id === selectedEmployee.id ? selectedEmployee : e
    ));
    closeModal();
  };

  // Add Employee Modal
  const AddModal = () => {
    const [newEmployee, setNewEmployee] = useState(initialEmployee);
    const [errors, setErrors] = useState({});

    const handleReset = () => {
      setNewEmployee(initialEmployee);
      setErrors({});
    };

    const handleClose = () => {
      handleReset();
      closeModal();
    };

    const handleAddEmployee = () => {
      // ✅ validate and submit
      // if success:
      handleReset();
      closeModal();
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`}   style={{ maxWidth: "900px", width: "90%" }} >
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
                      onChange={(e) => setNewEmployee({ ...newEmployee, status: parseInt(e.target.value) })}
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
            <button onClick={handleAddEmployee} className="s-btn s-btn-grad-danger">
              Save Employee
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Employee Modal
  const EditModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`} style={{ maxWidth: "900px", width: "90%" }}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Employee</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
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
                    type="text" 
                    className="form-control-lg"
                    placeholder="Enter full name"
                    value={selectedEmployee?.full_name || ''}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, full_name: e.target.value})}
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
                    value={selectedEmployee?.designation || ''}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, designation: e.target.value})}
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
                    value={selectedEmployee?.department || ''}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, department: e.target.value})}
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
                    value={selectedEmployee?.mobile_number || ''}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, mobile_number: e.target.value})}
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
                    value={selectedEmployee?.email || ''}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
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
                    value={selectedEmployee?.joining_date || ''}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, joining_date: e.target.value})}
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
                    value={selectedEmployee?.status || 1}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, status: parseInt(e.target.value)})}
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
          <button onClick={handleUpdateEmployee} className="s-btn s-btn-grad-danger">
            Update Employee
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
          <p>Are you sure you want to delete employee <strong>{selectedEmployee?.full_name}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );

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
                    <Search size={16} />
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
                        <th>{employee.id}</th>
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
                        <td>{employee.designation}</td>
                        <td>{employee.department}</td>
                        <td>{employee.mobile_number}</td>
                        <td>{employee.email}</td>
                        <td>{employee.joining_date}</td>
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

export default EmployeeMaster;