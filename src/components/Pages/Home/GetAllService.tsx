"use client";

import { useDeleteServiceMutation, useGetAllServiceQuery, useUpdatedServiceMutation } from '@/redux/features/service/Service';
import { FC, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO } from 'date-fns';
 

const categories = ["Food", "Transport", "Shopping", "Others"];

// Define Service interface
interface Service {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

const GetAllService: FC = () => {
  const { data, isLoading } = useGetAllServiceQuery({});
  const [deleteService] = useDeleteServiceMutation();
  const [updatedService] = useUpdatedServiceMutation();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success('Service deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to delete service', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log(error)
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      await updatedService({
        id: editingService._id,
        data: {
          title: editingService.title,
          amount: editingService.amount,
          category: editingService.category,
          date: editingService.date,
        },
      });
      toast.success('Service updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setEditingService(null);
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update service', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  // Ensure data is an array, checking for nested structures
  const services: Service[] = Array.isArray(data?.data?.attributes)
    ? data.data.attributes
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

  // Filter services based on selected category
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((service: Service) => service.category === selectedCategory);

  // Calculate total expense amount for filtered services
  const totalExpense = filteredServices.reduce((sum: number, service: Service) => sum + service.amount, 0);

  if (isLoading) return <div className="text-center text-gray-500">Loading...</div>;

  if (!services || services.length === 0) return <div className="text-center text-gray-500">No services available</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <div className="mb-6 flex justify-between items-center">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Total Expenses: ${totalExpense.toFixed(2)}</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {editingService && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editingService.title || ''}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter expense title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={editingService.amount}
                onChange={(e) => setEditingService({ ...editingService, amount: parseFloat(e.target.value) || 0 })}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={editingService.category || ''}
                onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
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
                value={editingService.date || ''}
                onChange={(e) => setEditingService({ ...editingService, date: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Expense
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Title</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Date</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Category</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Description</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-2 px-4 border-b text-center text-sm text-gray-500">
                  No expenses found for the selected category.
                </td>
              </tr>
            ) : (
              filteredServices.map((service: Service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-sm">{service.title}</td>
                  <td className="py-2 px-4 border-b text-sm">${service.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b text-sm">{format(parseISO(service.date), "yyyy-MM-dd")}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        service.category === "Food"
                          ? "bg-red-200 text-red-800"
                          : service.category === "Transport"
                          ? "bg-blue-200 text-blue-800"
                          : service.category === "Shopping"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {service.category}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-sm">{service.description}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GetAllService;