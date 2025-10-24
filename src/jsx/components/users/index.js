import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import axios from "axios";

const UserMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(`${API_BASE_URL}/authRoutes/get`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.data || []);
      setApiError("");
    } catch (error) {
      console.error("Error fetching users:", error);
      setApiError(error.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
const filteredUsers = useMemo(() => {
  if (!Array.isArray(users)) return [];
  if (!searchTerm) return users;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return users.filter(user => 
    (user.full_name?.toLowerCase() || '').includes(lowerSearchTerm) ||
    (user.email?.toLowerCase() || '').includes(lowerSearchTerm) ||
    (String(user.mobile_number || '').toLowerCase()).includes(lowerSearchTerm) ||
    (user.role?.toLowerCase() || '').includes(lowerSearchTerm)
  );
}, [users, searchTerm]);

  const validateForm = (userData, isEdit = false) => {
    const newErrors = {};
    
    if (!userData.full_name?.trim()) newErrors.full_name = "Please enter full name";
    if (!userData.email?.trim()) newErrors.email = "Please enter email";
    if (!userData.mobile_number?.trim()) newErrors.mobile_number = "Please enter mobile number";
    
    // Only validate password for new users
    if (!isEdit && !userData.password?.trim()) {
      newErrors.password = "Please enter password";
    }
    
    // Email validation
    if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Mobile validation (basic)
    if (userData.mobile_number && !/^\d{10,}$/.test(userData.mobile_number.replace(/\D/g, ''))) {
      newErrors.mobile_number = "Please enter a valid mobile number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (user) => {
    setSelectedUser({...user});
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedUser(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      await axios.delete(`${API_BASE_URL}/authRoutes/delete/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      setApiError(error.response?.data?.error || "Failed to delete user");
    }
  };

  // Add User Modal
  const AddModal = ({ showAddModal, closeModal }) => {
    const initialForm = {
      full_name: "",
      email: "",
      password: "",
      mobile_number: "",
      role: "user",
      status: 1,
    };

    const [newUser, setNewUser] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (showAddModal) {
        setNewUser(initialForm);
        setErrors({});
      }
    }, [showAddModal]);

    const handleReset = () => {
      setNewUser(initialForm);
      setErrors({});
    };

    const validateForm = (userData) => {
      const newErrors = {};
      
      if (!userData.full_name?.trim()) newErrors.full_name = "Please enter full name";
      if (!userData.email?.trim()) newErrors.email = "Please enter email";
      if (!userData.mobile_number?.trim()) newErrors.mobile_number = "Please enter mobile number";
      if (!userData.password?.trim()) newErrors.password = "Please enter password";
      
      // Email validation
      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      // Mobile validation (basic)
      if (userData.mobile_number && !/^\d{10,}$/.test(userData.mobile_number.replace(/\D/g, ''))) {
        newErrors.mobile_number = "Please enter a valid mobile number";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddUser = async () => {
      if (!validateForm(newUser)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("authtoken");
        const response = await axios.post(`${API_BASE_URL}/authRoutes/post`, newUser, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Add the new user to the list with the ID from the response
        setUsers([...users, {...newUser, id: response.data.id}]);
        setSuccessMessage("User added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error adding user:", error);
        setApiError(error.response?.data?.error || "Failed to add user");
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
            <h2 className="thaniya-normal-title">Add User</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={6}>
                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter full name"
                      value={newUser.full_name}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          full_name: e.target.value,
                        })
                      }
                      isInvalid={!!errors.full_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.full_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="form-control-lg"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          email: e.target.value,
                        })
                      }
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Mobile Number */}
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter mobile number"
                      value={newUser.mobile_number}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          mobile_number: e.target.value,
                        })
                      }
                      isInvalid={!!errors.mobile_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control-lg"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          password: e.target.value,
                        })
                      }
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Role */}
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Status */}
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={newUser.status}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          status: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Form.Select>
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
              onClick={handleAddUser}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Save User"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit User Modal
  const EditModal = ({ selectedUser, showEditModal, closeModal }) => {
    const initialForm = selectedUser || {
      full_name: "",
      email: "",
      password: "",
      mobile_number: "",
      role: "user",
      status: 1,
    };

    const [editUser, setEditUser] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (selectedUser) {
        setEditUser({
          ...selectedUser,
          password: "" // Don't pre-fill password for security
        });
      }
    }, [selectedUser]);

    const handleReset = () => {
      setEditUser(initialForm);
      setErrors({});
    };

    const validateForm = (userData) => {
      const newErrors = {};
      
      if (!userData.full_name?.trim()) newErrors.full_name = "Please enter full name";
      if (!userData.email?.trim()) newErrors.email = "Please enter email";
      if (!userData.mobile_number?.trim()) newErrors.mobile_number = "Please enter mobile number";
      
      // Email validation
      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      // Mobile validation (basic)
      if (userData.mobile_number && !/^\d{10,}$/.test(userData.mobile_number.replace(/\D/g, ''))) {
        newErrors.mobile_number = "Please enter a valid mobile number";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateUser = async () => {
      if (!validateForm(editUser)) return;
      
      try {
        setSubmitting(true);
        const token = localStorage.getItem("authtoken");
        
        // Create update data - only include password if it's provided
        const updateData = {
          full_name: editUser.full_name,
          email: editUser.email,
          mobile_number: editUser.mobile_number,
          role: editUser.role,
          status: editUser.status
        };
        
        // Only include password if it's not empty
        if (editUser.password.trim()) {
          updateData.password = editUser.password;
        }
        
        await axios.put(`${API_BASE_URL}/authRoutes/update/${editUser.id}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUsers(users.map(u => 
          u.id === editUser.id ? {...editUser, password: undefined} : u
        ));
        setSuccessMessage("User updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        closeModal();
      } catch (error) {
        console.error("Error updating user:", error);
        setApiError(error.response?.data?.error || "Failed to update user");
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
            <h2 className="thaniya-normal-title">Edit User</h2>
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
                      value={editUser.full_name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, full_name: e.target.value })
                      }
                      isInvalid={!!errors.full_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.full_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="form-control-lg"
                      placeholder="Enter email address"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
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
                      value={editUser.mobile_number}
                      onChange={(e) =>
                        setEditUser({ ...editUser, mobile_number: e.target.value })
                      }
                      isInvalid={!!errors.mobile_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control-lg"
                      placeholder="Leave blank to keep current password"
                      value={editUser.password}
                      onChange={(e) =>
                        setEditUser({ ...editUser, password: e.target.value })
                      }
                    />
                    <Form.Text className="text-muted">
                      Leave blank if you don't want to change the password
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={editUser.status}
                      onChange={(e) =>
                        setEditUser({ ...editUser, status: parseInt(e.target.value) })
                      }
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Form.Select>
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
              onClick={handleUpdateUser}
              className="s-btn s-btn-grad-danger"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : "Update User"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedUser, showDeleteModal, closeModal, handleDelete }) => {
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
            <p>Are you sure you want to delete user <strong>{selectedUser?.full_name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={handleClose} className="s-btn s-btn-light">
              Cancel
            </button>
            <button onClick={handleDeleteClick} className="s-btn s-btn-grad-danger" disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : "Delete User"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <PageTitle activeMenu="Users" motherMenu="Masters" pageContent="Users List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>User Management</Card.Title>
              </div>
              <InputGroup className="me-3" style={{ width: '300px' }}>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center">
                <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                  + Add User
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
                  <p className="mt-2">Loading users...</p>
                </div>
              ) : (
                <Table responsive className="s-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Mobile Number</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id}>
                        <th>{index + 1}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={index % 2 === 0 ? avatar1 : avatar2}
                              className="rounded-lg me-2"
                              width="24"
                              alt=""
                            />
                            <span className="s-w-space-no">{user.full_name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.mobile_number}</td>
                        <td>
                          <Badge 
                            bg={user.role === 'admin' ? 'primary' : 'secondary'}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <Badge 
                            bg={user.status === 1 ? 'success' : 'danger'}
                          >
                            {user.status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button 
                              onClick={() => openEditModal(user)}
                              className="btn btn-custom-blue shadow btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>

                            <button 
                              onClick={() => openDeleteModal(user)}
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
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
        selectedUser={selectedUser} 
        showEditModal={showEditModal} 
        closeModal={closeModal} 
      />
      <DeleteModal 
        selectedUser={selectedUser} 
        showDeleteModal={showDeleteModal} 
        closeModal={closeModal} 
        handleDelete={handleDelete}
      />
    </Fragment>
  );
};

export default UserMaster;