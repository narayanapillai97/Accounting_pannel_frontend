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
import { 
  FileText,
  Download,
  Printer,
  RefreshCw
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PageTitle from "../../layouts/PageTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

const IncomeReport = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: '',
    paymentMode: '',
    status: ''
  });

  // Format date to YYYY-MM-DD for API
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  // Fetch data from API
  const fetchIncomeReport = async (fromDate, toDate) => {
    setIsFetching(true);
    setError(null);
    
    try {
      const fromDateStr = formatDate(fromDate) || formatDate(new Date());
      const toDateStr = formatDate(toDate) || formatDate(new Date());
      
      const response = await fetch(
        `${API_BASE_URL}/income/report/${fromDateStr}/${toDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authtoken')}`, // Adjust based on your auth
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setIncomes(data.report.data);
        setFilteredIncomes(data.report.data);
        
        // Extract unique categories, payment modes, etc. from the data
        const uniqueCategories = [...new Map(data.report.data.map(item => 
          [item.category_id, { id: item.category_id, name: item.category_name }]
        )).values()];
        
        const uniqueSubcategories = [...new Map(data.report.data.map(item => 
          [item.subcategory_id, { id: item.subcategory_id, name: item.sub_category_name }]
        )).values()];
        
        const uniqueVariants = [...new Map(data.report.data.map(item => 
          [item.variant_id, { id: item.variant_id, name: item.variant_name }]
        )).values()];
        
        const uniquePaymentModes = [...new Map(data.report.data.map(item => 
          [item.payment_mode_id, { id: item.payment_mode_id, name: item.payment_method }]
        )).values()];

        setCategories(uniqueCategories);
        setSubcategories(uniqueSubcategories);
        setVariants(uniqueVariants);
        setPaymentModes(uniquePaymentModes);
      } else {
        throw new Error(data.error || 'Failed to fetch income report');
      }
    } catch (err) {
      console.error('Error fetching income report:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    setFilters(prev => ({
      ...prev,
      startDate: oneMonthAgo,
      endDate: today
    }));
    
    fetchIncomeReport(oneMonthAgo, today);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...incomes];

    if (filters.startDate) {
      result = result.filter(item => new Date(item.date) >= filters.startDate);
    }

    if (filters.endDate) {
      result = result.filter(item => new Date(item.date) <= filters.endDate);
    }

    if (filters.category) {
      result = result.filter(item => item.category_id === parseInt(filters.category));
    }

    if (filters.paymentMode) {
      result = result.filter(item => item.payment_mode_id === parseInt(filters.paymentMode));
    }

    if (filters.status !== '') {
      result = result.filter(item => item.status === parseInt(filters.status));
    }

    setFilteredIncomes(result);
  }, [filters, incomes]);

  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : "N/A";
  };

  const getSubcategoryName = (id) => {
    const subcategory = subcategories.find(sc => sc.id === id);
    return subcategory ? subcategory.name : "N/A";
  };

  const getVariantName = (id) => {
    const variant = variants.find(v => v.id === id);
    return variant ? variant.name : "N/A";
  };

  const getPaymentModeName = (id) => {
    const mode = paymentModes.find(p => p.id === id);
    return mode ? mode.name : "N/A";
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="danger">Inactive</Badge>
    );
  };

  const handleRefresh = () => {
    if (filters.startDate && filters.endDate) {
      fetchIncomeReport(filters.startDate, filters.endDate);
    }
  };

  const downloadPdfReport = () => {
    const doc = new jsPDF();
    
    // Report title
    doc.setFontSize(18);
    doc.text("INCOME REPORT", 105, 15, { align: "center" });
    
    // Filters information
    doc.setFontSize(10);
    let yPosition = 25;
    
    if (filters.startDate || filters.endDate) {
      const dateRange = `Date Range: ${filters.startDate ? filters.startDate.toLocaleDateString() : 'All'} - ${filters.endDate ? filters.endDate.toLocaleDateString() : 'All'}`;
      doc.text(dateRange, 14, yPosition);
      yPosition += 5;
    }
    
    if (filters.category) {
      const categoryName = getCategoryName(parseInt(filters.category));
      doc.text(`Category: ${categoryName}`, 14, yPosition);
      yPosition += 5;
    }
    
    if (filters.paymentMode) {
      const paymentModeName = getPaymentModeName(parseInt(filters.paymentMode));
      doc.text(`Payment Mode: ${paymentModeName}`, 14, yPosition);
      yPosition += 5;
    }
    
    if (filters.status !== '') {
      const statusText = filters.status === '1' ? 'Active' : 'Inactive';
      doc.text(`Status: ${statusText}`, 14, yPosition);
      yPosition += 5;
    }
    
    // Add a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, yPosition + 2, 200, yPosition + 2);
    yPosition += 10;
    
    // Table headers
    const headers = [
      "Date",
      "Payer",
      "Category",
      "Amount (₹)",
      "Payment Mode",
      "Status"
    ];
    
    // Table data
    const data = filteredIncomes.map(income => [
      income.date,
      income.payer_name,
      getCategoryName(income.category_id),
      parseFloat(income.amount).toFixed(2),
      getPaymentModeName(income.payment_mode_id),
      income.status === 1 ? "Active" : "Inactive"
    ]);
    
    // Add total row
    const totalAmount = filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    data.push([
      { content: "TOTAL", colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
      parseFloat(totalAmount).toFixed(2),
      "",
      ""
    ]);
    
    // Generate table
    doc.autoTable({
      startY: yPosition,
      head: [headers],
      body: data,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [51, 122, 183] },
      columnStyles: {
        3: { halign: 'right' }
      }
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY);
    
    doc.save(`Income_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToExcel = () => {
    // Create CSV content
    let csvContent = "Date,Payer,Category,Subcategory,Variant,Description,Amount,Payment Mode,Bill ID,Status\n";
    
    filteredIncomes.forEach(income => {
      csvContent += [
        income.date,
        `"${income.payer_name}"`,
        `"${getCategoryName(income.category_id)}"`,
        `"${getSubcategoryName(income.subcategory_id)}"`,
        `"${getVariantName(income.variant_id)}"`,
        `"${income.description}"`,
        parseFloat(income.amount).toFixed(2),
        `"${getPaymentModeName(income.payment_mode_id)}"`,
        income.bill_id,
        income.status === 1 ? "Active" : "Inactive"
      ].join(',') + '\n';
    });
    
    // Calculate total
    const totalAmount = filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    csvContent += `,,,,,,Total:,${parseFloat(totalAmount).toFixed(2)},,\n`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Income_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters(prev => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));

    // Fetch new data when date range changes
    if (start && end) {
      fetchIncomeReport(start, end);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" className="me-2" />
        Loading income report...
      </div>
    );
  }

  return (
    <Fragment>
      <PageTitle activeMenu="Income Report" motherMenu="Finance" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Income Report</Card.Title>
              <div>
                <Button 
                  variant="outline-primary" 
                  className="me-2" 
                  onClick={handleRefresh}
                  disabled={isFetching}
                >
                  <RefreshCw size={16} className={isFetching ? "spinning" : ""} />
                  {isFetching ? ' Refreshing...' : ' Refresh'}
                </Button>
                <Button variant="primary" className="me-2" onClick={exportToExcel}>
                  <Download size={16} className="me-1" />
                  Export to Excel
                </Button>
                <Button variant="danger" onClick={downloadPdfReport}>
                  <Download size={16} className="me-1" />
                  Download PDF
                </Button>
              </div>
            </Card.Header>

            <Card.Body id="income-report-content">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date Range</Form.Label>
                    <DatePicker
                      selectsRange={true}
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      onChange={handleDateChange}
                      isClearable={true}
                      className="form-control"
                      placeholderText="Select start and end date"
                      dateFormat="MM/dd/yyyy"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Payment Mode</Form.Label>
                    <Form.Select
                      name="paymentMode"
                      value={filters.paymentMode}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Modes</option>
                      {paymentModes.map(mode => (
                        <option key={mode.id} value={mode.id}>
                          {mode.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Card.Title>Income Details</Card.Title>
                      <div className="text-end">
                        <strong>Total: ₹{filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0).toFixed(2)}</strong>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Date</th>
                              <th>Payer</th>
                              <th>Category</th>
                              <th>Subcategory</th>
                              <th>Description</th>
                              <th>Amount (₹)</th>
                              <th>Payment Mode</th>
                              <th>Bill ID</th>
                              <th>Status</th>
                              <th>Receipt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredIncomes.length > 0 ? (
                              filteredIncomes.map((income, index) => (
                                <tr key={income.id || index}>
                                  <td>{index + 1}</td>
                                  <td>{income.date}</td>
                                  <td>{income.payer_name}</td>
                                  <td>{getCategoryName(income.category_id)}</td>
                                  <td>{getSubcategoryName(income.subcategory_id)}</td>
                                  <td>{income.description}</td>
                                  <td className="text-end">{parseFloat(income.amount).toFixed(2)}</td>
                                  <td>{getPaymentModeName(income.payment_mode_id)}</td>
                                  <td>{income.bill_code || income.bill_id || 'N/A'}</td>
                                  <td>{getStatusBadge(income.status)}</td>
                                  <td>
                                    <Button
                                      variant="info"
                                      size="sm"
                                      onClick={() => {
                                        const doc = new jsPDF();
                                        
                                        // Receipt content
                                        doc.setFontSize(18);
                                        doc.text("INCOME RECEIPT", 105, 15, { align: "center" });
                                        
                                        doc.setFontSize(12);
                                        doc.text(`Payer: ${income.payer_name}`, 14, 25);
                                        doc.text(`Date: ${income.date}`, 14, 32);
                                        doc.text(`Receipt #: ${income.bill_code || income.bill_id || "N/A"}`, 14, 39);
                                        
                                        doc.autoTable({
                                          startY: 50,
                                          head: [["Description", "Category", "Amount"]],
                                          body: [
                                            [income.description, getCategoryName(income.category_id), `₹${parseFloat(income.amount).toFixed(2)}`],
                                            ["Total", "", `₹${parseFloat(income.amount).toFixed(2)}`]
                                          ],
                                          styles: { fontSize: 10 },
                                          headStyles: { fillColor: [51, 122, 183] },
                                          columnStyles: { 2: { halign: 'right' } }
                                        });
                                        
                                        const finalY = doc.lastAutoTable.finalY + 10;
                                        doc.text(`Payment Method: ${getPaymentModeName(income.payment_mode_id)}`, 14, finalY);
                                        doc.text("Thank you!", 105, finalY + 10, { align: "center" });
                                        
                                        doc.save(`Income_Receipt_${income.bill_code || income.bill_id || income.id}.pdf`);
                                      }}
                                    >
                                      <FileText size={14} />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="11" className="text-center">
                                  {isFetching ? 'Loading data...' : 'No incomes found matching your filters'}
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

      <style jsx>{`
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

export default IncomeReport;