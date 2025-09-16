import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

// Financial Chart Component
export const FinancialChart = () => {
  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
    { name: 'Jul', revenue: 3490, expenses: 4300 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#4e73df" name="Revenue" />
        <Bar dataKey="expenses" fill="#e74a3b" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Recent Transactions Component
export const RecentTransactions = () => {
  const transactions = [
    { id: 1, date: '2023-05-15', description: 'Invoice #1001', amount: 1250.00, status: 'Paid' },
    { id: 2, date: '2023-05-14', description: 'Office Supplies', amount: 245.50, status: 'Pending' },
    { id: 3, date: '2023-05-13', description: 'Invoice #1002', amount: 3200.00, status: 'Paid' },
    { id: 4, date: '2023-05-12', description: 'Software Subscription', amount: 99.00, status: 'Paid' },
    { id: 5, date: '2023-05-11', description: 'Invoice #1003', amount: 1750.00, status: 'Overdue' },
  ];

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>
                <span className={`badge bg-${transaction.status === 'Paid' ? 'success' : transaction.status === 'Pending' ? 'warning' : 'danger'}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Expense Breakdown Component
export const ExpenseBreakdown = () => {
  const data = [
    { name: 'Salaries', value: 45 },
    { name: 'Office', value: 20 },
    { name: 'Marketing', value: 15 },
    { name: 'Software', value: 10 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Circular Progress Component
export const CircularProgress = ({ value, color }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorMap = {
    success: '#1cc88a',
    warning: '#f6c23e',
    danger: '#e74a3b',
    primary: '#4e73df'
  };

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#eee"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={colorMap[color] || '#4e73df'}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dy=".3em"
        fontSize="20"
        fontWeight="bold"
        fill={colorMap[color] || '#4e73df'}
      >
        {value}%
      </text>
    </svg>
  );
};