import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Supplier() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [complianceRecords, setComplianceRecords] = useState([{ metric: "", value: "", status: "" }]);
  const [analysis, setAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/suppliers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch supplier details");
        }
        const result = await response.json();
        setSupplier(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleAddRecord = () => {
    setComplianceRecords([...complianceRecords, { metric: "", value: "", status: "" }]);
  };

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = complianceRecords.map((record, i) =>
      i === index ? { ...record, [field]: value } : record
    );
    setComplianceRecords(updatedRecords);
  };

  const handleUpload = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/suppliers/check-compliance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplier_id: id, compliance_records: complianceRecords })
      });
      const result = await response.json();
      setAnalysis(result.insights.analysis);
    } catch (err) {
      setError("Failed to analyze compliance data");
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  const fetchInsights = async () => {
    setLoadingAnalysis(true); // Start loading
    try {
      const response = await fetch(`http://127.0.0.1:8000/suppliers/insights/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch compliance insights");
      }
      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAnalysis(false); // Stop loading
    }
  };

  if (loading) {
    return <p>Loading supplier details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50">
      {supplier && (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Supplier Details</h2>
            <div className="space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => setShowModal(true)}
              >
                Upload Compliance Data
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={fetchInsights}
              >
                Get Compliance Insights
              </button>
            </div>
          </div>
          <p><strong>Name:</strong> {supplier.name}</p>
          <p><strong>Country:</strong> {supplier.country}</p>
          <p><strong>Compliance Score:</strong> {supplier.compliance_score}</p>
          <p><strong>Last Audit:</strong> {new Date(supplier.last_audit).toLocaleDateString()}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Contract Terms</h3>
          <ul className="list-disc pl-5">
            <li><strong>Delivery Time:</strong> {supplier.contract_terms.delivery_time}</li>
            <li><strong>Discount Rate:</strong> {supplier.contract_terms.discount_rate}%</li>
            <li><strong>Quality Standard:</strong> {supplier.contract_terms.quality_standard}</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Compliance Records</h3>
          <div className="overflow-y-auto max-h-96 border rounded-lg p-3">
            {supplier.ComplianceRecords.length > 0 ? (
              <ul className="space-y-2">
                {supplier.ComplianceRecords.map((record) => (
                  <li key={record.id} className="border-b pb-2">
                    <p><strong>Metric:</strong> {record.metric}</p>
                    <p><strong>Date Recorded:</strong> {new Date(record.date_recorded).toLocaleDateString()}</p>
                    <p><strong>Result:</strong> {record.result}</p>
                    <p><strong>Status:</strong> {record.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No compliance records found.</p>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Upload Compliance Data</h2>
            {complianceRecords.map((record, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder="Metric"
                  value={record.metric}
                  onChange={(e) => handleRecordChange(index, "metric", e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={record.value}
                  onChange={(e) => handleRecordChange(index, "value", e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Status"
                  value={record.status}
                  onChange={(e) => handleRecordChange(index, "status", e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
              </div>
            ))}
            <button
              onClick={handleAddRecord}
              className="text-blue-500 underline text-sm mb-4"
            >
              Add Another Record
            </button>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isSubmitting ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingAnalysis && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Fetching Insights...</h2>
            <p>Please wait while we gather compliance insights.</p>
          </div>
        </div>
      )}

      {analysis && !loadingAnalysis && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Compliance Insights</h2>
            <pre className="whitespace-pre-wrap max-h-64 overflow-y-auto">{analysis}</pre>
            <button
              onClick={() => setAnalysis(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Supplier;
