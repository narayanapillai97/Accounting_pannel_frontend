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
  RefreshCw
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
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermFiles, setSearchTermFiles] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenditures, setExpenditures] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [apiError, setApiError] = useState("");

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
    files: [],
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
      const expenditureData = data.data || data || [];
      setExpenditures(expenditureData.map((item) => ({
        ...item,
        files: item.files || []
      })));
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
      const response = await fetch(`${API_BASE_URL}/expenditure/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenditureData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add expenditure');
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
      const response = await fetch(`${API_BASE_URL}/expenditure/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenditureData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update expenditure');
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
      
      // Load files from localStorage
      const savedFiles = localStorage.getItem('expenditureFiles');
      if (savedFiles) {
        const filesData = JSON.parse(savedFiles);
        setExpenditures(prevExpenditures => 
          prevExpenditures.map(expenditure => ({
            ...expenditure,
            files: filesData[expenditure.id] || []
          }))
        );
      }
    };

    loadData();
  }, [refreshTrigger]);

  // Save files to localStorage when they change
  useEffect(() => {
    const filesData = {};
    expenditures.forEach(expenditure => {
      filesData[expenditure.id] = expenditure.files;
    });
    localStorage.setItem('expenditureFiles', JSON.stringify(filesData));
  }, [expenditures]);

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
    return expenditures.filter(expenditure => 
      expenditure.payee_name?.toLowerCase().includes(lowerSearchTerm) ||
      expenditure.description?.toLowerCase().includes(lowerSearchTerm) ||
      getCategoryName(expenditure.category_id)?.toLowerCase().includes(lowerSearchTerm) ||
      getPaymentModeName(expenditure.payment_mode_id)?.toLowerCase().includes(lowerSearchTerm) ||
      expenditure.amount?.toString().includes(lowerSearchTerm) ||
      expenditure.date?.includes(lowerSearchTerm) ||
      expenditure.bill_id?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [expenditures, searchTerm]);

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
      files: [],
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
      await addExpenditure(expenditureData);
      closeModal();
    } catch (error) {
      alert('Failed to add expenditure record');
    }
  };

  const handleUpdateExpenditure = async () => {
    if (!validateForm(selectedExpenditure)) return;

    try {
      await updateExpenditure(selectedExpenditure.id, selectedExpenditure);
      setExpenditures(
        expenditures.map((i) => (i.id === selectedExpenditure.id ? selectedExpenditure : i))
      );
      closeModal();
    } catch (error) {
      alert('Failed to update expenditure record');
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

  const handleFileUpload = (e, expenditureId = null) => {
    const files = Array.from(e.target.files);
    
    if (expenditureId) {
      setExpenditures(prevExpenditures => 
        prevExpenditures.map(expenditure => 
          expenditure.id === expenditureId 
            ? { ...expenditure, files: [...expenditure.files, ...files] }
            : expenditure
        )
      );
    } else {
      setNewExpenditure(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };

  const removeFile = (expenditureId, fileIndex) => {
    setExpenditures(prevExpenditures => 
      prevExpenditures.map(expenditure => 
        expenditure.id === expenditureId 
          ? { 
              ...expenditure, 
              files: expenditure.files.filter((_, index) => index !== fileIndex) 
            }
          : expenditure
      )
    );
  };

  const openFileModal = (file) => {
    setSelectedFile(file);
    setShowFileModal(true);
  };

  const closeFileModal = () => {
    setShowFileModal(false);
    setSelectedFile(null);
  };

  const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    
    if (billData?.bill_url) {
      doc.text("Original bill is attached to this record", margin, finalY + 5);
    }
    
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 15, { align: "center" });

    doc.save(`Expense_${billData?.bill_id || billData?.id || "receipt"}.pdf`);
  };

  // Bill Modal Component
  const BillModalComponent = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={closeBillModal}></div>
      <div
        className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`}
        style={{ maxWidth: "800px" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Expense Receipt</h2>
          <button onClick={closeBillModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
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

            {billData?.bill_url && (
              <div className="mb-4">
                <h5>Attached Bill:</h5>
                {billData.bill_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <Image src={billData.bill_url} fluid thumbnail />
                ) : (
                  <a 
                    href={billData.bill_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <FileText size={16} className="me-2" />
                    View Original Bill
                  </a>
                )}
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

  // File Preview Modal Component
  const FileModalComponent = () => {
    if (!selectedFile) return null;

    const isImage = selectedFile.type.startsWith('image/');
    const isPDF = selectedFile.type === 'application/pdf';

    return (
      <div className={`thaniya-normal-overlay ${showFileModal ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={closeFileModal}></div>
        <div
          className={`thaniya-normal-modal ${showFileModal ? "thaniya-normal-modal-visible" : ""}`}
          style={{ maxWidth: "800px", width: "90%" }}
        >
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">File Preview</h2>
            <button onClick={closeFileModal} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>
          <div className="thaniya-normal-body">
            <div className="text-center">
              <h5>{selectedFile.name}</h5>
              
              {isImage ? (
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '500px' }}
                />
              ) : isPDF ? (
                <iframe 
                  src={URL.createObjectURL(selectedFile)} 
                  width="100%" 
                  height="500px" 
                  title="PDF Preview"
                />
              ) : (
                <div className="alert alert-info mt-3">
                  <FileText size={48} className="mb-2" />
                  <p>No preview available for this file type.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => downloadFile(selectedFile)}
                  >
                    <Download size={16} className="me-2" />
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="thaniya-normal-footer">
            <button onClick={closeFileModal} className="s-btn s-btn-light">
              Close
            </button>
            <button 
              onClick={() => downloadFile(selectedFile)} 
              className="s-btn s-btn-grad-danger"
            >
              <Download size={16} className="me-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Expenditure Modal Component
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
      files: [],
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

    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      setLocalExpenditure(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    };

    const removeFile = (fileIndex) => {
      setLocalExpenditure(prev => ({
        ...prev,
        files: prev.files.filter((_, index) => index !== fileIndex)
      }));
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>

        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "700px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Expenditure Record</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
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
      // Debug logs
      console.log("Subcategories:", subcategories);
      console.log("Selected Category ID:", localExpenditure.category_id);

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
                    <Form.Label>Attach Files</Form.Label>
                    <Form.Control
                      type="file"
                      className="form-control-lg"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <Form.Text className="text-muted">
                      You can attach multiple files (bills, receipts, etc.)
                    </Form.Text>
                  </Form.Group>

                  {localExpenditure.files.length > 0 && (
                    <div className="mb-3">
                      <h6>Attached Files:</h6>
                      <ul className="list-group">
                        {localExpenditure.files.map((file, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span className="text-truncate" style={{maxWidth: '70%'}}>
                              <Paperclip size={14} className="me-2" />
                              {file.name}
                            </span>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(index)}
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
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
            <button onClick={handleAdd} className="s-btn s-btn-grad-danger">
              Save Expenditure
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Expenditure Modal Component
  const EditModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "900px", width: "90%" }}>
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Edit Expenditure Record</h2>
          <button onClick={closeModal} className="thaniya-normal-close">
            <X size={20} />
          </button>
        </div>
        <div className="thaniya-normal-body">
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
      // Debug logs
      console.log("Subcategories:", subcategories);
      console.log("Selected Category ID (Edit):", selectedExpenditure?.category_id);

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
                  <Form.Label>Attach More Files</Form.Label>
                  <Form.Control
                    type="file"
                    className="form-control-lg"
                    multiple
                    onChange={(e) => handleFileUpload(e, selectedExpenditure?.id)}
                  />
                </Form.Group>

                {selectedExpenditure?.files && selectedExpenditure.files.length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Attached Files</Form.Label>
                    <div className="list-group">
                      {selectedExpenditure.files.map((file, index) => (
                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <Paperclip size={14} className="me-2" />
                            <span className="text-truncate" style={{maxWidth: '150px'}}>
                              {file.name}
                            </span>
                          </div>
                          <div>
                            <button 
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => openFileModal(file)}
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success me-1"
                              onClick={() => downloadFile(file)}
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(selectedExpenditure.id, index)}
                              title="Remove"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
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
          >
            Update Expenditure
          </button>
        </div>
      </div>
    </div>
  );

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

  // Files Tab Content Component
  const FilesTabContent = () => {
    const allFiles = expenditures.flatMap(expenditure => 
      expenditure.files.map(file => ({ ...file, expenditure }))
    );

    const filteredFiles = useMemo(() => {
      if (!searchTermFiles) return allFiles;
      
      const lowerSearchTerm = searchTermFiles.toLowerCase();
      return allFiles.filter(file => 
        file.name.toLowerCase().includes(lowerSearchTerm) ||
        file.expenditure.payee_name?.toLowerCase().includes(lowerSearchTerm) ||
        file.expenditure.description?.toLowerCase().includes(lowerSearchTerm) ||
        file.expenditure.date?.includes(lowerSearchTerm) ||
        file.expenditure.bill_id?.toLowerCase().includes(lowerSearchTerm)
      );
    }, [allFiles, searchTermFiles]);

    if (allFiles.length === 0) {
      return (
        <Card>
          <Card.Body className="text-center py-5">
            <FileText size={48} className="text-muted mb-3" />
            <h5>No files uploaded yet</h5>
            <p className="text-muted">Upload files in the expenditure records to view them here.</p>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card>
        <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
          <Card.Title>All Uploaded Files</Card.Title>
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search files..."
              value={searchTermFiles}
              onChange={(e) => setSearchTermFiles(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <div className="s-card-body">
          {filteredFiles.length === 0 ? (
            <Alert variant="info" className="m-3">
              {searchTermFiles ? 'No files match your search.' : 'No files found.'}
            </Alert>
          ) : (
            <Table responsive className="s-bordered">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Expenditure Record</th>
                  <th>Payee</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Paperclip size={16} className="me-2" />
                        <span className="text-truncate" style={{maxWidth: '200px'}}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td>#{file.expenditure.id}</td>
                    <td>{file.expenditure.payee_name}</td>
                    <td>{file.expenditure.date}</td>
                    <td>{file.type || 'Unknown'}</td>
                    <td>{(file.size / 1024).toFixed(2)} KB</td>
                    <td>
                      <div className="d-flex">
                        <button
                          onClick={() => openFileModal(file)}
                          className="btn btn-primary shadow btn-xs sharp me-1"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => downloadFile(file)}
                          className="btn btn-success shadow btn-xs sharp me-1"
                          title="Download"
                        >
                          <Download size={14} />
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
    );
  };

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
                <Nav.Item>
                  <Nav.Link eventKey="files">Uploaded Files</Nav.Link>
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
                        <th>Files</th>
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
                            {expenditure.files.length > 0 ? (
                              <Badge bg="success">
                                <Paperclip size={12} className="me-1" />
                                {expenditure.files.length}
                              </Badge>
                            ) : (
                              <Badge bg="secondary">None</Badge>
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
            
            <Tab.Pane eventKey="files">
              <FilesTabContent />
            </Tab.Pane>
          </Tab.Content>
        </Card>
      </Tab.Container>

      {showAddModal && <AddModal />}
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
      {showBillModal && <BillModalComponent />}
      {showFileModal && <FileModalComponent />}

      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Fragment>
  );
};

export default ExpenditureMaster;