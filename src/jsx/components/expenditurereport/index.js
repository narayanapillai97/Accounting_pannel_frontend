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
} from "react-bootstrap";
import { FileText, Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PageTitle from "../../layouts/PageTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";

// Import the JSON data
import reportData from "../../../../src/jsx/components/reportdata/reportdata.json";

const ExpenditureReport = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [filteredExpenditures, setFilteredExpenditures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: "",
    paymentMode: "",
    status: "",
  });

  // Load data from JSON file
  useEffect(() => {
    try {
      setExpenditures(reportData.expenditures);
      setFilteredExpenditures(reportData.expenditures);
      setCategories(reportData.categories);
      setSubcategories(reportData.subcategories);
      setVariants(reportData.variants);
      setPaymentModes(reportData.paymentModes);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...expenditures];

    if (filters.startDate) {
      result = result.filter(
        (item) => new Date(item.date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      result = result.filter((item) => new Date(item.date) <= filters.endDate);
    }

    if (filters.category) {
      result = result.filter(
        (item) => item.category_id === parseInt(filters.category)
      );
    }

    if (filters.paymentMode) {
      result = result.filter(
        (item) => item.payment_mode_id === parseInt(filters.paymentMode)
      );
    }

    if (filters.status !== "") {
      result = result.filter(
        (item) => item.status === parseInt(filters.status)
      );
    }

    setFilteredExpenditures(result);
  }, [filters, expenditures]);

  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "N/A";
  };

  const getSubcategoryName = (id) => {
    const subcategory = subcategories.find((sc) => sc.id === id);
    return subcategory ? subcategory.name : "N/A";
  };

  const getVariantName = (id) => {
    const variant = variants.find((v) => v.id === id);
    return variant ? variant.name : "N/A";
  };

  const getPaymentModeName = (id) => {
    const mode = paymentModes.find((p) => p.id === id);
    return mode ? mode.name : "N/A";
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

    // Filters information
    doc.setFontSize(10);
    let yPosition = 25;

    if (filters.startDate || filters.endDate) {
      const dateRange = `Date Range: ${
        filters.startDate ? filters.startDate.toLocaleDateString() : "All"
      } - ${filters.endDate ? filters.endDate.toLocaleDateString() : "All"}`;
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

    if (filters.status !== "") {
      const statusText = filters.status === "1" ? "Active" : "Inactive";
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
      "Payee",
      "Category",
      "Amount (₹)",
      "Payment Mode",
      "Status",
    ];

    // Table data
    const data = filteredExpenditures.map((exp) => [
      exp.date,
      exp.payee_name,
      getCategoryName(exp.category_id),
      parseFloat(exp.amount).toFixed(2),
      getPaymentModeName(exp.payment_mode_id),
      exp.status === 1 ? "Active" : "Inactive",
    ]);

    // Add total row
    const totalAmount = filteredExpenditures.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );
    data.push([
      {
        content: "TOTAL",
        colSpan: 3,
        styles: { halign: "right", fontStyle: "bold" },
      },
      parseFloat(totalAmount).toFixed(2),
      "",
      "",
    ]);

    // Generate table
    doc.autoTable({
      startY: yPosition,
      head: [headers],
      body: data,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [51, 122, 183] },
      columnStyles: {
        3: { halign: "right" },
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
    let csvContent =
      "Date,Payee,Category,Subcategory,Variant,Description,Amount,Payment Mode,Bill ID,Status\n";

    filteredExpenditures.forEach((exp) => {
      csvContent +=
        [
          exp.date,
          `"${exp.payee_name}"`,
          `"${getCategoryName(exp.category_id)}"`,
          `"${getSubcategoryName(exp.subcategory_id)}"`,
          `"${getVariantName(exp.variant_id)}"`,
          `"${exp.description}"`,
          parseFloat(exp.amount).toFixed(2),
          `"${getPaymentModeName(exp.payment_mode_id)}"`,
          exp.bill_id,
          exp.status === 1 ? "Active" : "Inactive",
        ].join(",") + "\n";
    });

    // Calculate total
    const totalAmount = filteredExpenditures.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );
    csvContent += `,,,,,,Total:,${parseFloat(totalAmount).toFixed(2)},,\n`;

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Expenditure_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
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
                >
                  <Download size={16} className="me-1" />
                  Export to Excel
                </Button>
                <Button
                  variant="danger"
                  className="me-2"
                  onClick={downloadPdfReport}
                >
                  <Download size={16} className="me-1" />
                  Download PDF
                </Button>
              </div>
            </Card.Header>

            <Card.Body id="expenditure-report-content">
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
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
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
                      {paymentModes.map((mode) => (
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
                    <Card.Header>
                      <Card.Title>Expenditure Details</Card.Title>
                      <div className="text-end">
                        <strong>
                          Total: ₹
                          {filteredExpenditures
                            .reduce(
                              (sum, exp) => sum + parseFloat(exp.amount),
                              0
                            )
                            .toFixed(2)}
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
                            {filteredExpenditures.length > 0 ? (
                              filteredExpenditures.map((exp, index) => (
                                <tr key={exp.id}>
                                  <td>{index + 1}</td>
                                  <td>{exp.date}</td>
                                  <td>{exp.payee_name}</td>
                                  <td>{getCategoryName(exp.category_id)}</td>
                                  <td>
                                    {getSubcategoryName(exp.subcategory_id)}
                                  </td>
                                  <td>{exp.description}</td>
                                  <td className="text-end">
                                    {parseFloat(exp.amount).toFixed(2)}
                                  </td>
                                  <td>
                                    {getPaymentModeName(exp.payment_mode_id)}
                                  </td>
                                  <td>{exp.bill_id}</td>
                                  <td>{getStatusBadge(exp.status)}</td>
                                  <td>
                                    <Button
                                      variant="info"
                                      size="sm"
                                      onClick={() => {
                                        const doc = new jsPDF();

                                        // Receipt content
                                        doc.setFontSize(18);
                                        doc.text("EXPENSE RECEIPT", 105, 15, {
                                          align: "center",
                                        });

                                        doc.setFontSize(12);
                                        doc.text(
                                          `Payee: ${exp.payee_name}`,
                                          14,
                                          25
                                        );
                                        doc.text(`Date: ${exp.date}`, 14, 32);
                                        doc.text(
                                          `Receipt #: ${exp.bill_id || "N/A"}`,
                                          14,
                                          39
                                        );

                                        doc.autoTable({
                                          startY: 50,
                                          head: [
                                            [
                                              "Description",
                                              "Category",
                                              "Amount",
                                            ],
                                          ],
                                          body: [
                                            [
                                              exp.description,
                                              getCategoryName(exp.category_id),
                                              `₹${parseFloat(
                                                exp.amount
                                              ).toFixed(2)}`,
                                            ],
                                            [
                                              "Total",
                                              "",
                                              `₹${parseFloat(
                                                exp.amount
                                              ).toFixed(2)}`,
                                            ],
                                          ],
                                          styles: { fontSize: 10 },
                                          headStyles: {
                                            fillColor: [51, 122, 183],
                                          },
                                          columnStyles: {
                                            2: { halign: "right" },
                                          },
                                        });

                                        const finalY =
                                          doc.lastAutoTable.finalY + 10;
                                        doc.text(
                                          `Payment Method: ${getPaymentModeName(
                                            exp.payment_mode_id
                                          )}`,
                                          14,
                                          finalY
                                        );
                                        doc.text(
                                          "Thank you for your business!",
                                          105,
                                          finalY + 10,
                                          { align: "center" }
                                        );

                                        doc.save(
                                          `Receipt_${exp.bill_id || exp.id}.pdf`
                                        );
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
                                  No expenditures found matching your filters
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
