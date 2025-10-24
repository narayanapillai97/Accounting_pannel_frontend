import React, { useState, useEffect, Fragment } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Table,
  Form,
  Alert,
  Spinner,
  Badge
} from "react-bootstrap";
import { 
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PageTitle from "../../layouts/PageTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfitAndLossReport = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    endDate: new Date() // Today
  });

  // API base URL - adjust according to your setup
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

  // Fetch profit & loss data from API
  const fetchProfitLossData = async (startDate, endDate) => {
    try {
      setIsLoading(true);
      setError(null);

      const fromDate = startDate.toISOString().split('T')[0];
      const toDate = endDate.toISOString().split('T')[0];

      const response = await fetch(
        `${API_BASE_URL}/profit-loss/summary/${fromDate}/${toDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authtoken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setReportData(data.summary);
      } else {
        throw new Error(data.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching profit & loss data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchProfitLossData(filters.startDate, filters.endDate);
    }
  }, [filters.startDate, filters.endDate]);

  // Handle date range change
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters({
      startDate: start,
      endDate: end
    });
  };

  // Download PDF Report
  const downloadPdfReport = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    
    // Report title
    doc.setFontSize(18);
    doc.text("PROFIT AND LOSS STATEMENT", 105, 15, { align: "center" });
    
    // Period information
    doc.setFontSize(10);
    let yPosition = 25;
    
    const dateRange = `Period: ${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`;
    doc.text(dateRange, 14, yPosition);
    yPosition += 5;
    
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, yPosition);
    yPosition += 10;
    
    // Financial Summary
    doc.setFontSize(14);
    doc.text("FINANCIAL SUMMARY", 14, yPosition);
    yPosition += 8;
    
    // Summary table
    doc.autoTable({
      startY: yPosition,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Total Income", parseFloat(reportData.financials.totalIncome).toFixed(2)],
        ["Total Expenditure", parseFloat(reportData.financials.totalExpenditure).toFixed(2)],
        [
          `Net ${reportData.financials.isProfit ? "Profit" : "Loss"}`,
          parseFloat(reportData.financials.netProfitLoss).toFixed(2)
        ]
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [51, 122, 183] },
      columnStyles: { 1: { halign: 'right' } },
   didDrawCell: (data) => {
  if (data.section === 'body' && data.row.index === 2) {
    if (reportData.financials.isProfit) {
      doc.setFillColor(220, 255, 220); // Light green
    } else {
      doc.setFillColor(255, 220, 220); // Light red
    }
    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
  }
}

    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Income by Category
    if (Object.keys(reportData.breakdown.incomeByCategory).length > 0) {
      doc.setFontSize(12);
      doc.text("INCOME BY CATEGORY", 14, yPosition);
      yPosition += 6;
      
      const incomeData = Object.entries(reportData.breakdown.incomeByCategory).map(([category, amount]) => [
        category,
        parseFloat(amount).toFixed(2)
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [["Category", "Amount (₹)"]],
        body: incomeData,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [34, 139, 34] },
        columnStyles: { 1: { halign: 'right' } }
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }
    
    // Expenditure by Category
    if (Object.keys(reportData.breakdown.expenditureByCategory).length > 0) {
      doc.setFontSize(12);
      doc.text("EXPENDITURE BY CATEGORY", 14, yPosition);
      yPosition += 6;
      
      const expenseData = Object.entries(reportData.breakdown.expenditureByCategory).map(([category, amount]) => [
        category,
        parseFloat(amount).toFixed(2)
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [["Category", "Amount (₹)"]],
        body: expenseData,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [220, 53, 69] },
        columnStyles: { 1: { halign: 'right' } }
      });
    }
    
    doc.save(`Profit_Loss_${filters.startDate.toISOString().slice(0, 10)}_to_${filters.endDate.toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Excel/CSV
  const exportToExcel = () => {
    if (!reportData) return;

    let csvContent = "Category,Amount (₹)\n";
    
    // Financial Summary
    csvContent += "FINANCIAL SUMMARY\n";
    csvContent += `Total Income,${parseFloat(reportData.financials.totalIncome).toFixed(2)}\n`;
    csvContent += `Total Expenditure,${parseFloat(reportData.financials.totalExpenditure).toFixed(2)}\n`;
    csvContent += `Net ${reportData.financials.isProfit ? "Profit" : "Loss"},${parseFloat(reportData.financials.netProfitLoss).toFixed(2)}\n\n`;
    
    // Income by Category
    csvContent += "INCOME BY CATEGORY\n";
    Object.entries(reportData.breakdown.incomeByCategory).forEach(([category, amount]) => {
      csvContent += `${category},${parseFloat(amount).toFixed(2)}\n`;
    });
    
    csvContent += "\n";
    
    // Expenditure by Category
    csvContent += "EXPENDITURE BY CATEGORY\n";
    Object.entries(reportData.breakdown.expenditureByCategory).forEach(([category, amount]) => {
      csvContent += `${category},${parseFloat(amount).toFixed(2)}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Profit_Loss_${filters.startDate.toISOString().slice(0, 10)}_to_${filters.endDate.toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick date range presets
  const applyQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setFilters({
      startDate: start,
      endDate: end
    });
  };

  if (isLoading && !reportData) {
    return (
      <Fragment>
        <PageTitle activeMenu="Profit & Loss Report" motherMenu="Finance" />
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading Profit & Loss Report...</p>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <PageTitle activeMenu="Profit & Loss Report" motherMenu="Finance" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>
                <BarChart3 size={20} className="me-2" />
                Profit & Loss Statement
              </Card.Title>
              <div>
                <Button 
                  variant="outline-primary" 
                  className="me-2" 
                  onClick={exportToExcel}
                  disabled={!reportData}
                >
                  <Download size={16} className="me-1" />
                  Export CSV
                </Button>
                <Button 
                  variant="danger" 
                  onClick={downloadPdfReport}
                  disabled={!reportData}
                >
                  <FileText size={16} className="me-1" />
                  Download PDF
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              {/* Quick Filters */}
              <Row className="mb-3">
                <Col md={12}>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => applyQuickFilter(7)}
                    >
                      Last 7 Days
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => applyQuickFilter(30)}
                    >
                      Last 30 Days
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                        const end = new Date();
                        setFilters({ startDate: start, endDate: end });
                      }}
                    >
                      This Month
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        const start = new Date(new Date().getFullYear(), 0, 1);
                        const end = new Date();
                        setFilters({ startDate: start, endDate: end });
                      }}
                    >
                      This Year
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Date Range Picker */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <Calendar size={16} className="me-1" />
                      Date Range
                    </Form.Label>
                    <DatePicker
                      selectsRange={true}
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      onChange={handleDateChange}
                      className="form-control"
                      placeholderText="Select start and end date"
                      dateFormat="MMM dd, yyyy"
                      isClearable={false}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                  {reportData && (
                    <Badge bg="light" text="dark">
                      {filters.startDate.toLocaleDateString()} to {filters.endDate.toLocaleDateString()}
                    </Badge>
                  )}
                </Col>
              </Row>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {reportData && (
                <Row>
                  <Col md={12}>
                    <Card>
                      <Card.Body>
                        {/* Financial Summary Cards */}
                        <Row className="mb-4">
                          <Col md={4}>
                            <Card className="text-center bg-light">
                              <Card.Body>
                                <h6 className="card-title">Total Income</h6>
                                <h4 className="text-success">
                                  ₹{parseFloat(reportData.financials.totalIncome).toFixed(2)}
                                </h4>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={4}>
                            <Card className="text-center bg-light">
                              <Card.Body>
                                <h6 className="card-title">Total Expenditure</h6>
                                <h4 className="text-danger">
                                  ₹{parseFloat(reportData.financials.totalExpenditure).toFixed(2)}
                                </h4>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={4}>
                            <Card className={`text-center ${reportData.financials.isProfit ? 'bg-success-light' : 'bg-danger-light'}`}>
                              <Card.Body>
                                <h6 className="card-title">Net {reportData.financials.isProfit ? "Profit" : "Loss"}</h6>
                                <h4 className={reportData.financials.isProfit ? "text-success" : "text-danger"}>
                                  {reportData.financials.isProfit ? (
                                    <TrendingUp size={20} className="me-1" />
                                  ) : (
                                    <TrendingDown size={20} className="me-1" />
                                  )}
                                  ₹{Math.abs(parseFloat(reportData.financials.netProfitLoss)).toFixed(2)}
                                </h4>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        {/* Detailed Table */}
                        <div className="table-responsive">
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th className="text-end">Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-light">
                                <td colSpan="2" className="fw-bold">INCOME</td>
                              </tr>
                              <tr>
                                <td>Total Income</td>
                                <td className="text-end fw-bold text-success">
                                  {parseFloat(reportData.financials.totalIncome).toFixed(2)}
                                </td>
                              </tr>
                              
                              <tr className="bg-light">
                                <td colSpan="2" className="fw-bold">EXPENDITURE</td>
                              </tr>
                              <tr>
                                <td>Total Expenditure</td>
                                <td className="text-end fw-bold text-danger">
                                  {parseFloat(reportData.financials.totalExpenditure).toFixed(2)}
                                </td>
                              </tr>
                              
                              <tr className={reportData.financials.isProfit ? "bg-success-light" : "bg-danger-light"}>
                                <td className="fw-bold">
                                  NET {reportData.financials.isProfit ? "PROFIT" : "LOSS"}
                                </td>
                                <td className={`text-end fw-bold ${reportData.financials.isProfit ? "text-success" : "text-danger"}`}>
                                  {reportData.financials.isProfit ? (
                                    <TrendingUp size={18} className="me-1" />
                                  ) : (
                                    <TrendingDown size={18} className="me-1" />
                                  )}
                                  ₹{Math.abs(parseFloat(reportData.financials.netProfitLoss)).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>

                        {/* Category Breakdown */}
                        <Row>
                          <Col md={6}>
                            <Card>
                              <Card.Header>
                                <Card.Title>Income by Category</Card.Title>
                              </Card.Header>
                              <Card.Body>
                                {Object.keys(reportData.breakdown.incomeByCategory).length > 0 ? (
                                  <Table size="sm">
                                    <tbody>
                                      {Object.entries(reportData.breakdown.incomeByCategory).map(([category, amount]) => (
                                        <tr key={category}>
                                          <td>{category}</td>
                                          <td className="text-end text-success">
                                            ₹{parseFloat(amount).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                ) : (
                                  <p className="text-muted">No income data available</p>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={6}>
                            <Card>
                              <Card.Header>
                                <Card.Title>Expenditure by Category</Card.Title>
                              </Card.Header>
                              <Card.Body>
                                {Object.keys(reportData.breakdown.expenditureByCategory).length > 0 ? (
                                  <Table size="sm">
                                    <tbody>
                                      {Object.entries(reportData.breakdown.expenditureByCategory).map(([category, amount]) => (
                                        <tr key={category}>
                                          <td>{category}</td>
                                          <td className="text-end text-danger">
                                            ₹{parseFloat(amount).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                ) : (
                                  <p className="text-muted">No expenditure data available</p>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProfitAndLossReport;