import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = "https://localhost:4000/api/internships";

interface Domain {
  id?: number;
  domain_name: string;
  skills?: string;
  tasks?: string;
  hours?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  view_details?: string;
  limit_value?: number;
}

interface Internship {
  id: number;
  intern_id?: string;
  intern_title?: string;
  host_role?: string;
  host_name?: string;
  intern_category?: string;
  hours?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  tasks?: string;
  skills?: string;
  limit_value?: string;
  seats_left?: number;
  price?: string;
  cohost?: string;
  tools?: string;
  marketplace?: string;
  small_details?: string;
  view_details?: string;
  status?: string;
  domains?: Domain[]; // expects backend to return domains array
}

const InternshipDashboard: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "sent" | "approved">("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [editableDomain, setEditableDomain] = useState<"tech" | "management">("tech");


  // Form state for co-host editable fields + tech domain fields
const [formData, setFormData] = useState({
    hours: "",
  smallDetails: "",
  viewDetails: "",

  domainSkills: "",
  domainTasks: "",
  domainHours: "",
  domainStartDate: "",
  domainEndDate: "",
  domainDuration: "",
  domainViewDetails: "",
  domainLimit: "",
});


  // Fetch internships (expects `domains` array in response)
  const fetchInternships = async () => {
    try {
      const res = await axios.get(API_URL);
      setInternships(res.data);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Filter logic
  const filteredInternships = internships.filter((i) => {
    if (filter === "all") return true;
    if (filter === "open") return i.status === "pending_cohost" || i.status === "cohost";
    if (filter === "approved") return i.status === "posted" || i.status === "published";
    if (filter === "sent") return i.status === "updated_by_cohost" || i.status === "draft";
    return true;
  });

  // Status label badges (unchanged)
  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case "draft":
        return (
          <span className="inline-block bg-yellow-200 text-yellow-900 px-3 py-1 text-xs font-medium rounded-full">
            📝 Draft (Not Yet Sent)
          </span>
        );
      case "pending_cohost":
      case "cohost":
        return (
          <span className="inline-block bg-blue-200 text-blue-900 px-3 py-1 text-xs font-medium rounded-full">
            🤝 Open for Co-host
          </span>
        );
      case "updated_by_cohost":
        return (
          <span className="inline-block bg-purple-200 text-purple-900 px-3 py-1 text-xs font-medium rounded-full">
            ✉️ Sent to Host for Approval
          </span>
        );
      case "posted":
      case "published":
        return (
          <span className="inline-block bg-green-200 text-green-900 px-3 py-1 text-xs font-medium rounded-full">
            ✅ Approved & Posted
          </span>
        );
      default:
        return (
          <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 text-xs font-medium rounded-full">
            ⚙️ Unknown Status
          </span>
        );
    }
  };

  // When Co-host clicks "Add Details"

const handleAddDetails = (intern: Internship) => {
  setSelectedInternship(intern);

  const hostDomain = intern.host_role?.toLowerCase() as "tech" | "management";
  const cohostDomain = hostDomain === "tech" ? "management" : "tech";

  setEditableDomain(cohostDomain);

  const editable = (intern.domains || []).find(
    (d) => d.domain_name.toLowerCase() === cohostDomain
  );

  setFormData({
    domainSkills: editable?.skills ?? "",
    domainTasks: editable?.tasks ?? "",
    domainHours: editable?.hours ?? "",
    domainStartDate: editable?.start_date ?? "",
    domainEndDate: editable?.end_date ?? "",
    domainDuration: editable?.duration ?? "",
    domainViewDetails: editable?.view_details ?? "",
    domainLimit: editable?.limit_value?.toString() ?? "",
    // 🔒 preserve existing common data
  hours: intern.hours ?? "",
  smallDetails: intern.small_details ?? "",
  viewDetails: intern.view_details ?? "",
  });

  setShowForm(true);
};


  // Generic form change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit: build payload with updated generic fields + full domains array (tech updated, management preserved)
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!selectedInternship) return;

  const editableDomainFromDB = selectedInternship.domains?.find(
    (d) => d.domain_name.toLowerCase() === editableDomain
  );

  if (!editableDomainFromDB?.id) {
    alert("Editable domain not found");
    return;
  }

  await axios.put(
    `${API_URL}/${selectedInternship.id}/send-to-host`,
    {
      domain_id: editableDomainFromDB.id,
      hours: formData.domainHours,
      start_date: formData.domainStartDate,
      end_date: formData.domainEndDate,
     limit_value:
  formData.domainLimit === ""
    ? null
    : Number(formData.domainLimit),

      small_details: formData.smallDetails,
      view_details: formData.domainViewDetails,
    }
  );

  setShowForm(false);
  setSelectedInternship(null);
  fetchInternships();
};



  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      {/* Header */}
      <header className="text-center py-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold"
        >
          Internship Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-3 text-gray-400 text-lg"
        >
          Manage, track, and add details to open internships
        </motion.p>
      </header>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mt-6 flex-wrap">
        {["All", "Open", "Sent", "Approved"].map((label) => {
          const key = label.toLowerCase() as "all" | "open" | "sent" | "approved";
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
                filter === key
                  ? "bg-indigo-600 text-white shadow-lg scale-105"
                  : "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Internship Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((intern) => (
            <motion.div
              key={intern.id}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-800 transition-all"
            >
              <div className="mb-3">
                <h2 className="text-xl font-semibold text-indigo-400">{intern.intern_title}</h2>
                <p className="text-xs text-gray-500">
                  ID: {intern.intern_id} • Host: {intern.host_name}
                </p>
              </div>

              {/* <p className="text-gray-300 text-sm mb-3">
                <span className="font-semibold">Category:</span> {intern.intern_category || "Not specified"}
              </p> */}

              <div className="mb-4">{getStatusLabel(intern.status)}</div>

              {intern.status === "pending_cohost" || intern.status === "cohost" ? (
                <button
                  onClick={() => handleAddDetails(intern)}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm px-4 py-2 rounded-md hover:from-indigo-700 hover:to-indigo-800 transition"
                >
                  Add Details
                </button>
              ) : null}
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-sm mt-10">
            No internships found in this category.
          </p>
        )}
      </div>

      {/* Add Details Modal (Co-host) */}
      {showForm && selectedInternship && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 text-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold mb-4 text-center bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Add Internship Details (Co-host)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Read-only fields (host data + global) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Internship Title</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.intern_title ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Internship ID</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.intern_id ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Host Mentor Name</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.host_name ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Host Mentor Role</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.host_role ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Global read-only fields like tasks/skills/tools/price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Global Tasks</label>
                  <textarea
                    readOnly
                    value={selectedInternship.tasks ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Global Skills</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.skills ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Tools</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.tools ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Price</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedInternship.price ?? ""}
                    className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Editable generic fields */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Expected Weekly Hours</label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Small Details</label>
                <textarea
                  name="smallDetails"
                  value={formData.smallDetails}
                  onChange={handleChange}
                  className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">View Details</label>
                <textarea
                  name="viewDetails"
                  value={formData.viewDetails}
                  onChange={handleChange}
                  className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white h-24"
                />
              </div>

              <hr className="border-gray-700 my-3" />

       {/* Editable Domain — Co-host */}
<div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
  <h3 className="text-lg font-semibold text-indigo-300 mb-2">
    {editableDomain.toUpperCase()} Domain (editable)
  </h3>

  {/* Skills */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">
      Skills (comma separated)
    </label>
    <input
      type="text"
      name="domainSkills"
      value={formData.domainSkills}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>

  {/* Tasks */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">Tasks</label>
    <textarea
      name="domainTasks"
      value={formData.domainTasks}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white h-20"
    />
  </div>

  {/* Hours */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">
      Hours
    </label>
    <input
      type="text"
      name="domainHours"
      value={formData.domainHours}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>

  {/* Start Date */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">Start Date</label>
    <input
      type="date"
      name="domainStartDate"
      value={formData.domainStartDate}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>

  {/* End Date */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">End Date</label>
    <input
      type="date"
      name="domainEndDate"
      value={formData.domainEndDate}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>

  {/* Duration */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">Duration</label>
    <input
      type="text"
      name="domainDuration"
      value={formData.domainDuration}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>

  {/* View Details */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">View Details</label>
    <input
      type="text"
      name="domainViewDetails"
      value={formData.domainViewDetails}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>

  {/* Limit Value */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-300">Limit Value</label>
    <input
      type="number"
      name="domainLimit"
      value={formData.domainLimit}
      onChange={handleChange}
      className="w-full mt-1 p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white"
    />
  </div>
</div>


              <hr className="border-gray-700 my-3" />

              {/* Management domain — READ-ONLY */}
             {/* Management domain — READ-ONLY */}
<div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
 <h3 className="text-lg font-semibold text-gray-300 mb-2">
  {selectedInternship.host_role} Domain (read-only)
</h3>

  {(() => {
    const mgmt = (selectedInternship.domains || []).find(
      (d) => d.domain_name?.toLowerCase() === "management"
    );

    return (
      <>
        {/* Skills */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">Skills</label>
          <input
            readOnly
            value={mgmt?.skills ?? "—"}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Tasks */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">Tasks</label>
          <textarea
            readOnly
            value={mgmt?.tasks ?? "—"}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed h-20"
          />
        </div>

        {/* Hours */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">Hours (Management)</label>
          <input
            readOnly
            value={mgmt?.hours ?? "—"}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">Start Date</label>
          <input
            readOnly
            type="date"
            value={mgmt?.start_date ?? ""}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* End Date */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">End Date</label>
          <input
            readOnly
            type="date"
            value={mgmt?.end_date ?? ""}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">Duration</label>
          <input
            readOnly
            value={mgmt?.duration ?? "—"}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* View Details */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">View Details</label>
          <input
            readOnly
            value={mgmt?.view_details ?? "—"}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Limit Value */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">Limit Value</label>
          <input
            readOnly
            type="number"
            value={mgmt?.limit_value ?? "—"}
            className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          />
        </div>
      </>
    );
  })()}
</div>


              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedInternship(null);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InternshipDashboard;
