import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Table,
  Image
} from "react-bootstrap";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FileText,
  DollarSign,
  Wallet,
  CalendarCheck,
  IndianRupee,
  CreditCard,
  Scale
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PageTitle from "../../layouts/PageTitle";

const ReportDashboard = () => {
  const navigate = useNavigate();
  const [showBillModal, setShowBillModal] = useState(false);
  const [billData, setBillData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const reports = [
    {
      id: 'expenditure',
      title: "Expenditure Report",
      description: "Track all company expenses and spending",
      icon: <DollarSign size={36} className="text-danger" />,
      path: '/ExpenditureReport'
    },
    {
      id: 'income',
      title: "Income Report",
      description: "View revenue and income sources",
      icon: <CreditCard size={36} className="text-success" />,
      path: '/Incomereport'
    },
     {
      id: 'P&l',
      title: "Profit and loss Report",
      description: "View revenue and income sources",
      icon: <Scale size={36} className="text-success" /> ,
      path: '/ProfitAndLossReport'
    }
  ];

  // Sample data for the reports
  const reportData = {
    expenditure: {
      title: "Expenditure Report",
      summary: "Total spending this month",
      amount: "₹85,420",
      change: "-12% from last month",
      isPositive: false,
      chartData: [
        { name: 'Jan', value: 65000 },
        { name: 'Feb', value: 59000 },
        { name: 'Mar', value: 80000 },
        { name: 'Apr', value: 81000 },
        { name: 'May', value: 85420 },
      ],
      details: [
        { category: "Salaries", amount: "₹45,000", percentage: "52.7%" },
        { category: "Office Supplies", amount: "₹12,500", percentage: "14.6%" },
        { category: "Utilities", amount: "₹8,750", percentage: "10.2%" },
        { category: "Marketing", amount: "₹10,200", percentage: "11.9%" },
        { category: "Miscellaneous", amount: "₹8,970", percentage: "10.5%" },
      ],
      records: [
        {
          id: 1,
          date: "2023-05-01",
          category_id: 1,
          payee_name: "John Doe",
          description: "Monthly salary payment",
          amount: "45000",
          payment_mode_id: 1,
          bill_id: "INV-001",
          bill_url: "",
          status: 1
        },
        {
          id: 2,
          date: "2023-05-05",
          category_id: 2,
          payee_name: "Office Supplies Co.",
          description: "Office stationery",
          amount: "12500",
          payment_mode_id: 2,
          bill_id: "INV-002",
          bill_url: "",
          status: 1
        },
      ],
      categories: [
        { id: 1, name: "Salaries" },
        { id: 2, name: "Office Supplies" },
        { id: 3, name: "Utilities" },
        { id: 4, name: "Marketing" },
        { id: 5, name: "Miscellaneous" }
      ],
      paymentModes: [
        { id: 1, name: "Bank Transfer" },
        { id: 2, name: "Credit Card" },
        { id: 3, name: "Cash" }
      ]
    }
  };

  const getCategoryName = (id) => {
    const category = reportData.expenditure.categories.find(c => c.id === id);
    return category ? category.name : "N/A";
  };

  const getPaymentModeName = (id) => {
    const mode = reportData.expenditure.paymentModes.find(p => p.id === id);
    return mode ? mode.name : "N/A";
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
        `₹${parseFloat(billData?.amount || 0).toFixed(2)}`
      ],
      [
        { content: "Total", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
        `₹${parseFloat(billData?.amount || 0).toFixed(2)}`
      ]
    ];

    doc.autoTable({
      startY: 55,
      head: [["Description", "Category", "Amount"]],
      body: tableData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [244, 67, 54] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Payment Method: ${getPaymentModeName(billData?.payment_mode_id)}`, 14, finalY);
    
    if (billData?.bill_url) {
      doc.text("Original bill is attached to this record", 14, finalY + 10);
    }
    
    doc.text("Thank you for your business!", 105, finalY + (billData?.bill_url ? 20 : 10), { align: "center" });

    doc.save(`Expense_${billData?.bill_id || billData?.id || "receipt"}.pdf`);
  };

  const BillModal = () => (
    <div className={`modal-overlay ${isAnimating ? "overlay-visible" : ""}`}>
      <div className="modal-backdrop" onClick={closeBillModal}></div>
      <div
        className={`modal-content ${isAnimating ? "modal-visible" : ""}`}
        style={{ maxWidth: "800px" }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Bill/Receipt</h2>
          <button onClick={closeBillModal} className="modal-close">
            &times;
          </button>
        </div>
        <div className="modal-body">
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
                  <td>₹{parseFloat(billData?.amount || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>₹{parseFloat(billData?.amount || 0).toFixed(2)}</strong>
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
        <div className="modal-footer">
          <button onClick={closeBillModal} className="btn btn-light">
            Close
          </button>
          <button onClick={downloadPdf} className="btn btn-danger">
            <FileText size={16} className="me-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );

  const renderReportCards = () => {
    return (
      <div className="row">
        {reports.map(report => (
          <div key={report.id} className="col-lg-3 col-md-6 mb-4">
            <Card 
              className="report-card h-100"
              onClick={() => navigate(report.path)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="text-center d-flex flex-column">
                <div className="mb-3">
                  {report.icon}
                </div>
                <Card.Title>{report.title}</Card.Title>
                <Card.Text className="text-muted">{report.description}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageTitle activeMenu="Reports" motherMenu="Management" />
      <div className="row">
        <div className="col-lg-12">
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Financial Reports</Card.Title>
              <p className="mb-0">Select a report to view detailed information</p>
            </Card.Header>
            <Card.Body>
              {renderReportCards()}
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {showBillModal && <BillModal />}
    </>
  );
};

export default ReportDashboard;