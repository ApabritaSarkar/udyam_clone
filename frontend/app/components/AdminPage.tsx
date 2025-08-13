"use client";
import { useState } from "react";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    if (!key.trim()) {
      setError("Please enter an admin key");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/submissions", {
        headers: { "x-admin-key": key }
      });
      if (!res.ok) {
        setError("Invalid admin key or unauthorized");
        setData([]);
        return;
      }
      const json = await res.json();
      setData(json);
      setError("");
    } catch (e) {
      setError("Error fetching submissions. Please check your connection.");
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchData();
  };

  const filteredData = data.filter((row) => {
    const query = search.toLowerCase();
    return (
      row.id.toString().includes(query) ||
      row.step.toString().includes(query) ||
      JSON.stringify(row.data).toLowerCase().includes(query)
    );
  });

  const exportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ["ID", "Step", "Data", "Created At"];
    const rows = filteredData.map((r) => [
      r.id,
      r.step,
      JSON.stringify(r.data).replace(/"/g, '""'), // escape quotes
      new Date(r.createdAt).toLocaleString()
    ]);
    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "submissions.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-700 to-gray-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-200 mt-2">View and manage form submissions</p>
          </div>

          {/* Admin Key */}
          <div className="p-8">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Access Key
              </label>
              <div className="flex space-x-3">
                <input
                  type="password"
                  placeholder="Enter your admin key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 border rounded-lg"
                />
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg"
                >
                  {loading ? "Loading..." : "Load"}
                </button>
              </div>
            </div>

            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>

        {/* Search & Export */}
        {data.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by ID, step, or data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-1/2"
            />
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Download CSV
            </button>
          </div>
        )}

        {/* Table */}
        {filteredData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Step</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4">{row.id}</td>
                    <td className="px-6 py-4">Step {row.step}</td>
                    <td className="px-6 py-4 text-sm">
                      {JSON.stringify(row.data)}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
