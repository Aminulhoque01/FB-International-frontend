
"use clinet"
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { useCreateServiceMutation, useGetAllServiceQuery, useLazyUpdatedServiceQuery, useUpdatedServiceQuery } from '@/redux/features/service/service';

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

const categories = ['Food', 'Transport', 'Shopping', 'Others'];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function HeroSection() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [createService]= useCreateServiceMutation();
  console.log(createService)
   const {data:allService}=useGetAllServiceQuery();
   console.log(allService);

   const [updatedService]= useUpdatedServiceQuery({id});

   const [updatedService]=useLazyUpdatedServiceQuery({id, data})

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    amount: '',
    category: categories[0],
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Prepare data for pie chart
  // const chartData = categories.map(category => ({
  //   name: category,
  //   value: expenses
  //     .filter(exp => exp.category === category)
  //     .reduce((sum, exp) => sum + exp.amount, 0),
  // })).filter(data => data.value > 0);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) return;

    if (isEditing) {
      setExpenses(expenses.map(exp => 
        exp.id === formData.id ? { ...exp, ...formData, amount: parseFloat(formData.amount) } : exp
      ));
      setIsEditing(false);
    } else {
      setExpenses([
        ...expenses,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
        },
      ]);
    }
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      amount: '',
      category: categories[0],
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  // Handle edit
  const handleEdit = (expense: Expense) => {
    setIsEditing(true);
    setFormData({
      id: expense.id,
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Filter expenses
  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Expense Tracker</h1>

        {/* Total Expenses */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-2xl text-green-600">${totalExpenses.toFixed(2)}</p>
        </div>

        {/* Expense Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter expense title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter amount"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Update Expense' : 'Add Expense'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); resetForm(); }}
                  className="w-full mt-2 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filter and Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter & Analytics</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="mt-1 p-2 w-full md:w-1/4 border rounded-md"
            >
              <option value="All">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="h-64">
            {/* <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer> */}
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">No expenses found.</p>
            ) : (
              filteredExpenses.map(expense => (
                <div
                  key={expense.id}
                  className="border rounded-lg p-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-medium">{expense.title}</h3>
                    <p className="text-gray-600">${expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{expense.date}</p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        expense.category === 'Food' ? 'bg-red-200 text-red-800' :
                        expense.category === 'Transport' ? 'bg-blue-200 text-blue-800' :
                        expense.category === 'Shopping' ? 'bg-green-200 text-green-800' :
                        'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="flex-1 bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="flex-1 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}