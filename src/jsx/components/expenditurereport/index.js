import React, { useState, useEffect, Fragment } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Badge,
  Alert,
  Spinner
} from "react-bootstrap";
import { FileText, Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PageTitle from "../../layouts/PageTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

const ExpenditureReport = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [filteredExpenditures, setFilteredExpenditures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category_id: "",
    payment_mode_id: "",
  });
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalAmount: 0,
    fromDate: "",
    toDate: ""
  });

  // Fetch categories and payment modes
useEffect(() => { 
  const fetchMasterData = async () => {
    try {
      const token = localStorage.getItem("authtoken");

      const [categoriesRes, paymentModesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/maincategory/get`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(res => res.json()),

        fetch(`${API_BASE_URL}/paymode/get`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(res => res.json()),
      ]);

      // ✅ Directly set arrays
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || []);
      setPaymentModes(Array.isArray(paymentModesRes) ? paymentModesRes : paymentModesRes.data || []);

    } catch (err) {
      console.error("Error fetching master data:", err);
      setError("Failed to load master data");
    } finally {
      setIsInitialLoading(false);
    }
  };

  fetchMasterData();
}, []);



  // Fetch expenditure report
  const fetchExpenditureReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format dates for API
      const fromDate = filters.startDate.toISOString().split('T')[0];
      const toDate = filters.endDate.toISOString().split('T')[0];

      // Build query parameters
      const params = new URLSearchParams();
      params.append('fromDate', fromDate);
      params.append('toDate', toDate);
      
      if (filters.category_id) {
        params.append('category_id', filters.category_id);
      }
      
      if (filters.payment_mode_id) {
        params.append('payment_mode_id', filters.payment_mode_id);
      }

      const token = localStorage.getItem('authtoken'); // Assuming you use token-based auth
      const response = await fetch(
        `${API_BASE_URL}/expenditure/report/${fromDate}/${toDate}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setExpenditures(data.report.data);
        setFilteredExpenditures(data.report.data);
        setSummary(data.report.summary);
      } else {
        throw new Error(data.error || "Failed to fetch report");
      }
    } catch (err) {
      console.error("Error fetching expenditure report:", err);
      setError(err.message || "Failed to load expenditure report");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply local filters (for client-side filtering after API call)
  useEffect(() => {
    let result = [...expenditures];

    // Note: Date filtering is already done by API, but we keep it for client-side changes
    if (filters.category_id) {
      result = result.filter(
        (item) => item.category_id === parseInt(filters.category_id)
      );
    }

    if (filters.payment_mode_id) {
      result = result.filter(
        (item) => item.payment_mode_id === parseInt(filters.payment_mode_id)
      );
    }

    setFilteredExpenditures(result);
    
    // Update summary for filtered results
    const totalAmount = result.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    setSummary(prev => ({
      ...prev,
      totalRecords: result.length,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    }));
  }, [filters.category_id, filters.payment_mode_id, expenditures]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters({
      ...filters,
      startDate: start,
      endDate: end,
    });
  };

  const handleGenerateReport = () => {
    if (!filters.startDate || !filters.endDate) {
      setError("Please select both start and end dates");
      return;
    }
    fetchExpenditureReport();
  };

  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.category_name : "N/A";
  };

  const getPaymentModeName = (id) => {
    const mode = paymentModes.find((p) => p.id === id);
    return mode ? mode.payment_method : "N/A";
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="danger">Inactive</Badge>
    );
  };

  const downloadPdfReport = () => {
    const doc = new jsPDF();

    // Report title
    doc.setFontSize(18);
    doc.text("EXPENDITURE REPORT", 105, 15, { align: "center" });

    // Report period
    doc.setFontSize(10);
    let yPosition = 25;

    if (summary.fromDate && summary.toDate) {
      doc.text(`Report Period: ${summary.fromDate} to ${summary.toDate}`, 14, yPosition);
      yPosition += 5;
    }

    if (filters.category_id) {
      const categoryName = getCategoryName(parseInt(filters.category_id));
      doc.text(`Category: ${categoryName}`, 14, yPosition);
      yPosition += 5;
    }

    if (filters.payment_mode_id) {
      const paymentModeName = getPaymentModeName(parseInt(filters.payment_mode_id));
      doc.text(`Payment Mode: ${paymentModeName}`, 14, yPosition);
      yPosition += 5;
    }

    // Summary
    doc.text(`Total Records: ${summary.totalRecords}`, 14, yPosition);
    yPosition += 5;
    doc.text(`Total Amount: ₹${summary.totalAmount.toFixed(2)}`, 14, yPosition);
    yPosition += 10;

    // Add a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, yPosition, 200, yPosition);
    yPosition += 15;

    // Table headers
    const headers = [
      "Date",
      "Payee",
      "Category",
      "Description",
      "Amount (₹)",
      "Payment Mode",
      "Status",
    ];

    // Table data
    const data = filteredExpenditures.map((exp) => [
      exp.expenditure_date || exp.date,
      exp.payee_name,
      exp.category_name || getCategoryName(exp.category_id),
      exp.description,
      parseFloat(exp.amount).toFixed(2),
      exp.payment_method || getPaymentModeName(exp.payment_mode_id),
      exp.status === 1 ? "Active" : "Inactive",
    ]);

    // Generate table
    doc.autoTable({
      startY: yPosition,
      head: [headers],
      body: data,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [51, 122, 183] },
      columnStyles: {
        4: { halign: "right" },
      },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY);

    doc.save(`Expenditure_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToExcel = () => {
    // Create CSV content
    let csvContent = "Date,Payee,Category,Description,Amount,Payment Mode,Bill ID,Status\n";

    filteredExpenditures.forEach((exp) => {
      csvContent +=
        [
          exp.expenditure_date || exp.date,
          `"${exp.payee_name}"`,
          `"${exp.category_name || getCategoryName(exp.category_id)}"`,
          `"${exp.description}"`,
          parseFloat(exp.amount).toFixed(2),
          `"${exp.payment_method || getPaymentModeName(exp.payment_mode_id)}"`,
          exp.bill_id,
          exp.status === 1 ? "Active" : "Inactive",
        ].join(",") + "\n";
    });

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Expenditure_Report_${summary.fromDate}_to_${summary.toDate}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadReceipt = (exp) => {
    const doc = new jsPDF();

    // Receipt content
    doc.setFontSize(18);
    doc.text("EXPENSE RECEIPT", 105, 15, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(`Payee: ${exp.payee_name}`, 14, 25);
    doc.text(`Date: ${exp.expenditure_date || exp.date}`, 14, 32);
    doc.text(`Receipt #: ${exp.bill_id || "N/A"}`, 14, 39);
    doc.text(`Category: ${exp.category_name || getCategoryName(exp.category_id)}`, 14, 46);

    doc.autoTable({
      startY: 55,
      head: [["Description", "Amount"]],
      body: [
        [exp.description, `₹${parseFloat(exp.amount).toFixed(2)}`],
        ["Total", `₹${parseFloat(exp.amount).toFixed(2)}`],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 122, 183] },
      columnStyles: { 1: { halign: "right" } },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Payment Method: ${exp.payment_method || getPaymentModeName(exp.payment_mode_id)}`, 14, finalY);
    doc.text("Thank you for your business!", 105, finalY + 10, { align: "center" });

    doc.save(`Receipt_${exp.bill_id || exp.id}.pdf`);
  };

  if (isInitialLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Fragment>
      <PageTitle activeMenu="Expenditure Report" motherMenu="Finance" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Expenditure Report</Card.Title>
              <div>
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={exportToExcel}
                  disabled={filteredExpenditures.length === 0}
                >
                  <Download size={16} className="me-1" />
                  Export to Excel
                </Button>
                <Button
                  variant="danger"
                  className="me-2"
                  onClick={downloadPdfReport}
                  disabled={filteredExpenditures.length === 0}
                >
                  <Download size={16} className="me-1" />
                  Download PDF
                </Button>
              </div>
            </Card.Header>

            <Card.Body id="expenditure-report-content">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Row className="mb-4">
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      selected={filters.startDate}
                      onChange={(date) => setFilters({...filters, startDate: date})}
                      selectsStart
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      className="form-control"
                      placeholderText="Start Date"
                      dateFormat="MM/dd/yyyy"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                      selected={filters.endDate}
                      onChange={(date) => setFilters({...filters, endDate: date})}
                      selectsEnd
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      minDate={filters.startDate}
                      className="form-control"
                      placeholderText="End Date"
                      dateFormat="MM/dd/yyyy"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category_id"
                      value={filters.category_id}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name || category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Payment Mode</Form.Label>
                    <Form.Select
                      name="payment_mode_id"
                      value={filters.payment_mode_id}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Modes</option>
                      {paymentModes.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                          {mode.payment_method || mode.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>&nbsp;</Form.Label>
                    <Button 
                      variant="success" 
                      className="w-100 mt-2"
                      onClick={handleGenerateReport}
                      disabled={isLoading || !filters.startDate || !filters.endDate}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Loading...
                        </>
                      ) : (
                        "Generate Report"
                      )}
                    </Button>
                  </Form.Group>
                </Col>
              </Row>

              {summary.totalRecords > 0 && (
                <Row className="mb-3">
                  <Col>
                    <Alert variant="info">
                      <strong>Report Summary:</strong> {summary.totalRecords} records found | 
                      Total Amount: <strong>₹{summary.totalAmount.toFixed(2)}</strong> | 
                      Period: {summary.fromDate} to {summary.toDate}
                    </Alert>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={12}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Expenditure Details</Card.Title>
                      <div className="text-end">
                        <strong>
                          Total: ₹{summary.totalAmount.toFixed(2)}
                        </strong>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Date</th>
                              <th>Payee</th>
                              <th>Category</th>
                              <th>Description</th>
                              <th>Amount (₹)</th>
                              <th>Payment Mode</th>
                              <th>Bill ID</th>
                              <th>Status</th>
                              <th>Receipt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredExpenditures.length > 0 ? (
                              filteredExpenditures.map((exp, index) => (
                                <tr key={exp.id}>
                                  <td>{index + 1}</td>
                                  <td>{exp.expenditure_date || exp.date}</td>
                                  <td>{exp.payee_name}</td>
                                  <td>{exp.category_name || getCategoryName(exp.category_id)}</td>
                                  <td>{exp.description}</td>
                                  <td className="text-end">
                                    {parseFloat(exp.amount).toFixed(2)}
                                  </td>
                                  <td>
                                    {exp.payment_method || getPaymentModeName(exp.payment_mode_id)}
                                  </td>
                                  <td>{exp.bill_id}</td>
                                  <td>{getStatusBadge(exp.status)}</td>
                                  <td>
                                    <Button
                                      variant="info"
                                      size="sm"
                                      onClick={() => downloadReceipt(exp)}
                                    >
                                      <FileText size={14} />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="10" className="text-center">
                                  {isLoading ? (
                                    <Spinner animation="border" size="sm" className="me-2" />
                                  ) : (
                                    "No expenditures found. Generate a report to see data."
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ExpenditureReport;