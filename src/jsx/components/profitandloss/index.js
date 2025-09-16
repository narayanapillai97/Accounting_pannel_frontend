import React, { useState, useEffect, Fragment } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Table,
  Form,
  Badge,
  Alert
} from "react-bootstrap";
import { 
  FileText,
  Download,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PageTitle from "../../layouts/PageTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";

// Import the JSON data
import incomeData from "../../../../src/jsx/components/reportdata/reportdata.json";


const ProfitAndLossReport = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null
  });

  // Load data from JSON files
  useEffect(() => {
    try {
      setIncomes(incomeData.incomes);
      setExpenses(incomeData.expenditures);
      setFilteredIncomes(incomeData.incomes);
      setFilteredExpenses(incomeData.expenditures);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let incomeResult = [...incomes];
    let expenseResult = [...expenses];

    if (filters.startDate) {
      incomeResult = incomeResult.filter(item => new Date(item.date) >= filters.startDate);
      expenseResult = expenseResult.filter(item => new Date(item.date) >= filters.startDate);
    }

    if (filters.endDate) {
      incomeResult = incomeResult.filter(item => new Date(item.date) <= filters.endDate);
      expenseResult = expenseResult.filter(item => new Date(item.date) <= filters.endDate);
    }

    setFilteredIncomes(incomeResult);
    setFilteredExpenses(expenseResult);
  }, [filters, incomes, expenses]);

  // Calculate totals
  const totalIncome = filteredIncomes.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const netProfit = totalIncome - totalExpenses;

const downloadPdfReport = () => {
  const doc = new jsPDF();
  
  // Report title
  doc.setFontSize(18);
  doc.text("PROFIT AND LOSS STATEMENT", 105, 15, { align: "center" });
  
  // Period information
  doc.setFontSize(10);
  let yPosition = 25;
  
  const dateRange = `Period: ${filters.startDate ? filters.startDate.toLocaleDateString() : 'All'} - ${filters.endDate ? filters.endDate.toLocaleDateString() : 'All'}`;
  doc.text(dateRange, 14, yPosition);
  yPosition += 5;
  
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, yPosition);
  yPosition += 10;
  
  // Income section
  doc.setFontSize(14);
  doc.text("INCOME", 14, yPosition);
  yPosition += 8;
  
  // Income table
  doc.autoTable({
    startY: yPosition,
    head: [["Description", "Amount (₹)"]],
    body: [
      ["Total Income", parseFloat(totalIncome).toFixed(2)]
    ],
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [51, 122, 183] },
    columnStyles: { 1: { halign: 'right' } }
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Expenses section
  doc.setFontSize(14);
  doc.text("EXPENSES", 14, yPosition);
  yPosition += 8;
  
  // Expenses table
  doc.autoTable({
    startY: yPosition,
    head: [["Description", "Amount (₹)"]],
    body: [
      ["Total Expenses", parseFloat(totalExpenses).toFixed(2)]
    ],
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [51, 122, 183] },
    columnStyles: { 1: { halign: 'right' } }
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Net Profit/Loss
  doc.setFontSize(14);
  // Correct way to set text color - using RGB values (0-255)
  if (netProfit >= 0) {
    doc.setTextColor(0, 128, 0); // Green for profit
  } else {
    doc.setTextColor(255, 0, 0); // Red for loss
  }
  doc.text(`NET ${netProfit >= 0 ? "PROFIT" : "LOSS"}: ₹${Math.abs(netProfit).toFixed(2)}`, 14, yPosition);
  
  // Reset text color to black for any future text
  doc.setTextColor(0, 0, 0);
  
  doc.save(`Profit_and_Loss_${new Date().toISOString().slice(0, 10)}.pdf`);
};

  const exportToExcel = () => {
    // Create CSV content
    let csvContent = "Category,Amount (₹)\n";
    
    // Income section
    csvContent += `Total Income,${parseFloat(totalIncome).toFixed(2)}\n`;
    
    // Expenses section
    csvContent += `Total Expenses,${parseFloat(totalExpenses).toFixed(2)}\n`;
    
    // Net Profit/Loss
    csvContent += `Net ${netProfit >= 0 ? "Profit" : "Loss"},${Math.abs(netProfit).toFixed(2)}\n`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Profit_and_Loss_${new Date().toISOString().slice(0, 10)}.csv`);
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

  if (isLoading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>;
  }

  return (
    <Fragment>
      <PageTitle activeMenu="Profit & Loss Report" motherMenu="Finance" />

      <Row>
        <Col lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Profit & Loss Statement</Card.Title>
              <div>
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

            <Card.Body>
              <Row className="mb-4">
                 <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date Range</Form.Label>
                    <DatePicker
                      selectsRange={true}
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      onChange={(update) => {
                        setFilters({
                          ...filters,
                          startDate: update[0],
                          endDate: update[1],
                        });
                      }}
                      isClearable={true}
                      className="form-control"
                      placeholderText="Select start and end date"
                      dateFormat="MM/dd/yyyy"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Card>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-light">
                              <td colSpan="2" className="fw-bold">INCOME</td>
                            </tr>
                            <tr>
                              <td>Total Income</td>
                              <td className="text-end">{parseFloat(totalIncome).toFixed(2)}</td>
                            </tr>
                            
                            <tr className="bg-light">
                              <td colSpan="2" className="fw-bold">EXPENSES</td>
                            </tr>
                            <tr>
                              <td>Total Expenses</td>
                              <td className="text-end">{parseFloat(totalExpenses).toFixed(2)}</td>
                            </tr>
                            
                            <tr className={netProfit >= 0 ? "bg-success-light" : "bg-danger-light"}>
                              <td className="fw-bold">NET {netProfit >= 0 ? "PROFIT" : "LOSS"}</td>
                              <td className={`text-end fw-bold ${netProfit >= 0 ? "text-success" : "text-danger"}`}>
                                {netProfit >= 0 ? (
                                  <TrendingUp size={18} className="me-1" />
                                ) : (
                                  <TrendingDown size={18} className="me-1" />
                                )}
                                ₹{Math.abs(netProfit).toFixed(2)}
                              </td>
                            </tr>
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

export default ProfitAndLossReport;