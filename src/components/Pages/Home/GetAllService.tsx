



"use client"

import { useDeleteServiceMutation, useGetAllServiceQuery, useUpdatedServiceMutation } from '@/redux/features/service/Service';
import { FC, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO } from 'date-fns';

const categories = ["Food", "Transport", "Shopping", "Others"];

const ServicesPage: FC = () => {
    const { data, error, isLoading } = useGetAllServiceQuery({});
    const [deleteService] = useDeleteServiceMutation();
    const [updatedService] = useUpdatedServiceMutation();
    const [editingService, setEditingService] = useState<any>(null);

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
        } catch (err) {
            toast.error('Failed to delete service', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleEdit = (service: any) => {
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
                    amount: parseFloat(editingService.amount),
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
            console.error('Update error:', err); // Log the error for debugging
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
    const services = Array.isArray(data?.data?.attributes)
        ? data.data.attributes
        : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
                ? data
                : [];
    console.log('services', services);

    if (isLoading) return <div className="text-center text-gray-500">Loading...</div>;

    if (!services || services.length === 0) return <div className="text-center text-gray-500">No services available</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            {editingService && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={editingService.title || ''}
                                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter service title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={editingService.amount || ''}
                                onChange={(e) => setEditingService({ ...editingService, amount: e.target.value })}
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
                                Update Service
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center">No services found.</p>
                ) : (
                    services.map((service: { _id: string; title: string; amount: number; date: string; category: string; description: string }) => (
                        <div
                            key={service._id}
                            className="border rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-medium">{service.title}</h3>
                                <p className="text-gray-600">${service.amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{format(parseISO(service.date), "yyyy-MM-dd")}</p>
                                <span
                                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${service.category === "Food"
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
                                <p className="text-sm text-gray-500 mt-2">{service.description}</p>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service._id)}
                                    className="flex-1 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ServicesPage;