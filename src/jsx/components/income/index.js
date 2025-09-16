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
  Container,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const IncomeMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
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

  const [newIncome, setNewIncome] = useState({
    date: new Date().toISOString().split("T")[0],
    category_id: "",
    subcategory_id: "",
    variant_id: "",
    payer_name: "",
    description: "",
    amount: "",
    payment_mode_id: "",
    bill_id: "",
    status: 1,
    files: [],
  });

  const [incomes, setIncomes] = useState(
    Data["incomes"].map((item, index) => ({
      id: index + 1,
      date: item.date,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      variant_id: item.variant_id,
      payer_name: item.payer_name,
      description: item.description,
      amount: item.amount,
      payment_mode_id: item.payment_mode_id,
      bill_id: item.bill_id,
      status: item.status === 1 ? 1 : 0,
      files: [],
    }))
  );

  // Load dropdown data
  useEffect(() => {
    // In a real app, you would fetch these from an API
    setCategories(Data["categories"] || []);
    setSubcategories(Data["subcategories"] || []);
    setVariants(Data["variants"] || []);
    setPaymentModes(Data["payment_modes"] || []);
    
    // Load files from localStorage
    const savedFiles = localStorage.getItem('incomeFiles');
    if (savedFiles) {
      const filesData = JSON.parse(savedFiles);
      setIncomes(prevIncomes => 
        prevIncomes.map(income => ({
          ...income,
          files: filesData[income.id] || []
        }))
      );
    }
  }, []);

  // Save files to localStorage when they change
  useEffect(() => {
    const filesData = {};
    incomes.forEach(income => {
      filesData[income.id] = income.files;
    });
    localStorage.setItem('incomeFiles', JSON.stringify(filesData));
  }, [incomes]);

    const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "N/A";
  };

  const getPaymentModeName = (id) => {
    const mode = paymentModes.find((p) => p.id === id);
    return mode ? mode.name : "N/A";
  };

  // Filter income records based on search term
  const filteredIncomes = useMemo(() => {
    if (!searchTerm) return incomes;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return incomes.filter(income => 
      income.payer_name.toLowerCase().includes(lowerSearchTerm) ||
      income.description.toLowerCase().includes(lowerSearchTerm) ||
      getCategoryName(income.category_id).toLowerCase().includes(lowerSearchTerm) ||
      getPaymentModeName(income.payment_mode_id).toLowerCase().includes(lowerSearchTerm) ||
      income.amount.toString().includes(lowerSearchTerm) ||
      income.date.includes(lowerSearchTerm) ||
      income.bill_id.toLowerCase().includes(lowerSearchTerm)
    );
  }, [incomes, searchTerm]);

  const validateForm = (incomeData) => {
    const newErrors = {};
    if (!incomeData.date) newErrors.date = "Please select date";
    if (!incomeData.category_id)
      newErrors.category_id = "Please select category";
    if (!incomeData.payer_name.trim())
      newErrors.payer_name = "Please enter payer name";
    if (!incomeData.amount || isNaN(incomeData.amount))
      newErrors.amount = "Please enter valid amount";
    if (!incomeData.payment_mode_id)
      newErrors.payment_mode_id = "Please select payment mode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setNewIncome({
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      subcategory_id: "",
      variant_id: "",
      payer_name: "",
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

  const openEditModal = (income) => {
    setSelectedIncome({ ...income });
    setErrors({});
    setShowEditModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openDeleteModal = (income) => {
    setSelectedIncome(income);
    setShowDeleteModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSelectedIncome(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = () => {
    setIncomes(incomes.filter((income) => income.id !== selectedIncome.id));
    closeModal();
  };

  const handleAddIncome = () => {
    if (!validateForm(newIncome)) return;

    const newId =
      incomes.length > 0 ? Math.max(...incomes.map((i) => i.id)) + 1 : 1;
    setIncomes([...incomes, { ...newIncome, id: newId }]);
    closeModal();
  };

  const handleUpdateIncome = () => {
    if (!validateForm(selectedIncome)) return;

    setIncomes(
      incomes.map((i) => (i.id === selectedIncome.id ? selectedIncome : i))
    );
    closeModal();
  };



  const openBillModal = (income) => {
    setBillData(income);
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

  const handleFileUpload = (e, incomeId = null) => {
    const files = Array.from(e.target.files);
    
    if (incomeId) {
      // Editing existing income
      setIncomes(prevIncomes => 
        prevIncomes.map(income => 
          income.id === incomeId 
            ? { ...income, files: [...income.files, ...files] }
            : income
        )
      );
    } else {
      // Adding new income
      setNewIncome(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };

  const removeFile = (incomeId, fileIndex) => {
    setIncomes(prevIncomes => 
      prevIncomes.map(income => 
        income.id === incomeId 
          ? { 
              ...income, 
              files: income.files.filter((_, index) => index !== fileIndex) 
            }
          : income
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
  doc.setTextColor(0, 0, 255); // Blue color
  doc.text("OMSAKTHI INVOICE", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text("Omsakthi Kovil, Melmaruvathur", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  doc.text("Melmaruvathur, Tamil Nadu, India", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  doc.text("GSTIN: 33ABCDE1234F1Z5", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // From/To sections
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text("From:", margin, yPosition);
  doc.text("To:", pageWidth - margin, yPosition, { align: "right" });
  yPosition += 5;
  
  doc.setFont(undefined, 'normal');
  // From details
  doc.text("Omsakthi Kovil", margin, yPosition);
  doc.text("Melmaruvathur", margin, yPosition + 5);
  doc.text("Tamil Nadu, India", margin, yPosition + 10);
  doc.text("Phone: +91 1234567890", margin, yPosition + 15);
  
  // To details (right aligned)
  doc.text("Harini", pageWidth - margin, yPosition, { align: "right" });
  doc.text("Trichy", pageWidth - margin, yPosition + 5, { align: "right" });
  doc.text("Tamil Nadu, India", pageWidth - margin, yPosition + 10, { align: "right" });
  doc.text("Phone: +91 9876543210", pageWidth - margin, yPosition + 15, { align: "right" });
  
  yPosition += 25;

  // Invoice details
  doc.setFont(undefined, 'bold');
  doc.text(`Invoice #: ${billData?.bill_id || "OM-2023-001"}`, margin, yPosition);
  doc.text(`Issue Date: ${billData?.date || new Date().toISOString().split('T')[0]}`, margin, yPosition + 5);
  
  doc.text(`Payment Method: ${getPaymentModeName(billData?.payment_mode_id)}`, pageWidth - margin, yPosition, { align: "right" });
  doc.text("Status: Paid", pageWidth - margin, yPosition + 5, { align: "right" });
  
  yPosition += 15;

  // Table header
  const tableHeaders = [["Description", "Category", "Quantity", "Rate", "Amount"]];
  const tableData = [
    [
      "Kunguma Kapu Pooja",
      getCategoryName(billData?.category_id) || "Religious Services",
      "1",
      `₹${parseFloat(billData?.amount || 500).toFixed(2)}`,
      `₹${parseFloat(billData?.amount || 500).toFixed(2)}`
    ],
    [
      "Sandhana Kapu Pooja",
      getCategoryName(billData?.category_id) || "Religious Services",
      "1",
      `₹${parseFloat(billData?.amount || 300).toFixed(2)}`,
      `₹${parseFloat(billData?.amount || 300).toFixed(2)}`
    ]
  ];

  // Calculate totals
  const subtotal = (billData?.amount || 500) + (billData?.amount || 300);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // Add summary rows
  const summaryRows = [
    [
      {content: "", colSpan: 3, styles: {halign: 'left'}},
      {content: "Subtotal", colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}},
      {content: `₹${subtotal.toFixed(2)}`, colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}}
    ],
    [
      {content: "", colSpan: 3, styles: {halign: 'left'}},
      {content: "GST (18%)", colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}},
      {content: `₹${gst.toFixed(2)}`, colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}}
    ],
    [
      {content: "", colSpan: 3, styles: {halign: 'left'}},
      {content: "Total", colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}},
      {content: `₹${total.toFixed(2)}`, colSpan: 1, styles: {halign: 'right', fontStyle: 'bold'}}
    ]
  ];

  // Create the table
  doc.autoTable({
    startY: yPosition,
    head: tableHeaders,
    body: [...tableData, ...summaryRows],
    theme: 'grid',
    headStyles: {
      fillColor: [244, 67, 54], // Red header
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: {cellWidth: 'auto'},
      1: {cellWidth: 'auto'},
      2: {cellWidth: 'auto'},
      3: {cellWidth: 'auto'},
      4: {cellWidth: 'auto'}
    }
  });

  // Get the final Y position after the table
  const finalY = doc.lastAutoTable.finalY + 10;

  // Footer content
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text("Payment Terms:", margin, finalY);
  doc.setFont(undefined, 'normal');
  doc.text("Net 15 days", margin + 30, finalY);
  
  doc.setFont(undefined, 'bold');
  doc.text("Notes:", margin, finalY + 5);
  doc.setFont(undefined, 'normal');
  doc.text("Thank you for your devotion. May Goddess Sakthi bless you with prosperity and happiness.", margin + 15, finalY + 5);
  
  // Signature area
  const signatureY = finalY + 15;
  doc.text("Authorized Signature", pageWidth / 2, signatureY, { align: "center" });
  
  // Draw a line for signature
  doc.line(pageWidth / 2 - 50, signatureY + 5, pageWidth / 2 + 50, signatureY + 5);
  
  doc.text("Omsakthi Management", pageWidth / 2, signatureY + 10, { align: "center" });

  // Save the PDF
  doc.save(`Omsakthi_Invoice_${billData?.bill_id || billData?.id || "receipt"}.pdf`);
};

  // Add Income Modal
  const AddModal = () => {
    const initialForm = {
      date: "",
      category_id: "",
      subcategory_id: "",
      variant_id: "",
      description: "",
      payer_name: "",
      amount: "",
      payment_mode_id: "",
      bill_id: "",
      files: [],
    };

    const [newIncome, setNewIncome] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const handleReset = () => {
      setNewIncome(initialForm);
      setErrors({});
    };

    const handleClose = () => {
      handleReset();
      closeModal();
    };

    const handleAddIncome = () => {
      if (!validateForm(newIncome)) return;

      const newId =
        incomes.length > 0 ? Math.max(...incomes.map((i) => i.id)) + 1 : 1;
      setIncomes([...incomes, { ...newIncome, id: newId }]);
      handleReset();
      closeModal();
    };

    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      setNewIncome(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    };

    const removeFile = (fileIndex) => {
      setNewIncome(prev => ({
        ...prev,
        files: prev.files.filter((_, index) => index !== fileIndex)
      }));
    };

    return (
      <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
        <div className="thaniya-normal-backdrop" onClick={handleClose}></div>

        <div className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`} style={{ maxWidth: "700px", width: "90%" }}>
          <div className="thaniya-normal-header">
            <h2 className="thaniya-normal-title">Add Income Record</h2>
            <button onClick={handleClose} className="thaniya-normal-close">
              <X size={20} />
            </button>
          </div>

          <div className="thaniya-normal-body">
            <Form>
              <Row>
                <Col md={6}>
                  {/* Date */}
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Calendar size={16} />
                      </span>
                      <Form.Control
                        type="date"
                        className="form-control-lg"
                        value={newIncome.date}
                        onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                        isInvalid={!!errors.date}
                      />
                      <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* Category */}
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={newIncome.category_id}
                      onChange={(e) =>
                        setNewIncome({
                          ...newIncome,
                          category_id: e.target.value,
                          subcategory_id: "",
                          variant_id: "",
                        })
                      }
                      isInvalid={!!errors.category_id}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Subcategory */}
                  <Form.Group className="mb-3">
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={newIncome.subcategory_id}
                      onChange={(e) =>
                        setNewIncome({ ...newIncome, subcategory_id: e.target.value, variant_id: "" })
                      }
                      isInvalid={!!errors.subcategory_id}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories
                        .filter((sc) => sc.category_id === parseInt(newIncome.category_id))
                        .map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            {sc.name}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.subcategory_id}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Variant */}
                  <Form.Group className="mb-3">
                    <Form.Label>Variant</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={newIncome.variant_id}
                      onChange={(e) => setNewIncome({ ...newIncome, variant_id: e.target.value })}
                      isInvalid={!!errors.variant_id}
                    >
                      <option value="">Select Variant</option>
                      {variants
                        .filter((v) => v.subcategory_id === parseInt(newIncome.subcategory_id))
                        .map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.variant_id}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="form-control-lg"
                      placeholder="Enter description"
                      value={newIncome.description}
                      onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Payer Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Payer Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter payer name"
                      value={newIncome.payer_name}
                      onChange={(e) => setNewIncome({ ...newIncome, payer_name: e.target.value })}
                      isInvalid={!!errors.payer_name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.payer_name}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Amount */}
                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      className="form-control-lg"
                      placeholder="Enter amount"
                      value={newIncome.amount}
                      onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                      isInvalid={!!errors.amount}
                    />
                    <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Payment Mode */}
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Mode</Form.Label>
                    <Form.Select
                      className="form-control-lg"
                      value={newIncome.payment_mode_id}
                      onChange={(e) => setNewIncome({ ...newIncome, payment_mode_id: e.target.value })}
                      isInvalid={!!errors.payment_mode_id}
                    >
                      <option value="">Select Payment Mode</option>
                      {paymentModes.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.payment_mode_id}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Bill / Invoice ID */}
                  <Form.Group className="mb-3">
                    <Form.Label>Bill / Invoice ID</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control-lg"
                      placeholder="Enter bill/invoice ID"
                      value={newIncome.bill_id}
                      onChange={(e) => setNewIncome({ ...newIncome, bill_id: e.target.value })}
                    />
                  </Form.Group>

                  {/* File Upload */}
                  <Form.Group className="mb-3">
                    <Form.Label>Attach Files</Form.Label>
                    <Form.Control
                      type="file"
                      className="form-control-lg"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <Form.Text className="text-muted">
                      You can attach multiple files (receipts, invoices, etc.)
                    </Form.Text>
                  </Form.Group>

                  {/* File List */}
                  {newIncome.files.length > 0 && (
                    <div className="mb-3">
                      <h6>Attached Files:</h6>
                      <ul className="list-group">
                        {newIncome.files.map((file, index) => (
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
            <button onClick={handleAddIncome} className="s-btn s-btn-grad-danger">
              Save Income
            </button>
          </div>
        </div>
      </div>
    );
  };

// Edit Income Modal
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
      }`} style={{ maxWidth: "900px", width: "90%" }}
    >
      <div className="thaniya-normal-header">
        <h2 className="thaniya-normal-title">Edit Income Record</h2>
        <button onClick={closeModal} className="thaniya-normal-close">
          <X size={20} />
        </button>
      </div>
      <div className="thaniya-normal-body">
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
                    value={selectedIncome?.date || ""}
                    onChange={(e) =>
                      setSelectedIncome({
                        ...selectedIncome,
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
                <select
                  className="form-control form-control-lg"
                  value={selectedIncome?.category_id || ""}
                  onChange={(e) =>
                    setSelectedIncome({
                      ...selectedIncome,
                      category_id: e.target.value,
                    })
                  }
                  isInvalid={!!errors.category_id}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Form.Control.Feedback type="invalid">
                  {errors.category_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subcategory</Form.Label>
                <select
                  className="form-control form-control-lg"
                  value={selectedIncome?.subcategory_id || ""}
                  onChange={(e) =>
                    setSelectedIncome({
                      ...selectedIncome,
                      subcategory_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Subcategory</option>
                  {subcategories
                    .filter(
                      (sc) =>
                        sc.category_id ===
                        parseInt(selectedIncome?.category_id || 0)
                    )
                    .map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                </select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Variant</Form.Label>
                <select
                  className="form-control form-control-lg"
                  value={selectedIncome?.variant_id || ""}
                  onChange={(e) =>
                    setSelectedIncome({
                      ...selectedIncome,
                      variant_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Variant</option>
                  {variants
                    .filter(
                      (v) =>
                        v.subcategory_id ===
                        parseInt(selectedIncome?.subcategory_id || 0)
                    )
                    .map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                </select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="form-control-lg"
                  placeholder="Enter description"
                  value={selectedIncome?.description || ""}
                  onChange={(e) =>
                    setSelectedIncome({
                      ...selectedIncome,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payer Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <User size={16} />
                  </span>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter payer name"
                    value={selectedIncome?.payer_name || ""}
                    onChange={(e) =>
                      setSelectedIncome({
                        ...selectedIncome,
                        payer_name: e.target.value,
                      })
                    }
                    isInvalid={!!errors.payer_name}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.payer_name}
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
                    value={selectedIncome?.amount || ""}
                    onChange={(e) =>
                      setSelectedIncome({
                        ...selectedIncome,
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
                  <select
                    className="form-control form-control-lg"
                    value={selectedIncome?.payment_mode_id || ""}
                    onChange={(e) =>
                      setSelectedIncome({
                        ...selectedIncome,
                        payment_mode_id: e.target.value,
                      })
                    }
                    isInvalid={!!errors.payment_mode_id}
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModes.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.payment_mode_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bill/Invoice ID</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FileText size={16} />
                  </span>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter bill/invoice ID"
                    value={selectedIncome?.bill_id || ""}
                    onChange={(e) =>
                      setSelectedIncome({
                        ...selectedIncome,
                        bill_id: e.target.value,
                      })
                    }
                  />
                </div>
              </Form.Group>

              {/* File Upload in Edit Modal */}
              <Form.Group className="mb-3">
                <Form.Label>Attach More Files</Form.Label>
                <Form.Control
                  type="file"
                  className="form-control-lg"
                  multiple
                  onChange={(e) => handleFileUpload(e, selectedIncome?.id)}
                />
              </Form.Group>

              {/* File List in Edit Modal */}
              {selectedIncome?.files && selectedIncome.files.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Attached Files</Form.Label>
                  <div className="list-group">
                    {selectedIncome.files.map((file, index) => (
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
                            onClick={() => removeFile(selectedIncome.id, index)}
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
          onClick={handleUpdateIncome}
          className="s-btn s-btn-grad-danger"
        >
          Update Income
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
            Are you sure you want to delete income record from{" "}
            <strong>{selectedIncome?.payer_name}</strong> dated{" "}
            <strong>{selectedIncome?.date}</strong>?
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

const BillModal = () => (
  <div
    className={`thaniya-normal-overlay ${
      isAnimating ? "thaniya-overlay-visible" : ""
    }`}
  >
    <div className="thaniya-normal-backdrop" onClick={closeBillModal}></div>
    <div
      className={`thaniya-normal-modal ${
        isAnimating ? "thaniya-normal-modal-visible" : ""
      }`}
      style={{
        maxWidth: "800px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header (fixed) */}
      <div className="thaniya-normal-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h2 className="thaniya-normal-title m-0">Omsakthi Bill/Invoice</h2>
        <button onClick={closeBillModal} className="thaniya-normal-close btn btn-link">
          <X size={20} />
        </button>
      </div>

      {/* Body (scrollable) */}
      <div
        className="thaniya-normal-body"
        style={{ overflowY: "auto", flex: 1, padding: "20px" }}
      >
        <div className="bill-container">
          <div className="bill-header text-center mb-4">
            <h2 className="text-primary">OMSAKTHI INVOICE</h2>
            <p className="mb-1 fw-bold">Omsakthi Kovil, Melmaruvathur</p>
            <p>Melmaruvathur, Tamil Nadu, India</p>
            <p>GSTIN: 33ABCDE1234F1Z5</p>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>From:</strong></p>
              <p className="mb-1 fw-bold">Omsakthi Kovil</p>
              <p className="mb-1">Melmaruvathur</p>
              <p className="mb-1">Tamil Nadu, India</p>
              <p>Phone: +91 1234567890</p>
            </div>
            <div className="col-md-6 text-end">
              <p><strong>To:</strong></p>
              <p className="mb-1 fw-bold">Harini</p>
              <p className="mb-1">Trichy</p>
              <p className="mb-1">Tamil Nadu, India</p>
              <p>Phone: +91 9876543210</p>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Invoice #:</strong> {billData?.bill_id || "OM-2023-001"}</p>
              <p><strong>Issue Date:</strong> {billData?.date || new Date().toISOString().split('T')[0]}</p>
            </div>
            <div className="col-md-6 text-end">
              <p><strong>Payment Method:</strong> {getPaymentModeName(billData?.payment_mode_id)}</p>
              <p><strong>Status:</strong> <Badge bg="success">Paid</Badge></p>
            </div>
          </div>

          <Table bordered className="mb-4">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kunguma Kapu Pooja</td>
                <td>{getCategoryName(billData?.category_id) || "Religious Services"}</td>
                <td>1</td>
                <td>₹{parseFloat(billData?.amount || 500).toFixed(2)}</td>
                <td>₹{parseFloat(billData?.amount || 500).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Sandhana Kapu Pooja</td>
                <td>{getCategoryName(billData?.category_id) || "Religious Services"}</td>
                <td>1</td>
                <td>₹{parseFloat(billData?.amount || 300).toFixed(2)}</td>
                <td>₹{parseFloat(billData?.amount || 300).toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td className="text-end"><strong>Subtotal</strong></td>
                <td><strong>₹{parseFloat((billData?.amount || 500) + (billData?.amount || 300)).toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td className="text-end"><strong>GST (18%)</strong></td>
                <td><strong>₹{parseFloat(((billData?.amount || 500) + (billData?.amount || 300)) * 0.18).toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td className="text-end"><strong>Total</strong></td>
                <td><strong>₹{parseFloat(((billData?.amount || 500) + (billData?.amount || 300)) * 1.18).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </Table>

          <div className="bill-footer mt-4">
            <p className="mb-2"><strong>Payment Terms:</strong> Net 15 days</p>
            <p className="mb-2"><strong>Notes:</strong> Thank you for your devotion. May Goddess Sakthi bless you with prosperity and happiness.</p>
            <div className="text-center mt-4">
              <p>Authorized Signature</p>
              <div className="border-top pt-2" style={{width: '200px', margin: '0 auto'}}>
                <p className="mb-0">Omsakthi Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (fixed) */}
      <div className="thaniya-normal-footer d-flex justify-content-end gap-2 p-3 border-top">
        <button onClick={closeBillModal} className="s-btn s-btn-light">
          Close
        </button>
        <button onClick={downloadPdf} className="s-btn s-btn-grad-danger">
          <i className="fas fa-download me-2"></i> Download PDF
        </button>
      </div>
    </div>
  </div>
);


  // File Preview Modal
  const FileModal = () => {
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

  // Files Tab Content
  const FilesTabContent = () => {
    // Get all files from all income records
    const allFiles = incomes.flatMap(income => 
      income.files.map(file => ({ ...file, income }))
    );

    // Filter files based on search term
    const filteredFiles = useMemo(() => {
      if (!searchTermFiles) return allFiles;
      
      const lowerSearchTerm = searchTermFiles.toLowerCase();
      return allFiles.filter(file => 
        file.name.toLowerCase().includes(lowerSearchTerm) ||
        file.income.payer_name.toLowerCase().includes(lowerSearchTerm) ||
        file.income.description.toLowerCase().includes(lowerSearchTerm) ||
        file.income.date.includes(lowerSearchTerm) ||
        file.income.bill_id.toLowerCase().includes(lowerSearchTerm)
      );
    }, [allFiles, searchTermFiles]);

    if (allFiles.length === 0) {
      return (
        <Card>
          <Card.Body className="text-center py-5">
            <FileText size={48} className="text-muted mb-3" />
            <h5>No files uploaded yet</h5>
            <p className="text-muted">Upload files in the income records to view them here.</p>
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
                  <th>Income Record</th>
                  <th>Payer</th>
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
                    <td>#{file.income.id}</td>
                    <td>{file.income.payer_name}</td>
                    <td>{file.income.date}</td>
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
        activeMenu="Income Records"
        motherMenu="Finance"
        pageContent="Income Management"
      />

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Card>
          <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Nav variant="tabs" className="nav-tabs-bottom mb-0 me-3">
                <Nav.Item>
                  <Nav.Link eventKey="records">Income Records</Nav.Link>
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
                    placeholder="Search income records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              )}
            </div>
            
            <Button
              className="s-btn s-btn-grad-danger"
              onClick={openAddModal}
            >
              + Add Income
            </Button>
          </Card.Header>

          <Tab.Content>
            <Tab.Pane eventKey="records">
              <div className="s-card-body">
                {filteredIncomes.length === 0 ? (
                  <Alert variant="info" className="m-3">
                    {searchTerm ? 'No income records match your search.' : 'No income records found.'}
                  </Alert>
                ) : (
                  <Table responsive className="s-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Payer Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Payment Mode</th>
                        <th>Files</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncomes.map((income, index) => (
                        <tr key={income.id}>
                          <th>{income.id}</th>
                          <td>{income.date}</td>
                          <td>{income.payer_name}</td>
                          <td>{getCategoryName(income.category_id)}</td>
                          <td>${parseFloat(income.amount).toFixed(2)}</td>
                          <td>{getPaymentModeName(income.payment_mode_id)}</td>
                          <td>
                            {income.files.length > 0 ? (
                              <Badge bg="success">
                                <Paperclip size={12} className="me-1" />
                                {income.files.length}
                              </Badge>
                            ) : (
                              <Badge bg="secondary">None</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex">
                              <button
                                onClick={() => openBillModal(income)}
                                className="btn btn-bill shadow btn-xs sharp me-2"
                                title="View Bill"
                              >
                                <i className="fas fa-file-invoice"></i>
                              </button>
                              <button
                                onClick={() => openEditModal(income)}
                                className="btn btn-custom-blue shadow btn-xs sharp me-1"
                                title="Edit"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </button>
                              <button
                                onClick={() => openDeleteModal(income)}
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
      {showBillModal && <BillModal />}
      {showFileModal && <FileModal />}
    </Fragment>
  );
};

export default IncomeMaster;