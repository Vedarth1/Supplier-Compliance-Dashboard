import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    country: '',
    compliance_score: '',
    contract_terms: {
      delivery_time: '',
      discount_rate: '',
      quality_standard: '',
    },
    last_audit: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/suppliers');
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setSuppliers(result.data);
        } else {
          throw new Error('Suppliers data is not in the expected format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("contract_terms.")) {
      const field = name.split(".")[1];
      setNewSupplier(prevState => ({
        ...prevState,
        contract_terms: { ...prevState.contract_terms, [field]: value },
      }));
    } else {
      setNewSupplier(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/create_supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      if (!response.ok) {
        throw new Error('Failed to create supplier');
      }
      const result = await response.json();
      if (result) {
        setSuppliers(prevSuppliers => [...prevSuppliers, result]);
        setShowModal(false);
        toast.success("Supplier created successfully!");
      } else {
        throw new Error('Failed to create supplier');
      }
    } catch (err) {
      setError(err.message);
      toast.error("Error creating supplier: " + err.message);
    }
  };

  const handleViewSupplier = (id) => {
    navigate(`/supplier/${id}`);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
            <p className="text-gray-600">
              A list of all the suppliers around the globe with their Name, Country, Contract Terms, and Compliance Score.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Supplier
          </button>
        </div>

        {loading && <p>Loading suppliers...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="overflow-auto max-h-96">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Name</th>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Country</th>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Delivery Time</th>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Discount Rate</th>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Quality Standard</th>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Compliance Score</th>
                <th className="text-left font-semibold text-gray-600 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{supplier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{supplier.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{supplier.contract_terms.delivery_time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{supplier.contract_terms.discount_rate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{supplier.contract_terms.quality_standard}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{supplier.compliance_score}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewSupplier(supplier.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No suppliers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Supplier Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h3 className="text-lg font-semibold mb-4">Add New Supplier</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.country}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="compliance_score"
                  placeholder="Compliance Score"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.compliance_score}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="contract_terms.delivery_time"
                  placeholder="Delivery Time"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.contract_terms.delivery_time}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="contract_terms.discount_rate"
                  placeholder="Discount Rate"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.contract_terms.discount_rate}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="contract_terms.quality_standard"
                  placeholder="Quality Standard"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.contract_terms.quality_standard}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="datetime-local"
                  name="last_audit"
                  placeholder="Last Audit Date"
                  className="w-full p-2 border rounded mb-2"
                  value={newSupplier.last_audit}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
