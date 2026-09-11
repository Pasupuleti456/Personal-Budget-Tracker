import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { APIUrl } from '../utils';

// --- UTILITY FUNCTIONS ---

const handleError = (err) => {
    console.error(err);
    toast.error(err.message || 'Something went wrong!');
};

const handleSuccess = (msg) => {
    toast.success(msg || 'Operation successful!');
};

// --- CHILD COMPONENTS ---

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    const balance = Math.max(0, Number(incomeAmt) - Number(expenseAmt));

    return (
        <div className="card card-overview">
            <div className="overview-header">
                <span className="overview-sparkle">✨</span>
                <h3 className="card-title-inline">Financial Overview</h3>
            </div>
            
            <div className="snapshot-balance-container">
                <div className="wallet-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="6" width="20" height="14" rx="4" fill="#5B21B6"/>
                        <path d="M18 11C18 10.4477 17.5523 10 17 10C16.4477 10 16 10.4477 16 11V13C16 13.5523 16.4477 14 17 14C17.5523 14 18 13.5523 18 13V11Z" fill="#F3E8FF"/>
                        <path d="M5 6V4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V6" stroke="#5B21B6" strokeWidth="2"/>
                    </svg>
                </div>
                <p className="snapshot-balance">
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="snapshot-label">Remaining Balance • Cumulative Savings</p>
            </div>

            <div className="snapshot-summary">
                <div className="snapshot-box snapshot-box-income">
                    <div className="pill-header">
                        <span className="pill-icon green-icon">📈</span>
                        <span className="snapshot-box-label">Monthly Income</span>
                    </div>
                    <p className="snapshot-income">
                        +₹{Number(incomeAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="snapshot-box snapshot-box-expense">
                    <div className="pill-header">
                        <span className="pill-icon red-icon">📉</span>
                        <span className="snapshot-box-label">Total Expenses</span>
                    </div>
                    <p className="snapshot-expense">
                        -₹{Number(expenseAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({ amount: '', text: '', date: new Date().toISOString().split('T')[0] });
    const handleChange = (e) => setExpenseInfo({ ...expenseInfo, [e.target.name]: e.target.value });
    
    const addExpenses = (e) => {
        e.preventDefault();
        if (!expenseInfo.amount || !expenseInfo.text || !expenseInfo.date) {
            return handleError({ message: 'Please fill all transaction fields.' });
        }
        addTransaction({ 
            text: expenseInfo.text,
            amount: Math.abs(Number(expenseInfo.amount)),
            createdAt: expenseInfo.date 
        });
        setExpenseInfo({ amount: '', text: '', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="card add-expense-card">
            <div className="gradient-card-header">
                <h3>Add New Expense</h3>
                <span className="plus-icon">+</span>
            </div>
            <div className="card-body">
                <form onSubmit={addExpenses} className="form">
                    <div>
                        <label className="form-label">Expense Detail</label>
                        <input className="form-input" onChange={handleChange} type='text' name='text' placeholder='e.g. Coffee, Groceries' value={expenseInfo.text} />
                    </div>
                    <div>
                        <label className="form-label">Amount (₹)</label>
                        <input className="form-input" onChange={handleChange} type='number' name='amount' placeholder='e.g. 150' value={expenseInfo.amount} />
                    </div>
                    <div>
                        <label className="form-label">Date</label>
                        <input className="form-input" onChange={handleChange} type='date' name='date' value={expenseInfo.date} />
                    </div>
                    <button type='submit' className="button purple-btn">Add Expense <span>+</span></button>
                </form>
            </div>
        </div>
    );
}

const ExpenseTable = ({ expenses, deleteExpens, filters, handleFilterChange, applyFilters, clearFilters }) => (
    <div className="card transaction-history-card">
        <div className="history-card-header">
            <h3 className="card-title-inline">Transaction History</h3>
            <h3 className="card-title-inline filter-header-title">Filter Transactions</h3>
        </div>

        {/* Filter Controls Row */}
        <div className="filter-controls-bar">
            <div className="date-pill-input">
                <span className="cal-icon">📅</span>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} placeholder="Start Date —" />
            </div>
            <div className="date-pill-input">
                <span className="cal-icon">📅</span>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} placeholder="End Date —" />
            </div>
            <button onClick={applyFilters} className="button purple-btn filter-btn">
                <span>🈸</span> Apply Filter
            </button>
            <button onClick={clearFilters} className="button outline-btn clear-btn">
                <span>⊹</span> Clear Filter
            </button>
        </div>

        {/* Transactions List / Empty State */}
        <div className="transaction-list">
            {expenses.length > 0 ? (
                expenses.map((expense) => (
                    <div key={expense._id || Math.random()} className="transaction-item">
                        <div className="transaction-details">
                            <button className="delete-button-circle" onClick={() => deleteExpens(expense._id)}>✕</button>
                            <div>
                                <p className="transaction-text">{expense.text}</p>
                                <p className="transaction-date">{new Date(expense.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                        <span className="transaction-amount">
                            -₹{Math.abs(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))
            ) : (
                <div className="empty-journey-container">
                    <img src="/piggy_bank_illustration.png" alt="Piggy Bank" className="piggy-img" />
                    <h4 className="journey-title">Start your money journey</h4>
                    <p className="journey-sub">Add your first income and expense to see magic</p>
                </div>
            )}
        </div>
    </div>
);


// --- MAIN DASHBOARD COMPONENT ---
function Expenses() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const [appliedFilters, setAppliedFilters] = useState({ startDate: '', endDate: '' });

    const formattedToday = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    useEffect(() => {
        const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
        setExpenseAmt(total);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const response = await fetch(`${APIUrl}/api/expenses/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to delete');
            handleSuccess(result.message);
            setExpenses(result.data || []);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        
        try {
            let expensesUrl = `${APIUrl}/api/expenses`;
            const params = new URLSearchParams();
            if (appliedFilters.startDate) params.append('startDate', appliedFilters.startDate);
            if (appliedFilters.endDate) params.append('endDate', appliedFilters.endDate);
            if (params.toString()) {
                expensesUrl += `?${params.toString()}`;
            }

            const expenseRes = await fetch(expensesUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            const expenseResult = await expenseRes.json();
            if (expenseResult.success) setExpenses(expenseResult.data || []);

            const incomeRes = await fetch(`${APIUrl}/api/user/income`, { headers: { 'Authorization': `Bearer ${token}` } });
            const incomeResult = await incomeRes.json();
            if (incomeResult.success) setIncomeAmt(incomeResult.income);

        } catch (err) {
            handleError(err);
        }
    }, [navigate, appliedFilters]);

    const addTransaction = async (data) => {
        try {
            const response = await fetch(`${APIUrl}/api/expenses`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to add');
            handleSuccess(result.message);
            fetchData();
        } catch (err) {
            handleError(err);
        }
    };

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${APIUrl}/api/user/update-income`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ income: Number(incomeAmt) })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update');
            handleSuccess(result.message);
        } catch (err) {
            handleError(err);
        }
    };
    
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
    };

    const clearFilters = () => {
        setFilters({ startDate: '', endDate: '' });
        setAppliedFilters({ startDate: '', endDate: '' });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const COLORS = ['#5B21B6', '#7C3AED', '#22A06B', '#E85D75', '#A78BFA'];
    const expenseData = expenses.length > 0 ? expenses.map((expense) => ({
        name: expense.text,
        value: Math.abs(Number(expense.amount)),
    })) : [{ name: 'No Expenses', value: 1 }];

    return (
        <>
        <style>{`
            .dashboard-page-container {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background: linear-gradient(135deg, #E6DCFF 0%, #D8C8FE 100%);
                color: #171717;
                min-height: 100vh;
                padding: 10px 24px 40px 24px;
            }
            .dashboard-header {
                max-width: 1240px;
                margin: 10px auto 20px auto;
            }
            .welcome-title {
                font-size: 2.2rem;
                font-weight: 900;
                color: #171717;
                margin: 0 0 4px 0;
                letter-spacing: -0.03em;
                text-transform: uppercase;
            }
            .welcome-sub {
                font-size: 1rem;
                color: #4B5563;
                margin: 0;
                font-weight: 500;
            }

            .grid-container {
                display: grid;
                grid-template-columns: 1.25fr 0.85fr;
                gap: 20px;
                max-width: 1240px;
                margin: 0 auto;
            }

            .left-column, .right-column {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .card {
                background-color: #FFFFFF;
                border-radius: 24px;
                border: 1px solid #E9D5FF;
                box-shadow: 0 8px 30px rgba(91, 33, 182, 0.04);
                padding: 24px;
            }

            .card-title-inline {
                font-size: 1.25rem;
                font-weight: 800;
                color: #171717;
                margin: 0;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .card-title-badge {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #EDE9FE;
                color: #5B21B6;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                font-weight: bold;
                margin-right: 8px;
            }

            /* Financial Overview Card */
            .card-overview {
                text-align: center;
                padding: 28px;
            }
            .overview-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            .overview-sparkle { font-size: 1.3rem; }
            .snapshot-balance-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 8px 0 24px 0;
            }
            .wallet-badge {
                width: 52px;
                height: 52px;
                background-color: #DDD0FB;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
            }
            .snapshot-balance {
                font-size: 3.2rem;
                font-weight: 900;
                color: #171717;
                margin: 0;
                letter-spacing: -0.03em;
            }
            .snapshot-label {
                font-size: 0.95rem;
                color: #6B7280;
                font-weight: 600;
                margin-top: 4px;
            }
            .snapshot-summary {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            .snapshot-box {
                padding: 16px 20px;
                border-radius: 16px;
                text-align: center;
            }
            .snapshot-box-income {
                background-color: #D1F5DB;
            }
            .snapshot-box-expense {
                background-color: #FCD0D5;
            }
            .pill-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .pill-icon { font-size: 1rem; }
            .snapshot-box-label {
                font-size: 0.9rem;
                font-weight: 700;
                color: #374151;
            }
            .snapshot-income {
                color: #059669;
                font-size: 1.5rem;
                font-weight: 900;
                margin: 6px 0 0 0;
            }
            .snapshot-expense {
                color: #DC2626;
                font-size: 1.5rem;
                font-weight: 900;
                margin: 6px 0 0 0;
            }

            /* Update Income Form */
            .income-form-header {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
            }
            .form-input-grey {
                background-color: #F1F5F9;
                border: 1px solid #E2E8F0;
                border-radius: 10px;
                padding: 12px 16px;
                font-size: 1rem;
                width: 100%;
                color: #171717;
                box-sizing: border-box;
                font-family: inherit;
            }
            .form-input-grey:focus {
                outline: none;
                border-color: #5B21B6;
                box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.15);
            }

            .button {
                border-radius: 12px;
                padding: 12px;
                font-weight: 700;
                font-size: 0.95rem;
                cursor: pointer;
                border: none;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                font-family: inherit;
            }

            .purple-btn {
                background-color: #4C1D95;
                color: #FFFFFF;
            }

            .purple-btn:hover {
                background-color: #3B0764;
                transform: translateY(-1px);
            }

            .outline-btn {
                background-color: #FFFFFF;
                border: 1px solid #CBD5E1;
                color: #475569;
            }

            .outline-btn:hover {
                background-color: #F8FAFC;
            }

            /* Add New Expense Card */
            .add-expense-card {
                padding: 0;
                overflow: hidden;
            }
            .gradient-card-header {
                background: linear-gradient(90deg, #4C1D95 0%, #7C3AED 100%);
                color: #FFFFFF;
                padding: 16px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .gradient-card-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 800;
            }
            .plus-icon {
                font-size: 1.4rem;
                font-weight: bold;
            }
            .add-expense-card .card-body {
                padding: 24px;
            }
            .form-label {
                display: block;
                margin-bottom: 6px;
                font-size: 0.875rem;
                font-weight: 700;
                color: #171717;
            }

            /* Transaction History & Filters Card */
            .transaction-history-card {
                padding: 28px;
            }
            .history-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .filter-header-title {
                color: #171717;
            }
            .filter-controls-bar {
                display: grid;
                grid-template-columns: 1fr 1fr 1.2fr 1fr;
                gap: 10px;
                margin-bottom: 24px;
            }
            .date-pill-input {
                background-color: #EDE9FE;
                border-radius: 10px;
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .date-pill-input input {
                background: transparent;
                border: none;
                outline: none;
                font-size: 0.875rem;
                font-weight: 700;
                color: #5B21B6;
                width: 100%;
                font-family: inherit;
            }

            /* Empty Journey State */
            .empty-journey-container {
                text-align: center;
                padding: 32px 16px;
            }
            .piggy-img {
                width: 160px;
                height: auto;
                margin-bottom: 12px;
            }
            .journey-title {
                font-size: 1.35rem;
                font-weight: 800;
                color: #171717;
                margin: 0 0 6px 0;
            }
            .journey-sub {
                font-size: 0.95rem;
                color: #6B7280;
                margin: 0;
            }

            .transaction-list {
                max-height: 380px;
                overflow-y: auto;
            }
            .transaction-item {
                background: #F8FAFC;
                border: 1px solid #E2E8F0;
                padding: 14px 18px;
                border-radius: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            .transaction-details {
                display: flex;
                align-items: center;
                gap: 14px;
            }
            .delete-button-circle {
                background: #FCE8EC;
                color: #DC2626;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .transaction-text { font-weight: 700; color: #171717; margin: 0; }
            .transaction-date { font-size: 0.825rem; color: #6B7280; margin: 2px 0 0 0; }
            .transaction-amount { color: #DC2626; font-weight: 800; font-size: 1.05rem; }

            /* Responsive Layout */
            @media (max-width: 960px) {
                .grid-container {
                    grid-template-columns: 1fr;
                }
                .filter-controls-bar {
                    grid-template-columns: 1fr 1fr;
                }
            }

            @media (max-width: 600px) {
                .filter-controls-bar {
                    grid-template-columns: 1fr;
                }
                .snapshot-summary {
                    grid-template-columns: 1fr;
                }
                .history-card-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
            }
        `}</style>
        <div className="dashboard-page-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <header className="dashboard-header">
                <h1 className="welcome-title">Welcome back {loggedInUser || 'User'}</h1>
                <p className="welcome-sub">Track and manage your finances easily • Today is {formattedToday}</p>
            </header>

            <main className="grid-container">
                {/* Left Column */}
                <div className="left-column">
                    <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
                    <ExpenseForm addTransaction={addTransaction} />
                </div>

                {/* Right Column */}
                <div className="right-column">
                    {/* Update Monthly Income Card */}
                    <div className="card">
                        <div className="income-form-header">
                            <span className="card-title-badge">₹</span>
                            <h3 className="card-title-inline">Update Monthly Income</h3>
                        </div>
                        <form onSubmit={handleIncomeSubmit} className="form">
                            <div>
                                <label className="form-label">Enter Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={incomeAmt} 
                                    onChange={(e) => setIncomeAmt(e.target.value)} 
                                    className="form-input-grey" 
                                    placeholder="50000" 
                                />
                            </div>
                            <button type="submit" className="button purple-btn">
                                Update Income 🔄
                            </button>
                        </form>
                    </div>

                    {/* Expense Breakdown Card */}
                    <div className="card" style={{ minHeight: '260px' }}>
                         <div className="income-form-header">
                             <span className="card-title-badge">📊</span>
                             <h3 className="card-title-inline">Expense Breakdown</h3>
                         </div>
                         <ResponsiveContainer width="100%" height={220}>
                             <PieChart>
                                 <Pie 
                                    data={expenseData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={55}
                                    outerRadius={85} 
                                    fill="#5B21B6" 
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                 >
                                     {expenseData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`}/>
                             </PieChart>
                         </ResponsiveContainer>
                    </div>

                    {/* Transaction History & Filter Section */}
                    <ExpenseTable 
                        expenses={expenses} 
                        deleteExpens={deleteExpens} 
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        applyFilters={applyFilters}
                        clearFilters={clearFilters}
                    />
                </div>
            </main>
        </div>
        </>
    );
}

export default Expenses;
