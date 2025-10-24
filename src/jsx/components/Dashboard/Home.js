import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FinancialChart, 
  RecentTransactions, 
  ExpenseBreakdown, 
  CircularProgress 
} from './Dashboard/AccountingComponents';
import { ThemeContext } from "../../../context/ThemeContext";
import ReservationStats from './Dashboard/ReservationStats';
import LatestReview from './Dashboard/LatestReview';
import RecentBooking from './Dashboard/RecentBooking';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008";

const Home = () => {
  const { changeBackground } = useContext(ThemeContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/dashboard/get`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate profit percentage
  const calculateProfitPercentage = () => {
    if (!dashboardData || dashboardData.total_income === 0) return 0;
    return Math.round((dashboardData.net_profit / dashboardData.total_income) * 100);
  };

  if (loading) {
    return (
      <div className="accounting-dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accounting-dashboard">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchDashboardData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    total_income = 0,
    total_income_transactions = 0,
    today_income = 0,
    week_income = 0,
    total_expense = 0,
    total_expense_transactions = 0,
    today_expense = 0,
    week_expense = 0,
    net_profit = 0,
    income_by_category = [],
    expense_by_category = [],
    monthly_income = [],
    monthly_expense = []
  } = dashboardData || {};

  const profitPercentage = calculateProfitPercentage();

  return (
    <>
      <div className="accounting-dashboard">
        <div className="row">
          <div className="col-xl-12">
            <div className="row">
              {/* Financial Summary Cards */}
              <div className="col-xl-12">
                <div className="row">
                  {/* Total Revenue Card */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card financial-card revenue-card">
                      <div className="card-body">
                        <div className="financial-status d-flex align-items-center">
                          <span className="financial-icon text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h2 className="mb-0 font-w600">{formatCurrency(total_income)}</h2>
                            <p className="mb-0">Total Revenue</p>
                            <div className="d-flex align-items-center mt-1">
                              <span className="positive-trend me-2">
                                {total_income_transactions} transactions
                              </span>
                              {today_income > 0 && (
                                <small className="text-muted">
                                  +{formatCurrency(today_income)} today
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Expenses Card */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card financial-card expenses-card">
                      <div className="card-body">
                        <div className="financial-status d-flex align-items-center">
                          <span className="financial-icon text-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5h-7v-2h7v2zm0-3.5h-7v-2h7v2zm0-3.5h-7V7h7v2z"/>
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h2 className="mb-0 font-w600">{formatCurrency(total_expense)}</h2>
                            <p className="mb-0">Total Expenses</p>
                            <div className="d-flex align-items-center mt-1">
                              <span className="negative-trend me-2">
                                {total_expense_transactions} transactions
                              </span>
                              {today_expense > 0 && (
                                <small className="text-muted">
                                  +{formatCurrency(today_expense)} today
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Profit Card */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card financial-card profit-card">
                      <div className="card-body">
                        <div className="financial-status d-flex align-items-center">
                          <span className="financial-icon text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 14.5h-3v-5h3v5zm0-7h-3v-2h3v2z"/>
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h2 className="mb-0 font-w600">{formatCurrency(net_profit)}</h2>
                            <p className="mb-0">Net Profit</p>
                            <span className={net_profit >= 0 ? "positive-trend" : "negative-trend"}>
                              {net_profit >= 0 ? '+' : ''}{profitPercentage}% 
                              <i className={`fas fa-arrow-${net_profit >= 0 ? 'up' : 'down'}`}></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Summary Card */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card financial-card invoices-card">
                      <div className="card-body">
                        <div className="financial-status d-flex align-items-center">
                          <span className="financial-icon text-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-9-1l-4-4l4-4l1.4 1.4L11.8 15H16v2h-4.2l1.6 1.6L13 19z"/>
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h2 className="mb-0 font-w600">{formatCurrency(week_income)}</h2>
                            <p className="mb-0">This Week's Income</p>
                            <div className="mt-1">
                              <small className="text-muted">
                                Expenses: {formatCurrency(week_expense)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="col-xl-12">
                <div className="row">
                  {/* Financial Chart */}
                  <div className="col-xl-8">
                    <div className="card">
                      <div className="card-header border-0 pb-0">
                        <h4 className="fs-20">Financial Overview</h4>
                        <div className="dropdown">
                          <button className="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            This Year
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">This Year</a></li>
                            <li><a className="dropdown-item" href="#">Last Year</a></li>
                            <li><a className="dropdown-item" href="#">Last Quarter</a></li>
                          </ul>
                        </div>
                      </div>
                      <div className="card-body">
                        <FinancialChart 
                          monthlyIncome={monthly_income}
                          monthlyExpense={monthly_expense}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="col-xl-4">
                    <div className="card">
                      <div className="card-header border-0 pb-0">
                        <h4 className="fs-20">Quick Stats</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-6 mb-4">
                            <div className="stat-card">
                              <div className="stat-icon paid">
                                <i className="fas fa-arrow-down text-success"></i>
                              </div>
                              <h3>{total_income_transactions}</h3>
                              <p>Income Transactions</p>
                            </div>
                          </div>
                          <div className="col-6 mb-4">
                            <div className="stat-card">
                              <div className="stat-icon overdue">
                                <i className="fas fa-arrow-up text-danger"></i>
                              </div>
                              <h3>{total_expense_transactions}</h3>
                              <p>Expense Transactions</p>
                            </div>
                          </div>
                          <div className="col-6 mb-4">
                            <div className="stat-card">
                              <div className="stat-icon clients">
                                <i className="fas fa-chart-pie text-info"></i>
                              </div>
                              <h3>{income_by_category.length}</h3>
                              <p>Income Categories</p>
                            </div>
                          </div>
                          <div className="col-6 mb-4">
                            <div className="stat-card">
                              <div className="stat-icon recurring">
                                <i className="fas fa-chart-bar text-warning"></i>
                              </div>
                              <h3>{expense_by_category.length}</h3>
                              <p>Expense Categories</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Row */}
              <div className="col-xl-12">
                <div className="row">
                  {/* Income by Category */}
                  <div className="col-xl-6">
                    <div className="card">
                      <div className="card-header border-0 pb-0">
                        <h4 className="fs-20">Income by Category</h4>
                        <Link to="/income" className="btn btn-sm btn-link">View All</Link>
                      </div>
                      <div className="card-body">
                        {income_by_category.length > 0 ? (
                          <div className="category-list">
                            {income_by_category.map((category, index) => (
                              <div key={index} className="category-item d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                                <div className="d-flex align-items-center">
                                  <div 
                                    className="category-color me-3"
                                    style={{
                                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%'
                                    }}
                                  ></div>
                                  <span className="fw-medium">{category.category_name}</span>
                                </div>
                                <strong className="text-success">{formatCurrency(category.total_amount)}</strong>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted text-center">No income data available</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expense by Category */}
                  <div className="col-xl-6">
                    <div className="card">
                      <div className="card-header border-0 pb-0">
                        <h4 className="fs-20">Expense by Category</h4>
                        <Link to="/expenses" className="btn btn-sm btn-link">View All</Link>
                      </div>
                      <div className="card-body">
                        {expense_by_category.length > 0 ? (
                          <div className="category-list">
                            {expense_by_category.map((category, index) => (
                              <div key={index} className="category-item d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                                <div className="d-flex align-items-center">
                                  <div 
                                    className="category-color me-3"
                                    style={{
                                      backgroundColor: `hsl(${index * 60 + 180}, 70%, 50%)`,
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%'
                                    }}
                                  ></div>
                                  <span className="fw-medium">{category.category_name}</span>
                                </div>
                                <strong className="text-danger">{formatCurrency(category.total_amount)}</strong>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted text-center">No expense data available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Financial Health */}
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header border-0 pb-0">
                    <h4 className="fs-20">Financial Health</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="health-card text-center">
                          <div className="health-progress mb-3">
                            <CircularProgress 
                              value={total_income > 0 ? Math.min(100, Math.round((total_income / (total_income + total_expense)) * 100)) : 0} 
                              color="success" 
                            />
                          </div>
                          <h3>Revenue Ratio</h3>
                          <p className="text-muted">
                            {total_income > 0 ? Math.round((total_income / (total_income + total_expense)) * 100) : 0}% of total flow
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="health-card text-center">
                          <div className="health-progress mb-3">
                            <CircularProgress 
                              value={profitPercentage >= 0 ? Math.min(100, Math.max(0, profitPercentage)) : 0} 
                              color={profitPercentage >= 30 ? "success" : profitPercentage >= 10 ? "warning" : "danger"} 
                            />
                          </div>
                          <h3>Profit Margin</h3>
                          <p className="text-muted">
                            {profitPercentage}% of revenue
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="health-card text-center">
                          <div className="health-progress mb-3">
                            <CircularProgress 
                              value={total_income > 0 ? Math.min(100, Math.round((total_expense / total_income) * 100)) : 0} 
                              color={total_income > 0 && (total_expense / total_income) < 0.7 ? "success" : "danger"} 
                            />
                          </div>
                          <h3>Expense Ratio</h3>
                          <p className="text-muted">
                            {total_income > 0 ? Math.round((total_expense / total_income) * 100) : 0}% of income
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;