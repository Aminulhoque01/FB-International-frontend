"use client";
import { useCreateServiceMutation } from '@/redux/features/service/Service';
import { FC, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = ["Food", "Transport", "Shopping", "Others"];

interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

const CreateServicePage: FC = () => {
  const [createService] = useCreateServiceMutation();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Title Length:', formData.title.trim().length);

    if (formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (isNaN(parseFloat(formData.amount))) {
      toast.error('Amount must be a valid number', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      await createService({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      });
      toast.success('Service added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
      });
    } catch (err: unknown) {
      console.error('Error from createService:', err);
      const errorMessage = (err as ApiError)?.data?.message || 'Failed to add service';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter service title"
            minLength={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Service
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateServicePage;