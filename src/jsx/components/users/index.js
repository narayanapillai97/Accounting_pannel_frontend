import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Table, Card, Row, Col, Button, Form, Badge, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import { X, Search } from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json"; 

const UserMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    mobile_number: "",
    role: "user",
    status: 1
  });
  
  const [users, setUsers] = useState(
    Data["users"].map((item, index) => ({
      id: index + 1,
      full_name: item.full_name,
      email: item.email,
      password: item.password,
      mobile_number: item.mobile_number,
      role: item.role,
      status: item.status === 1 ? 1 : 0,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))
  );

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user => 
      user.full_name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      user.mobile_number.includes(lowerSearchTerm) ||
      user.role.toLowerCase().includes(lowerSearchTerm)
    );
  }, [users, searchTerm]);

  const validateForm = (userData) => {
    const newErrors = {};
    if (!userData.full_name.trim()) newErrors.full_name = "Please enter full name";
    if (!userData.email.trim()) newErrors.email = "Please enter email";
    if (!userData.mobile_number.trim()) newErrors.mobile_number = "Please enter mobile number";
    if (!userData.password.trim() && !selectedUser) newErrors.password = "Please enter password";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewUser({
      full_name: "",
      email: "",
      password: "",
      mobile_number: "",
      role: "user",
      status: 1
    });
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

  const handleDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    closeModal();
  };

  const handleAddUser = () => {
    if (!validateForm(newUser)) return;
    
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setUsers([...users, {
      ...newUser,
      id: newId,
      created_at: currentDate,
      updated_at: currentDate
    }]);
    closeModal();
  };

  const handleUpdateUser = () => {
    if (!validateForm(selectedUser)) return;
    
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setUsers(users.map(u => 
      u.id === selectedUser.id ? {...selectedUser, updated_at: currentDate} : u
    ));
    closeModal();
  };

  // Add User Modal
  const AddModal = () => {
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

    const handleReset = () => {
      setNewUser(initialForm);
      setErrors({});
    };

    const handleAddUser = () => {
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
          style={{ maxWidth: "900px", width: "90%" }}
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
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter full name"
                      value={newUser.full_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, full_name: e.target.value })
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
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control-lg"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
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
                      value={newUser.mobile_number}
                      onChange={(e) =>
                        setNewUser({ ...newUser, mobile_number: e.target.value })
                      }
                      isInvalid={!!errors.mobile_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.mobile_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
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
              onClick={handleAddUser}
              className="s-btn s-btn-grad-danger"
            >
              Save User
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit User Modal
  const EditModal = ({ selectedUser, closeModal }) => {
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

    useEffect(() => {
      if (selectedUser) {
        setEditUser(selectedUser);
      }
    }, [selectedUser]);

    const handleReset = () => {
      setEditUser(initialForm);
      setErrors({});
    };

    const handleClose = () => {
      handleReset();
      closeModal();
    };

    const handleUpdateUser = () => {
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
                      placeholder="Enter email"
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

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control-lg"
                      placeholder="Leave blank to keep current"
                      onChange={(e) =>
                        setEditUser({ ...editUser, password: e.target.value })
                      }
                    />
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
                    <Form.Label>Role</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <select
                      className="form-control form-control-lg"
                      value={editUser.status}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
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
              onClick={handleUpdateUser}
              className="s-btn s-btn-grad-danger"
            >
              Update User
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
          <p>Are you sure you want to delete user <strong>{selectedUser?.full_name}</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeModal} className="s-btn s-btn-light">
            Cancel
          </button>
          <button onClick={handleDelete} className="s-btn s-btn-grad-danger">
            Delete User
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <PageTitle activeMenu="User Master" motherMenu="Masters" pageContent="User Master List" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>User Master</Card.Title>
              </div>
                 <div className="mb-3 d-flex justify-content-end">
                <div style={{ width: "300px" }}>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search users..."
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
              </div>
              <Button className="s-btn s-btn-grad-danger" onClick={openAddModal}>
                + Add User
              </Button>
            </Card.Header>

            <div className="s-card-body">
              <Table responsive className="s-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id}>
                        <th>{user.id}</th>
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
                          <Badge variant={user.role === "admin" ? "primary light" : "secondary light"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant={user.status === 1 ? "success light" : "danger light"}>
                            {user.status === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        {searchTerm ? "No users match your search" : "No users found"}
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
      {showEditModal && <EditModal selectedUser={selectedUser} closeModal={closeModal} />}
      {showDeleteModal && <DeleteModal />}
    </Fragment>
  );
};

export default UserMaster;