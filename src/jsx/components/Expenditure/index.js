import React, { Fragment, useState,useMemo, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Form,
  Badge,
  Alert,
  Image,
  InputGroup
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
  Upload,
  Search
} from "lucide-react";
import Data from "../../../../src/jsx/components/data/data.json";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
  const [billPreview, setBillPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    paymentMode: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });

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
    bill_file: null,
    bill_url: "",
    status: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [expenditures, setExpenditures] = useState(
    Data["expenditures"]?.map((item, index) => ({
      id: index + 1,
      date: item.date,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      variant_id: item.variant_id,
      payee_name: item.payee_name,
      description: item.description,
      amount: item.amount,
      payment_mode_id: item.payment_mode_id,
      bill_id: item.bill_id,
      bill_url: item.bill_url || "",
      status: item.status === 1 ? 1 : 0,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    })) || []
  );

    const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "N/A";
  };

  const getPaymentModeName = (id) => {
    const mode = paymentModes.find((p) => p.id === id);
    return mode ? mode.name : "N/A";
  };

  // Load dropdown data
  useEffect(() => {
    setCategories(Data["categories"] || []);
    setSubcategories(Data["subcategories"] || []);
    setVariants(Data["variants"] || []);
    setPaymentModes(Data["payment_modes"] || []);
  }, []);

  const validateForm = (expenditureData) => {
    const newErrors = {};
    if (!expenditureData.date) newErrors.date = "Please select date";
    if (!expenditureData.category_id)
      newErrors.category_id = "Please select category";
    if (!expenditureData.payee_name.trim())
      newErrors.payee_name = "Please enter payer name";
    if (!expenditureData.amount || isNaN(expenditureData.amount))
      newErrors.amount = "Please enter valid amount";
    if (!expenditureData.payment_mode_id)
      newErrors.payment_mode_id = "Please select payment mode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview for images
    if (file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (isEdit) {
          setSelectedExpenditure({
            ...selectedExpenditure,
            bill_file: file,
            bill_preview: event.target.result,
          });
        } else {
          setNewExpenditure({
            ...newExpenditure,
            bill_file: file,
            bill_preview: event.target.result,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (isEdit) {
        setSelectedExpenditure({
          ...selectedExpenditure,
          bill_file: file,
          bill_preview: null,
        });
      } else {
        setNewExpenditure({
          ...newExpenditure,
          bill_file: file,
          bill_preview: null,
        });
      }
    }
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
      bill_file: null,
      bill_url: "",
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setBillPreview(null);
    setErrors({});
    setShowAddModal(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const openEditModal = (expenditure) => {
    setSelectedExpenditure({ ...expenditure });
    setBillPreview(expenditure.bill_url || null);
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
      setBillPreview(null);
      setErrors({});
    }, 300);
  };

  const handleDelete = () => {
    setExpenditures(expenditures.filter((exp) => exp.id !== selectedExpenditure.id));
    closeModal();
  };
  const filteredExpenditures = useMemo(() => {
    return expenditures.filter((expenditure) => {
      // Text search across multiple fields
      const matchesSearchTerm = 
        !searchTerm ||
        expenditure.payee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expenditure.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expenditure.bill_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(expenditure.category_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPaymentModeName(expenditure.payment_mode_id).toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by category
      const matchesCategory = 
        !searchFilters.category || 
        expenditure.category_id.toString() === searchFilters.category;

      // Filter by payment mode
      const matchesPaymentMode = 
        !searchFilters.paymentMode || 
        expenditure.payment_mode_id.toString() === searchFilters.paymentMode;

      // Filter by date range
      const expenditureDate = new Date(expenditure.date);
      const fromDate = searchFilters.dateFrom ? new Date(searchFilters.dateFrom) : null;
      const toDate = searchFilters.dateTo ? new Date(searchFilters.dateTo) : null;
      
      const matchesDateRange = 
        (!fromDate || expenditureDate >= fromDate) &&
        (!toDate || expenditureDate <= toDate);

      // Filter by amount range
      const amount = parseFloat(expenditure.amount);
      const minAmount = searchFilters.amountMin ? parseFloat(searchFilters.amountMin) : 0;
      const maxAmount = searchFilters.amountMax ? parseFloat(searchFilters.amountMax) : Number.MAX_SAFE_INTEGER;
      
      const matchesAmountRange = 
        amount >= minAmount && 
        amount <= maxAmount;

      return (
        matchesSearchTerm &&
        matchesCategory &&
        matchesPaymentMode &&
        matchesDateRange &&
        matchesAmountRange
      );
    });
  }, [expenditures, searchTerm, searchFilters, categories, paymentModes]);

  // Clear all search filters
  const clearSearchFilters = () => {
    setSearchTerm("");
    setSearchFilters({
      category: "",
      paymentMode: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    });
  };


  const handleAddExpenditure = () => {
    if (!validateForm(newExpenditure)) return;

    const newId =
      expenditures.length > 0 ? Math.max(...expenditures.map((i) => i.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    // In a real app, you would upload the file here and get the URL
    const newExp = { 
      ...newExpenditure, 
      id: newId,
      bill_url: newExpenditure.bill_preview || "",
      created_at: now,
      updated_at: now
    };
    
    setExpenditures([...expenditures, newExp]);
    closeModal();
  };

  const handleUpdateExpenditure = () => {
    if (!validateForm(selectedExpenditure)) return;

    // In a real app, you would upload the new file here if changed
    const updatedExp = {
      ...selectedExpenditure,
      bill_url: selectedExpenditure.bill_preview || selectedExpenditure.bill_url,
      updated_at: new Date().toISOString()
    };

    setExpenditures(
      expenditures.map((i) => 
        i.id === updatedExp.id ? updatedExp : i
      )
    );
    closeModal();
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

  const downloadPdf = () => {
    if (!billData) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("EXPENSE RECEIPT", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Your Company Name", 105, 22, { align: "center" });
    doc.text("123 Street, City, Country", 105, 28, { align: "center" });

    // Bill Info
    doc.setFontSize(11);
    doc.text(`Paid To: ${billData?.payee_name || ''}`, 14, 40);
    doc.text(`Receipt #: ${billData?.bill_id || 'N/A'}`, 140, 40);
    doc.text(`Date: ${billData?.date || ''}`, 140, 46);

    // Table Data
    const tableData = [
      [
        billData?.description || "Expense payment",
        getCategoryName(billData?.category_id),
        `$${parseFloat(billData?.amount || 0).toFixed(2)}`
      ],
      [
        { content: "Total", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
        `$${parseFloat(billData?.amount || 0).toFixed(2)}`
      ]
    ];

    doc.autoTable({
      startY: 55,
      head: [["Description", "Category", "Amount"]],
      body: tableData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [244, 67, 54] }
    });

    // Add bill info if available
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Payment Method: ${getPaymentModeName(billData?.payment_mode_id)}`, 14, finalY);
    
    if (billData?.bill_url) {
      doc.text("Original bill is attached to this record", 14, finalY + 10);
    }
    
    doc.text("Thank you for your business!", 105, finalY + (billData?.bill_url ? 20 : 10), { align: "center" });

    doc.save(`Expense_${billData?.bill_id || billData?.id || "receipt"}.pdf`);
  };

  // Add Expenditure Modal
const AddModal = () => {
  const initialForm = {
    date: "",
    category_id: "",
    subcategory_id: "",
    variant_id: "",
    description: "",
    payee_name: "",
    amount: "",
    payment_mode_id: "",
    bill_id: "",
    files: [],
  };

  const [newExpenditure, setNewExpenditure] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleReset = () => {
    setNewExpenditure(initialForm);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    closeModal();
  };

  const handleAddExpenditure = () => {
    if (!validateForm(newExpenditure)) return;

    const newId =
      expenditures.length > 0
        ? Math.max(...expenditures.map((e) => e.id)) + 1
        : 1;
    setExpenditures([...expenditures, { ...newExpenditure, id: newId }]);
    handleReset();
    closeModal();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewExpenditure((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };

  const removeFile = (fileIndex) => {
    setNewExpenditure((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== fileIndex),
    }));
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
          <h2 className="thaniya-normal-title">Add Expenditure Record</h2>
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
                      value={newExpenditure.date}
                      onChange={(e) =>
                        setNewExpenditure({
                          ...newExpenditure,
                          date: e.target.value,
                        })
                      }
                      isInvalid={!!errors.date}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.date}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    className="form-control-lg"
                    value={newExpenditure.category_id}
                    onChange={(e) =>
                      setNewExpenditure({
                        ...newExpenditure,
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
                  <Form.Control.Feedback type="invalid">
                    {errors.category_id}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Subcategory */}
                <Form.Group className="mb-3">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Select
                    className="form-control-lg"
                    value={newExpenditure.subcategory_id}
                    onChange={(e) =>
                      setNewExpenditure({
                        ...newExpenditure,
                        subcategory_id: e.target.value,
                        variant_id: "",
                      })
                    }
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories
                      .filter(
                        (sc) =>
                          sc.category_id === parseInt(newExpenditure.category_id)
                      )
                      .map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                {/* Variant */}
                <Form.Group className="mb-3">
                  <Form.Label>Variant</Form.Label>
                  <Form.Select
                    className="form-control-lg"
                    value={newExpenditure.variant_id}
                    onChange={(e) =>
                      setNewExpenditure({ ...newExpenditure, variant_id: e.target.value })
                    }
                  >
                    <option value="">Select Variant</option>
                    {variants
                      .filter(
                        (v) =>
                          v.subcategory_id === parseInt(newExpenditure.subcategory_id)
                      )
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="form-control-lg"
                    placeholder="Enter description"
                    value={newExpenditure.description}
                    onChange={(e) =>
                      setNewExpenditure({ ...newExpenditure, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                {/* Payee Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Payee Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter payee name"
                    value={newExpenditure.payee_name}
                    onChange={(e) =>
                      setNewExpenditure({ ...newExpenditure, payee_name: e.target.value })
                    }
                    isInvalid={!!errors.payee_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.payee_name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Amount */}
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-lg"
                    placeholder="Enter amount"
                    value={newExpenditure.amount}
                    onChange={(e) =>
                      setNewExpenditure({ ...newExpenditure, amount: e.target.value })
                    }
                    isInvalid={!!errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Payment Mode */}
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select
                    className="form-control-lg"
                    value={newExpenditure.payment_mode_id}
                    onChange={(e) =>
                      setNewExpenditure({ ...newExpenditure, payment_mode_id: e.target.value })
                    }
                    isInvalid={!!errors.payment_mode_id}
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModes.map((pm) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.payment_mode_id}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Bill/Receipt ID */}
                <Form.Group className="mb-3">
                  <Form.Label>Bill/Receipt ID</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg"
                    placeholder="Enter bill/receipt ID"
                    value={newExpenditure.bill_id}
                    onChange={(e) =>
                      setNewExpenditure({ ...newExpenditure, bill_id: e.target.value })
                    }
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
                    You can attach multiple files (bills, receipts, etc.)
                  </Form.Text>
                </Form.Group>

                {/* File List */}
                {newExpenditure.files.length > 0 && (
                  <div className="mb-3">
                    <h6>Attached Files:</h6>
                    <ul className="list-group">
                      {newExpenditure.files.map((file, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span className="text-truncate" style={{ maxWidth: "70%" }}>
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
          <button onClick={handleAddExpenditure} className="s-btn s-btn-grad-danger">
            Save Expenditure
          </button>
        </div>
      </div>
    </div>
  );
};


  // Edit Expenditure Modal
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
                  <select
                    className="form-control form-control-lg"
                    value={selectedExpenditure?.category_id || ""}
                    onChange={(e) =>
                      setSelectedExpenditure({
                        ...selectedExpenditure,
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
                    value={selectedExpenditure?.subcategory_id || ""}
                    onChange={(e) =>
                      setSelectedExpenditure({
                        ...selectedExpenditure,
                        subcategory_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories
                      .filter(
                        (sc) =>
                          sc.category_id ===
                          parseInt(selectedExpenditure?.category_id || 0)
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
                    value={selectedExpenditure?.variant_id || ""}
                    onChange={(e) =>
                      setSelectedExpenditure({
                        ...selectedExpenditure,
                        variant_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Variant</option>
                    {variants
                      .filter(
                        (v) =>
                          v.subcategory_id ===
                          parseInt(selectedExpenditure?.subcategory_id || 0)
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
                  <Form.Label>Payer Name</Form.Label>
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
                    <select
                      className="form-control form-control-lg"
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
                  <Form.Label>Upload Bill/Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    className="form-control-lg"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                  {(selectedExpenditure?.bill_preview || selectedExpenditure?.bill_url) && (
                    <div className="mt-2">
                      <Image
                        src={selectedExpenditure?.bill_preview || selectedExpenditure?.bill_url}
                        thumbnail
                        style={{ maxHeight: "150px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Bill+Preview";
                        }}
                      />
                    </div>
                  )}
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
            onClick={handleUpdateExpenditure}
            className="s-btn s-btn-grad-danger"
          >
            Update Expenditure
          </button>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
      <div
        className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`}
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

  const BillModal = () => (
    <div className={`thaniya-normal-overlay ${isAnimating ? "thaniya-overlay-visible" : ""}`}>
      <div className="thaniya-normal-backdrop" onClick={closeBillModal}></div>
      <div
        className={`thaniya-normal-modal ${isAnimating ? "thaniya-normal-modal-visible" : ""}`}
        style={{ maxWidth: "800px" }}
      >
        <div className="thaniya-normal-header">
          <h2 className="thaniya-normal-title">Bill/Receipt</h2>
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
                <p><strong>Paid To:</strong></p>
                <p>{billData?.payee_name}</p>
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
              <p>Payment Method: {getPaymentModeName(billData?.payment_mode_id)}</p>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
        <div className="thaniya-normal-footer">
          <button onClick={closeBillModal} className="s-btn s-btn-light">
            Close
          </button>
          <button onClick={downloadPdf} className="s-btn s-btn-grad-danger">
            <FileText size={16} className="me-2" />
            Download PDF
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

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="s-card-header d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Expenditure Records</Card.Title>
              </div>
                    <InputGroup style={{ width: '300px' }}>
                                  <InputGroup.Text>
                                    <Search size={16} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="text"
                                    placeholder="Search Expenditure records..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                                </InputGroup>
              <Button
                className="s-btn s-btn-grad-danger"
                onClick={openAddModal}
              >
                + Add Expenditure
              </Button>
            </Card.Header>
           

            <div className="s-card-body">
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
                  {expenditures.map((expenditure, index) => (
                    <tr key={expenditure.id}>
                      <th>{expenditure.id}</th>
                      <td>{expenditure.date}</td>
                      <td>{expenditure.payee_name}</td>
                      <td>{getCategoryName(expenditure.category_id)}</td>
                      <td>${parseFloat(expenditure.amount).toFixed(2)}</td>
                      <td>{getPaymentModeName(expenditure.payment_mode_id)}</td>
                      <td>
                                                {expenditure.files?.length > 0 ? (
                                                  <Badge bg="success">
                                                    <Paperclip size={12} className="me-1" />
                                                    {expenditure.files?.length}
                                                  </Badge>
                                                ) : (
                                                  <Badge bg="secondary">None</Badge>
                                                )}
                                              </td>
                      <td>
                        <div className="d-flex">
                    
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
            </div>
          </Card>
        </Col>
      </Row>

      {showAddModal && <AddModal />}
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
      {showBillModal && <BillModal />}
    </Fragment>
  );
};

export default ExpenditureMaster;