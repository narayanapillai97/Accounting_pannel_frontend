import React, { Fragment, useState, useEffect, useMemo } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Form,
  Badge,
  Alert,
  Nav,
  Tab,
  InputGroup,
  Spinner,
  Image
} from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import {
  X,
  Calendar,
  FileText,
  DollarSign,
  CreditCard,
  User,
  Paperclip,
  Eye,
  Download,
  Search,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

const ExpenditureMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] = useState(null);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billData, setBillData] = useState(null);
  const [activeTab, setActiveTab] = useState("records");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenditures, setExpenditures] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [apiError, setApiError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newExpenditure, setNewExpenditure] = useState({
    date: new Date().toISOString().split("T")[0],
    category_id: "",
    subcategory_id: "",
    variant_id: "",
    payee_name: "",
    description: "",
    amount: "",
    payment_mode_id: "",
    bill_id: "",
    status: 1,
    image: null
  });

  // API Calls for Dropdown Data
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${API_BASE_URL}/maincategory/get`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching categories:", error);
      setApiError("Failed to fetch categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${API_BASE_URL}/subcategory/getall`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSubcategories(data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setApiError("Failed to fetch subcategories");
    }
  };

  const fetchVariants = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${API_BASE_URL}/variant/getall`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVariants(data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching variants:", error);
      setApiError("Failed to fetch variants");
    }
  };

  const fetchPaymentModes = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${API_BASE_URL}/paymode/get`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPaymentModes(data);
      setApiError("");
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setApiError("Failed to load payment methods");
    }
  };

  // API Calls for Expenditure Data
  const fetchExpenditures = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authtoken');
      const response = await fetch(`${API_BASE_URL}/expenditure/get`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenditures');
      }
      
      const data = await response.json();
      const expenditureData = Array.isArray(data) ? data : (data.data || []);
      setExpenditures(expenditureData);
    } catch (error) {
      console.error('Error fetching expenditures:', error);
      setApiError('Failed to load expenditure records');
    } finally {
      setLoading(false);
    }
  };

  const addExpenditure = async (expenditureData) => {
    try {
      const token = localStorage.getItem('authtoken');
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(expenditureData).forEach(key => {
        if (key === 'image' && expenditureData[key]) {
          formData.append('image', expenditureData[key]);
        } else if (expenditureData[key] !== null && expenditureData[key] !== undefined) {
          formData.append(key, expenditureData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/expenditure/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expenditure');
      }

      setRefreshTrigger(prev => prev + 1);
      return await response.json();
    } catch (error) {
      console.error('Error adding expenditure:', error);
      throw error;
    }
  };

  const updateExpenditure = async (id, expenditureData) => {
    try {
      const token = localStorage.getItem('authtoken');
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(expenditureData).forEach(key => {
        if (key === 'image' && expenditureData[key]) {
          formData.append('image', expenditureData[key]);
        } else if (expenditureData[key] !== null && expenditureData[key] !== undefined) {
          formData.append(key, expenditureData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/expenditure/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update expenditure');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating expenditure:', error);
      throw error;
    }
  };

  const deleteExpenditure = async (id) => {
    try {
      const token = localStorage.getItem('authtoken');
      const response = await fetch(`${API_BASE_URL}/expenditure/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expenditure');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting expenditure:', error);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchExpenditures(),
        fetchCategories(),
        fetchSubcategories(),
        fetchVariants(),
        fetchPaymentModes()
      ]);
    };

    loadData();
  }, [refreshTrigger]);

  const getCategoryName = (id) => {
    if (!id) return "N/A";
    const category = categories.find((c) => c.id === id);
    return category ? (category.category_name || category.name || "N/A") : "N/A";
  };

  const getPaymentModeName = (id) => {
    if (!id) return "N/A";
    const mode = paymentModes.find((p) => p.id === id);
    return mode ? (mode.payment_method || mode.name || "N/A") : "N/A";
  };

  // Filter expenditure records based on search term
const filteredExpenditures = useMemo(() => {
  if (!searchTerm) return expenditures;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return expenditures.filter(expenditure => {
    // Safely handle all fields that might be null/undefined or non-strings
    const payeeName = String(expenditure.payee_name || '').toLowerCase();
    const description = String(expenditure.description || '').toLowerCase();
    const billId = String(expenditure.bill_id || '').toLowerCase();
    const amount = String(expenditure.amount || '').toLowerCase();
    const date = String(expenditure.date || '').toLowerCase();
    
    // Get category and payment mode names safely
    const category = categories.find(c => c.id === expenditure.category_id);
    const paymentMode = paymentModes.find(p => p.id === expenditure.payment_mode_id);
    
    const categoryName = category ? String(category.category_name || category.name || '').toLowerCase() : '';
    const paymentModeName = paymentMode ? String(paymentMode.payment_method || paymentMode.name || '').toLowerCase() : '';
    
    return (
      payeeName.includes(lowerSearchTerm) ||
      description.includes(lowerSearchTerm) ||
      categoryName.includes(lowerSearchTerm) ||
      paymentModeName.includes(lowerSearchTerm) ||
      amount.includes(lowerSearchTerm) ||
      date.includes(lowerSearchTerm) ||
      billId.includes(lowerSearchTerm)
    );
  });
}, [expenditures, searchTerm, categories, paymentModes]);

  const validateForm = (expenditureData) => {
    const newErrors = {};
    if (!expenditureData.date) newErrors.date = "Please select date";
    if (!expenditureData.category_id)
      newErrors.category_id = "Please select category";
    if (!expenditureData.payee_name?.trim())
      newErrors.payee_name = "Please enter payee name";
    if (!expenditureData.amount || isNaN(expenditureData.amount))
      newErrors.amount = "Please enter valid amount";
    if (!expenditureData.payment_mode_id)
      newErrors.payment_mode_id = "Please select payment mode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewExpenditure({
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      subcategory_id: "",
      variant_id: "",
      payee_name: "",
      description: "",
      amount: "",
      payment_mode_id: "",
      bill_id: "",
      status: 1,
      image: null
    });
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (expenditure) => {
    setSelectedExpenditure({ ...expenditure });
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (expenditure) => {
    setSelectedExpenditure(expenditure);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedExpenditure(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = async () => {
    try {
      await deleteExpenditure(selectedExpenditure.id);
      setExpenditures(expenditures.filter((exp) => exp.id !== selectedExpenditure.id));
      closeModal();
    } catch (error) {
      alert('Failed to delete expenditure record');
    }
  };

  const handleAddExpenditure = async (expenditureData) => {
    if (!validateForm(expenditureData)) return;

    try {
      setUploadingImage(true);
      await addExpenditure(expenditureData);
      closeModal();
    } catch (error) {
      alert(error.message || 'Failed to add expenditure record');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateExpenditure = async () => {
    if (!validateForm(selectedExpenditure)) return;

    try {
      setUploadingImage(true);
      await updateExpenditure(selectedExpenditure.id, selectedExpenditure);
      setRefreshTrigger(prev => prev + 1);
      closeModal();
    } catch (error) {
      alert(error.message || 'Failed to update expenditure record');
    } finally {
      setUploadingImage(false);
    }
  };

  const openBillModal = (expenditure) => {
    setBillData(expenditure);
    setShowBillModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeBillModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowBillModal(false);
      setBillData(null);
    }, 300);
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      if (isEdit) {
        setSelectedExpenditure(prev => ({
          ...prev,
          image: file
        }));
      } else {
        setNewExpenditure(prev => ({
          ...prev,
          image: file
        }));
      }
    }
  };

  const removeImage = (isEdit = false) => {
    if (isEdit) {
      setSelectedExpenditure(prev => ({
        ...prev,
        image: null
      }));
    } else {
      setNewExpenditure(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const downloadPdf = () => {
    if (!billData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let yPosition = margin;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);
    doc.text("EXPENSE RECEIPT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Your Company Name", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 5;
    doc.text("123 Street, City, Country", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Bill Info
    doc.setFontSize(11);
    doc.text(`Paid To: ${billData?.payee_name || ''}`, margin, yPosition);
    doc.text(`Receipt #: ${billData?.bill_id || 'N/A'}`, pageWidth - margin, yPosition, { align: "right" });
    yPosition += 6;
    doc.text(`Date: ${billData?.date || ''}`, pageWidth - margin, yPosition, { align: "right" });
    yPosition += 10;

    // Table
    const tableHeaders = [["Description", "Category", "Amount"]];
    const tableData = [
      [
        billData.description || "Expense payment",
        getCategoryName(billData?.category_id),
        `$${parseFloat(billData?.amount || 0).toFixed(2)}`
      ]
    ];

    const summaryRows = [
      [
        {content: "Total", colSpan: 2, styles: {halign: 'right', fontStyle: 'bold'}},
        {content: `$${parseFloat(billData?.amount || 0).toFixed(2)}`, colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}}
      ]
    ];

    doc.autoTable({
      startY: yPosition,
      head: tableHeaders,
      body: [...tableData, ...summaryRows],
      theme: 'grid',
      headStyles: {
        fillColor: [244, 67, 54],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Footer
    doc.setFontSize(10);
    doc.text(`Payment Method: ${getPaymentModeName(billData?.payment_mode_id)}`, margin, finalY);
    
    if (billData?.image_url) {
      doc.text("Bill image is attached to this record", margin, finalY + 5);
    }
    
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 15, { align: "center" });

    doc.save(`Expense_${billData?.bill_id || billData?.id || "receipt"}.pdf`);
  };

  // Bill Modal Component - Now Scrollable
  const BillModalComponent = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={closeBillModal}></div>
      <div
        className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`}
        style={{ maxWidth: "800px", maxHeight: "90vh" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Expense Receipt</h2>
          <button onClick={closeBillModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body modal-scrollable">
          <div className="bill-container">
            <div className="bill-header text-center mb-4">
              <h2>EXPENSE RECEIPT</h2>
              <p className="mb-1">Your Company Name</p>
              <p>123 Street, City, Country</p>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong>Paid To:</strong> {billData?.payee_name}</p>
              </div>
              <div className="col-md-6 text-end">
                <p><strong>Receipt #:</strong> {billData?.bill_id || "N/A"}</p>
                <p><strong>Date:</strong> {billData?.date}</p>
              </div>
            </div>

            <Table bordered className="mb-4">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{billData?.description || "Expense payment"}</td>
                  <td>{getCategoryName(billData?.category_id)}</td>
                  <td>${parseFloat(billData?.amount || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>${parseFloat(billData?.amount || 0).toFixed(2)}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>

            {billData?.image_url && (
              <div className="mb-4">
                <h5>Attached Bill Image:</h5>
                <div className="text-center">
                  <Image 
                    src={billData.image_url} 
                    fluid 
                    thumbnail 
                    style={{ maxHeight: '300px', cursor: 'pointer' }}
                    onClick={() => openImageModal(billData.image_url)}
                  />
                  <div className="mt-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => openImageModal(billData.image_url)}
                    >
                      <Eye size={16} className="me-1" />
                      View Full Image
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="bill-footer mt-4">
              <p><strong>Payment Method:</strong> {getPaymentModeName(billData?.payment_mode_id)}</p>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeBillModal} className="s-btn s-btn-light">
            Close
          </button>
          <button onClick={downloadPdf} className="s-btn s-btn-grad-danger">
            <Download size={16} className="me-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );

  // Image Preview Modal Component - Now Scrollable
  const ImageModalComponent = () => {
    if (!selectedImage) return null;

    return (
      <div className={`thaniya-normal-overlay ${showImageModal ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeImageModal}></div>
        <div
          className={`thaniya-normal-modal ${showImageModal ? "thaniya-normal-modal-visible" : ""}`}
          style={{ maxWidth: "90%", maxHeight: "90%" }}
        >
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Image Preview</h2>
            <button onClick={closeImageModal} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>
          <div className="thaniya-normal-body modal-scrollable text-center">
            <img 
              src={selectedImage} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
            />
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={closeImageModal} className="s-btn s-btn-light">
              Close
            </button>
            <a 
              href={selectedImage} 
              download 
              className="s-btn s-btn-grad-danger"
            >
              <Download size={16} className="me-2" />
              Download
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Add Expenditure Modal Component - Now Scrollable
  const AddModal = () => {
    const initialForm = {
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      subcategory_id: "",
      variant_id: "",
      description: "",
      payee_name: "",
      amount: "",
      payment_mode_id: "",
      bill_id: "",
      status: 1,
      image: null,
    };

    const [localExpenditure, setLocalExpenditure] = useState(initialForm);
    const [localErrors, setLocalErrors] = useState({});

    const handleReset = () => {
      setLocalExpenditure(initialForm);
      setLocalErrors({});
    };

    const handleClose = () => {
      handleReset();
      closeModal();
    };

    const handleAdd = async () => {
      if (!validateForm(localExpenditure)) return;

      try {
        await handleAddExpenditure(localExpenditure);
        handleReset();
      } catch (error) {
        // Error handled in handleAddExpenditure
      }
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file (JPEG, PNG, GIF, etc.)');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }
        setLocalExpenditure(prev => ({
          ...prev,
          image: file
        }));
      }
    };

    const removeImage = () => {
      setLocalExpenditure(prev => ({
        ...prev,
        image: null
      }));
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>

        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "700px", width: "90%", maxHeight: "90vh" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Expenditure Record</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body modal-scrollable">
            {apiError && <Alert variant="danger">{apiError}</Alert>}
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Calendar size={16} />
                      </span>
                      <Form.Control
                        type="date"
                        className="form-control-lg"
                        value={localExpenditure.date}
                        onChange={(e) => setLocalExpenditure({ ...localExpenditure, date: e.target.value })}
                        isInvalid={!!localErrors.date}
                      />
                      <Form.Control.Feedback type="invalid">{localErrors.date}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={localExpenditure.category_id}
                      onChange={(e) =>
                        setLocalExpenditure({
                          ...localExpenditure,
                          category_id: e.target.value,
                          subcategory_id: "",
                          variant_id: "",
                        })
                      }
                      isInvalid={!!localErrors.category_id}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.category_name || c.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{localErrors.category_id}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={localExpenditure.subcategory_id}
                      onChange={(e) =>
                        setLocalExpenditure({
                          ...localExpenditure,
                          subcategory_id: e.target.value,
                          variant_id: "",
                        })
                      }
                    >
                      <option value="">Select Subcategory</option>
                      {(() => {
                        const categoryId = parseInt(localExpenditure.category_id, 10);
                        return subcategories
                          .filter((sc) => {
                            if (!categoryId || isNaN(categoryId)) return false;
                            return sc.main_category_id === categoryId;
                          })
                          .map((sc) => (
                            <option key={sc.id} value={sc.id}>
                              {sc.sub_category_name}
                            </option>
                          ));
                      })()}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Variant</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={localExpenditure.variant_id}
                      onChange={(e) =>
                        setLocalExpenditure({ ...localExpenditure, variant_id: e.target.value })
                      }
                    >
                      <option value="">Select Variant</option>
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.variant_name} {v.option_values ? `- ${v.option_values}` : ""}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={localExpenditure.description}
                      onChange={(e) => setLocalExpenditure({ ...localExpenditure, description: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payee Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter payee name"
                      value={localExpenditure.payee_name}
                      onChange={(e) => setLocalExpenditure({ ...localExpenditure, payee_name: e.target.value })}
                      isInvalid={!!localErrors.payee_name}
                    />
                    <Form.Control.Feedback type="invalid">{localErrors.payee_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      className="form-control-lg"
                      placeholder="Enter amount"
                      value={localExpenditure.amount}
                      onChange={(e) => setLocalExpenditure({ ...localExpenditure, amount: e.target.value })}
                      isInvalid={!!localErrors.amount}
                    />
                    <Form.Control.Feedback type="invalid">{localErrors.amount}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment Mode</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={localExpenditure.payment_mode_id}
                      onChange={(e) => setLocalExpenditure({ ...localExpenditure, payment_mode_id: e.target.value })}
                      isInvalid={!!localErrors.payment_mode_id}
                    >
                      <option value="">Select Payment Mode</option>
                      {paymentModes.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.payment_method || pm.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{localErrors.payment_mode_id}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bill/Receipt ID</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter bill/receipt ID"
                      value={localExpenditure.bill_id}
                      onChange={(e) => setLocalExpenditure({ ...localExpenditure, bill_id: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Bill Image</Form.Label>
                    <Form.Control
                      type="file"
                      className="form-control-lg"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Form.Text className="text-muted">
                      Upload bill/receipt image (JPEG, PNG, GIF - Max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {localExpenditure.image && (
                    <div className="mb-3">
                      <h6>Selected Image:</h6>
                      <div className="d-flex align-items-center border rounded p-2">
                        <ImageIcon size={24} className="me-2 text-primary" />
                        <span className="flex-grow-1 text-truncate">
                          {localExpenditure.image.name}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={removeImage}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="mt-2 text-center">
                        <Image 
                          src={URL.createObjectURL(localExpenditure.image)} 
                          thumbnail 
                          style={{ maxHeight: '150px' }}
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        />
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Form>
          </div>

          <div className="thaniya-normal-footer">
            <button onClick={handleReset} className="s-btn s-btn-light">
              Reset
            </button>
            <button 
              onClick={handleAdd} 
              className="s-btn s-btn-grad-danger"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                'Save Expenditure'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Expenditure Modal Component - Now Scrollable
  const EditModal = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
      return () => {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      };
    }, [imagePreviewUrl]);

    useEffect(() => {
      if (selectedExpenditure?.image instanceof File) {
        const url = URL.createObjectURL(selectedExpenditure.image);
        setImagePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setImagePreviewUrl(null);
      }
    }, [selectedExpenditure?.image]);

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "900px", width: "90%", maxHeight: "90vh" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Edit Expenditure Record</h2>
            <button onClick={closeModal} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>
          <div className="thaniya-normal-body modal-scrollable">
            {apiError && <Alert variant="danger">{apiError}</Alert>}
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Calendar size={16} />
                      </span>
                      <Form.Control
                        type="date"
                        className="form-control-lg"
                        value={selectedExpenditure?.date || ""}
                        onChange={(e) =>
                          setSelectedExpenditure({
                            ...selectedExpenditure,
                            date: e.target.value,
                          })
                        }
                        isInvalid={!!errors.date}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.date}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={selectedExpenditure?.category_id || ""}
                      onChange={(e) =>
                        setSelectedExpenditure({
                          ...selectedExpenditure,
                          category_id: e.target.value,
                          subcategory_id: "",
                          variant_id: "",
                        })
                      }
                      isInvalid={!!errors.category_id}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name || category.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category_id}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={selectedExpenditure?.subcategory_id || ""}
                      onChange={(e) =>
                        setSelectedExpenditure({
                          ...selectedExpenditure,
                          subcategory_id: e.target.value,
                          variant_id: "",
                        })
                      }
                    >
                      <option value="">Select Subcategory</option>
                      {(() => {
                        const categoryId = parseInt(selectedExpenditure?.category_id, 10);
                        return subcategories
                          .filter((sc) => {
                            if (!categoryId || isNaN(categoryId)) return false;
                            return sc.main_category_id === categoryId;
                          })
                          .map((sc) => (
                            <option key={sc.id} value={sc.id}>
                              {sc.sub_category_name}
                            </option>
                          ));
                      })()}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Variant</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={selectedExpenditure?.variant_id || ""}
                      onChange={(e) =>
                        setSelectedExpenditure({
                          ...selectedExpenditure,
                          variant_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Variant</option>
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.variant_name} {v.option_values ? `- ${v.option_values}` : ""}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={selectedExpenditure?.description || ""}
                      onChange={(e) =>
                        setSelectedExpenditure({
                          ...selectedExpenditure,
                          description: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payee Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <User size={16} />
                      </span>
                      <Form.Control
                        type="text"
                        className="form-control-lg"
                        placeholder="Enter payee name"
                        value={selectedExpenditure?.payee_name || ""}
                        onChange={(e) =>
                          setSelectedExpenditure({
                            ...selectedExpenditure,
                            payee_name: e.target.value,
                          })
                        }
                        isInvalid={!!errors.payee_name}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.payee_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <DollarSign size={16} />
                      </span>
                      <Form.Control
                        type="number"
                        className="form-control-lg"
                        placeholder="Enter amount"
                        value={selectedExpenditure?.amount || ""}
                        onChange={(e) =>
                          setSelectedExpenditure({
                            ...selectedExpenditure,
                            amount: e.target.value,
                          })
                        }
                        isInvalid={!!errors.amount}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.amount}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment Mode</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <CreditCard size={16} />
                      </span>
                      <Form.Select
                        className="form-control-lg"
                        value={selectedExpenditure?.payment_mode_id || ""}
                        onChange={(e) =>
                          setSelectedExpenditure({
                            ...selectedExpenditure,
                            payment_mode_id: e.target.value,
                          })
                        }
                        isInvalid={!!errors.payment_mode_id}
                      >
                        <option value="">Select Payment Mode</option>
                        {paymentModes.map((mode) => (
                          <option key={mode.id} value={mode.id}>
                            {mode.payment_method || mode.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.payment_mode_id}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bill/Receipt ID</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FileText size={16} />
                      </span>
                      <Form.Control
                        type="text"
                        className="form-control-lg"
                        placeholder="Enter bill/receipt ID"
                        value={selectedExpenditure?.bill_id || ""}
                        onChange={(e) =>
                          setSelectedExpenditure({
                            ...selectedExpenditure,
                            bill_id: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Update Bill Image</Form.Label>
                    <Form.Control
                      type="file"
                      className="form-control-lg"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                    <Form.Text className="text-muted">
                      Upload new bill image (JPEG, PNG, GIF - Max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {selectedExpenditure?.image_url && !selectedExpenditure.image && (
                    <Form.Group className="mb-3">
                      <Form.Label>Current Image</Form.Label>
                      <div className="text-center border rounded p-3">
                        <Image 
                          src={selectedExpenditure.image_url} 
                          thumbnail 
                          style={{ maxHeight: '200px', cursor: 'pointer' }}
                          onClick={() => openImageModal(selectedExpenditure.image_url)}
                        />
                        <div className="mt-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => openImageModal(selectedExpenditure.image_url)}
                            className="me-2"
                          >
                            <Eye size={16} className="me-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeImage(true)}
                          >
                            <X size={16} className="me-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Form.Group>
                  )}

                  {selectedExpenditure?.image && imagePreviewUrl && (
                    <Form.Group className="mb-3">
                      <Form.Label>New Image Preview</Form.Label>
                      <div className="text-center border rounded p-3">
                        <Image 
                          src={imagePreviewUrl} 
                          thumbnail 
                          style={{ maxHeight: '200px' }}
                          onLoad={() => URL.revokeObjectURL(imagePreviewUrl)}
                        />
                        <div className="mt-2">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => {
                              removeImage(true);
                              setImagePreviewUrl(null);
                            }}
                          >
                            <X size={16} className="me-1" />
                            Remove New Image
                          </Button>
                        </div>
                      </div>
                    </Form.Group>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={closeModal} className="s-btn s-btn-light">
              Cancel
            </button>
            <button
              onClick={handleUpdateExpenditure}
              className="s-btn s-btn-grad-danger"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Update Expenditure'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal Component
  const DeleteModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "500px" }}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Confirm Delete</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
          <p>
            Are you sure you want to delete expenditure record for{" "}
            <strong>{selectedExpenditure?.payee_name}</strong> dated{" "}
            <strong>{selectedExpenditure?.date}</strong>?
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
        activeMenu="Expenditure Records"
        motherMenu="Finance"
        pageContent="Expenditure Management"
      />

      {apiError && <Alert variant="danger" className="m-3">{apiError}</Alert>}

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Card>
          <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Nav variant="tabs" className="nav-tabs-bottom mb-0 me-3">
                <Nav.Item>
                  <Nav.Link eventKey="records">Expenditure Records</Nav.Link>
                </Nav.Item>
              </Nav>
              
              {activeTab === "records" && (
                <InputGroup style={{ width: '300px' }}>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search expenditure records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              )}
            </div>
            
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "spinning" : ""} />
              </Button>
              <Button
                className="s-btn s-btn-grad-danger"
                onClick={openAddModal}
                disabled={loading}
              >
                + Add Expenditure
              </Button>
            </div>
          </Card.Header>

          <Tab.Content>
            <Tab.Pane eventKey="records">
              <div className="s-card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading expenditure records...</p>
                  </div>
                ) : filteredExpenditures.length === 0 ? (
                  <Alert variant="info" className="m-3">
                    {searchTerm ? 'No expenditure records match your search.' : 'No expenditure records found.'}
                  </Alert>
                ) : (
                  <Table responsive className="s-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Payee Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Payment Mode</th>
                        <th>Bill Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenditures.map((expenditure, index) => (
                        <tr key={expenditure.id}>
                          <th>{expenditure.id}</th>
                          <td>{expenditure.date}</td>
                          <td>{expenditure.payee_name}</td>
                          <td>{getCategoryName(expenditure.category_id)}</td>
                          <td>${parseFloat(expenditure.amount).toFixed(2)}</td>
                          <td>{getPaymentModeName(expenditure.payment_mode_id)}</td>
                          <td>
                            {expenditure.image_url ? (
                              <Badge 
                                bg="success" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => openImageModal(expenditure.image_url)}
                              >
                                <ImageIcon size={12} className="me-1" />
                                View Image
                              </Badge>
                            ) : (
                              <Badge bg="secondary">No Image</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex">
                              <button
                                onClick={() => openBillModal(expenditure)}
                                className="btn btn-bill shadow btn-xs sharp me-2"
                                title="View Bill"
                              >
                                <i className="fas fa-file-invoice"></i>
                              </button>
                              <button
                                onClick={() => openEditModal(expenditure)}
                                className="btn btn-custom-blue shadow btn-xs sharp me-1"
                                title="Edit"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </button>
                              <button
                                onClick={() => openDeleteModal(expenditure)}
                                className="btn btn-danger shadow btn-xs sharp"
                                title="Delete"
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
            </Tab.Pane>
          </Tab.Content>
        </Card>
      </Tab.Container>

      {showAddModal && <AddModal />}
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
      {showBillModal && <BillModalComponent />}
      {showImageModal && <ImageModalComponent />}

      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Scrollable modal styles */
        .modal-scrollable {
          overflow-y: auto;
          max-height: calc(90vh - 140px);
          padding-right: 5px;
        }
        
        /* Custom scrollbar for modal */
        .modal-scrollable::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-scrollable::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .modal-scrollable::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .modal-scrollable::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Ensure modal header and footer stay fixed */
        .thaniya-normal-modal {
          display: flex;
          flex-direction: column;
        }
        
        .thaniya-normal-header,
        .thaniya-normal-footer {
          flex-shrink: 0;
        }
        
        .thaniya-normal-body {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </Fragment>
  );
};

export default ExpenditureMaster;