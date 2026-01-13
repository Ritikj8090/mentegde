import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import NavbarMentor from "../../components/mentorDashboard/NavbarMentor";
import {
  Briefcase,
  Trash2,
  CheckCircle2,
  Users,
  RefreshCcw,
  Pencil,
  Save,
  X,
} from "lucide-react";

const API_URL = "https://localhost:4000/api/internships"; // Backend API base

// Types
interface DomainPayload {
  id?: number;
  domain_name: "Tech" | "Management";
  skills: string;
  tasks: string;
  hours: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  view_details?: string;
  limit_value?: string;
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
  status?:
    | "draft"
    | "posted"
    | "cohost"
    | "pending_cohost"
    | "published"
    | "updated_by_cohost";
  domains?: DomainPayload[];
}

interface InternshipForm {
  hostRole: string;
  hostName: string;
  internTitle: string;
  internId: string;
  internCategory: string;
  hours: string;
  startDate: string;
  endDate: string;
  duration: string;
  tasks: string;
  skills: string;
  limit: string;
  seatsLeft: number;
  price: string;
  cohost: string;
  tools: string;
  marketplace: string;
  smallDetails: string;
  viewDetails: string;
  domains: DomainPayload[];
}

const emptyDomain = (name: "Tech" | "Management"): DomainPayload => ({
  domain_name: name,
  skills: "",
  tasks: "",
  hours: "",
  start_date: "",
  end_date: "",
  duration: "",
  view_details: "",
  limit_value: "",
});

const CreateInternship: React.FC = () => {
  const [hostDomain, setHostDomain] = useState<"Tech" | "Management">("Tech");
  const coHostDomain = hostDomain === "Tech" ? "Management" : "Tech";
  const [form, setForm] = useState<InternshipForm>({
    hostRole: "",
    hostName: "",
    internTitle: "",
    internId: "",
    internCategory: "",
    hours: "",
    startDate: "",
    endDate: "",
    duration: "",
    tasks: "",
    skills: "",
    limit: "",
    seatsLeft: 0,
    price: "",
    cohost: "",
    tools: "",
    marketplace: "",
    smallDetails: "",
    viewDetails: "",
    domains: [emptyDomain("Tech"), emptyDomain("Management")],
  });

  const [internships, setInternships] = useState<Internship[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sysLog, setSysLog] = useState<string[]>([]);

  const logAction = (msg: string) => {
    const entry = `[${new Date().toLocaleString()}] ${msg}`;
    setSysLog((prev) => [entry, ...prev]);
  };

  // Fetch internships from backend
  const fetchInternships = async () => {
    try {
      const res = await axios.get<Internship[]>(API_URL);
      setInternships(res.data);
      logAction("Fetched internships successfully.");
    } catch (error) {
      console.error("Error fetching internships:", error);
      logAction("Error fetching internships.");
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // @ts-ignore - dynamic key
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Handle changes for domain fields (index 0 = Tech, 1 = Management)
  const handleDomainChange = (
    index: number,
    field: keyof DomainPayload,
    value: string
  ) => {
    setForm((prev) => {
      const newDomains = prev.domains.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      );
      return { ...prev, domains: newDomains };
    });
  };

  // Create or Update Internship
  const handleCreateOrUpdate = async () => {
    if (!form.internId || !form.internTitle || !form.hostName) {
      alert("Please fill required fields: Internship ID, Title, Host Name.");
      return;
    }

    // Ensure domains exist (safety)
    if (!form.domains || form.domains.length < 2) {
      alert("Both domains (Tech and Management) must be present.");
      return;
    }

    try {
      const payload = {
        hostRole: form.hostRole,
        hostName: form.hostName,
        internTitle: form.internTitle,
        internId: form.internId,
        internCategory: form.internCategory,

        price: form.price,
        cohost: form.cohost,
        tools: form.tools,
        marketplace: form.marketplace,
        smallDetails: form.smallDetails,
        viewDetails: form.viewDetails,

        domains: form.domains,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        logAction(`Updated internship ${form.internId} (id=${editingId})`);
      } else {
        await axios.post(API_URL, payload);
        logAction(`Created internship ${form.internId}`);
      }

      // reset
      setForm({
        hostRole: "",
        hostName: "",
        internTitle: "",
        internId: "",
        internCategory: "",
        hours: "",
        startDate: "",
        endDate: "",
        duration: "",
        tasks: "",
        skills: "",
        limit: "",
        seatsLeft: 0,
        price: "",
        cohost: "",
        tools: "",
        marketplace: "",
        smallDetails: "",
        viewDetails: "",
        domains: [emptyDomain("Tech"), emptyDomain("Management")],
      });
      setEditingId(null);
      fetchInternships();
    } catch (error) {
      console.error("Error creating/updating internship:", error);
      alert("Something went wrong while saving the internship.");
    }
  };

  // Edit Internship: populate form, including domains
  const handleEdit = (id: number) => {
    const internship = internships.find((x) => x.id === id);
    if (!internship) return;

    // --- Domains from backend ---
    const domainsFromBackend = internship.domains || [];

    const techDomain =
      domainsFromBackend.find((d) => d.domain_name?.toLowerCase() === "tech") ||
      emptyDomain("Tech");

    const mgmtDomain =
      domainsFromBackend.find(
        (d) => d.domain_name?.toLowerCase() === "management"
      ) || emptyDomain("Management");

    // --- Decide host domain (priority: Tech > Management) ---
    const detectedHostDomain: "Tech" | "Management" =
      techDomain.skills || techDomain.tasks || techDomain.hours
        ? "Tech"
        : "Management";

    // ✅ VERY IMPORTANT
    setHostDomain(detectedHostDomain);

    // --- Set form ---
    setForm({
      hostRole: internship.host_role || "",
      hostName: internship.host_name || "",
      internTitle: internship.intern_title || "",
      internId: internship.intern_id || "",
      internCategory: internship.intern_category || "",
      hours: internship.hours || "",
      startDate: internship.start_date || "",
      endDate: internship.end_date || "",
      duration: internship.duration || "",
      tasks: internship.tasks || "",
      skills: internship.skills || "",
      limit: internship.limit_value || "",
      seatsLeft: internship.seats_left || 0,
      price: internship.price || "",
      cohost: internship.cohost || "",
      tools: internship.tools || "",
      marketplace: internship.marketplace || "",
      smallDetails: internship.small_details || "",
      viewDetails: internship.view_details || "",
      domains: [
        {
          id: techDomain.id, // 🔥 ADD THIS
          domain_name: "Tech",
          skills: techDomain.skills || "",
          tasks: techDomain.tasks || "",
          hours: techDomain.hours || "",
          start_date: techDomain.start_date || "",
          end_date: techDomain.end_date || "",
          duration: techDomain.duration || "",
          view_details: techDomain.view_details || "",
          limit_value: techDomain.limit_value || "",
        },
        {
          id: mgmtDomain.id, // 🔥 ADD THIS
          domain_name: "Management",
          skills: mgmtDomain.skills || "",
          tasks: mgmtDomain.tasks || "",
          hours: mgmtDomain.hours || "",
          start_date: mgmtDomain.start_date || "",
          end_date: mgmtDomain.end_date || "",
          duration: mgmtDomain.duration || "",
          view_details: mgmtDomain.view_details || "",
          limit_value: mgmtDomain.limit_value || "",
        },
      ],
    });

    setEditingId(id);
  };

  // Send to Host (co-host flow)
  const handleSendToHost = async (id: number) => {
    try {
      await axios.put(`${API_URL}/${id}/send-to-host`);
      logAction(`Internship ${id} sent back to host by Co-host`);
      fetchInternships();
    } catch (error) {
      console.error("Error sending internship to host:", error);
      alert("Failed to send internship to host");
    }
  };

  // Delete Internship
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this internship?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchInternships();
      logAction(`Deleted internship with ID ${id}`);
    } catch (error) {
      console.error("Error deleting internship:", error);
      alert("Failed to delete internship");
    }
  };

  // Open for Co-host
  // Open for Co-host
  const handleOpenForCohost = async (id: number) => {
    try {
      await axios.put(`${API_URL}/${id}/open-cohost`);
      logAction(`Internship ${id} opened for Co-host`);
      fetchInternships();
    } catch (error) {
      console.error("Error opening for co-host:", error);
      alert("Failed to open for co-host");
    }
  };

  // Approve & Post
  const handleApproveAndPost = async (id: number) => {
    try {
      await axios.put(`${API_URL}/${id}/approve-post`);
      logAction(`Internship ${id} approved and posted`);
      fetchInternships();
    } catch (error) {
      console.error("Error approving and posting:", error);
      alert("Failed to approve and post internship");
    }
  };

  // Status Badge
  const statusBadge = (status: string | undefined): string => {
    const base =
      "px-3 py-1 text-xs font-semibold rounded-full border inline-block";
    switch (status) {
      case "draft":
        return `${base} bg-yellow-100 text-yellow-800 border-yellow-300`;
      case "pending_cohost":
        return `${base} bg-blue-100 text-blue-800 border-blue-300`;
      case "updated_by_cohost":
        return `${base} bg-purple-100 text-purple-800 border-purple-300`;
      case "published":
      case "posted":
        return `${base} bg-green-100 text-green-800 border-green-300`;
      default:
        return `${base} bg-gray-100 text-gray-700 border-gray-300`;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-zinc-950 text-white">
      <NavbarMentor />

      <div className="grid lg:grid-cols-[480px_1fr_360px] gap-6 p-6">
        {/* Left - Host Form */}
        {/* Left - Host Form */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 bg-zinc-900 border border-zinc-700 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              {editingId ? "Edit Internship" : "Host Mentor Form"}
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              {editingId
                ? "Modify internship details and save changes."
                : "Fill internship details. ID must be unique."}
            </p>

            {/* ================= HOST BASIC FIELDS ================= */}
            {[
              { id: "hostRole", label: "Host Mentor Role" },
              { id: "hostName", label: "Host Mentor Name" },
              { id: "internTitle", label: "Internship Title" },
              { id: "internId", label: "Internship ID" },
              { id: "hours", label: "Expected Weekly Hours (Global)" },
              { id: "price", label: "Price of Internship" },
              { id: "cohost", label: "Co-mentor / Co-host Name" },
              { id: "tools", label: "Tools Used" },
              { id: "marketplace", label: "Marketplace" },
              { id: "smallDetails", label: "Small Details", type: "textarea" },
            ].map((f) => (
              <div key={f.id} className="mb-3">
                <label className="block text-sm text-zinc-400 mb-1">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.id}
                    value={(form as any)[f.id]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
                  />
                ) : (
                  <input
                    id={f.id}
                    value={(form as any)[f.id]}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
                  />
                )}
              </div>
            ))}

            {/* ================= HOST DOMAIN SELECT ================= */}
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">
                Host Mentor Domain
              </label>
              <select
                value={hostDomain}
                onChange={(e) =>
                  setHostDomain(e.target.value as "Tech" | "Management")
                }
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
              >
                <option value="Tech">Tech</option>
                <option value="Management">Management</option>
              </select>

              <p className="text-xs text-zinc-500 mt-1">
                Co-host domain will be automatically set to{" "}
                <span className="text-indigo-400">
                  {hostDomain === "Tech" ? "Management" : "Tech"}
                </span>
              </p>
            </div>

            {/* ================= DOMAIN SPECIFIC (HOST ONLY) ================= */}
            {(() => {
              const domainIndex = form.domains.findIndex(
                (d) => d.domain_name === hostDomain
              );

              if (domainIndex === -1) return null;

              return (
                <div className="mt-4 p-3 rounded-lg border border-zinc-700 bg-zinc-900">
                  <h3 className="font-semibold text-white mb-3">
                    Domain Details ({hostDomain})
                  </h3>

                  <label className="block text-sm text-zinc-400 mb-1">
                    Skills
                  </label>
                  <input
                    value={form.domains[domainIndex].skills}
                    onChange={(e) =>
                      handleDomainChange(domainIndex, "skills", e.target.value)
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    Tasks
                  </label>
                  <textarea
                    rows={3}
                    value={form.domains[domainIndex].tasks}
                    onChange={(e) =>
                      handleDomainChange(domainIndex, "tasks", e.target.value)
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    Hours
                  </label>
                  <input
                    value={form.domains[domainIndex].hours}
                    onChange={(e) =>
                      handleDomainChange(domainIndex, "hours", e.target.value)
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.domains[domainIndex].start_date || ""}
                    onChange={(e) =>
                      handleDomainChange(
                        domainIndex,
                        "start_date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.domains[domainIndex].end_date || ""}
                    onChange={(e) =>
                      handleDomainChange(
                        domainIndex,
                        "end_date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    Duration
                  </label>
                  <input
                    value={form.domains[domainIndex].duration || ""}
                    onChange={(e) =>
                      handleDomainChange(
                        domainIndex,
                        "duration",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    View Details
                  </label>
                  <textarea
                    rows={3}
                    value={form.domains[domainIndex].view_details || ""}
                    onChange={(e) =>
                      handleDomainChange(
                        domainIndex,
                        "view_details",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm mb-2"
                  />

                  <label className="block text-sm text-zinc-400 mb-1">
                    Limit Value
                  </label>
                  <input
                    type="number"
                    value={form.domains[domainIndex].limit_value || ""}
                    onChange={(e) =>
                      handleDomainChange(
                        domainIndex,
                        "limit_value",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm"
                  />
                </div>
              );
            })()}

            {/* ================= ACTION BUTTONS ================= */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleCreateOrUpdate}
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600"
              >
                {editingId ? "Save Changes" : "Create Internship"}
              </Button>

              {editingId && (
                <Button
                  variant="ghost"
                  className="border border-zinc-700 text-zinc-300"
                  onClick={() => {
                    setEditingId(null);
                    setHostDomain("Tech");
                    setForm({
                      hostRole: "",
                      hostName: "",
                      internTitle: "",
                      internId: "",
                      internCategory: "",
                      hours: "",
                      startDate: "",
                      endDate: "",
                      duration: "",
                      tasks: "",
                      skills: "",
                      limit: "",
                      seatsLeft: 0,
                      price: "",
                      cohost: "",
                      tools: "",
                      marketplace: "",
                      smallDetails: "",
                      viewDetails: "",
                      domains: [emptyDomain("Tech"), emptyDomain("Management")],
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Middle - Workflow Center */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 bg-zinc-900 border border-zinc-700 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Workflow Center
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Click buttons to edit, delete, open for co-host, or approve
              internships.
            </p>

            <div className="flex flex-col gap-3">
              {internships.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-zinc-700 rounded-lg p-3 bg-zinc-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">
                        {item.intern_title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        ID: {item.intern_id} • Host: {item.host_name}
                      </p>
                    </div>

                    <span className={statusBadge(item.status)}>
                      {item.status || "draft"}
                    </span>
                  </div>

                  {/* Domains preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {(item.domains || []).map((d, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-md bg-zinc-900 border border-zinc-700"
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-sm">{d.domain_name}</strong>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Skills: {d.skills || "—"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Hours: {d.hours || "—"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {d.tasks
                            ? `${d.tasks.slice(0, 80)}${
                                d.tasks.length > 80 ? "..." : ""
                              }`
                            : "No tasks"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-400 border-zinc-700"
                      onClick={() => handleEdit(item.id)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-zinc-300 border-zinc-700"
                      onClick={() => handleApproveAndPost(item.id)}
                      disabled={item.status === "published"}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve & Post
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-400 border-zinc-700"
                      onClick={() => handleOpenForCohost(item.id)}
                      disabled={item.status === "pending_cohost"}
                    >
                      <Users className="w-4 h-4 mr-1" /> Open for Co-host
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 border-zinc-700"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <span className="text-zinc-400 text-sm">System Log</span>
              <div className="max-h-40 overflow-auto text-xs text-zinc-500 mt-2 bg-zinc-800 p-2 rounded-md whitespace-pre-wrap">
                {sysLog.join("\n")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right - Student Dashboard */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 bg-zinc-900 border border-zinc-700 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              Student Dashboard
            </h2>
            <p className="text-sm text-zinc-500 mb-3">
              Showing approved & posted internships
            </p>

            {internships
              .filter((x) => x.status === "published")
              .map((item) => (
                <div
                  key={item.id}
                  className="border border-zinc-700 rounded-lg p-3 mb-2 bg-zinc-800"
                >
                  <p className="font-semibold text-white">
                    {item.intern_title}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {(item.domains || []).map((d, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-md bg-zinc-900 border border-zinc-700"
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-sm">{d.domain_name}</strong>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Skills: {d.skills || "—"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Hours: {d.hours || "—"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {d.tasks
                            ? `${d.tasks.slice(0, 80)}${
                                d.tasks.length > 80 ? "..." : ""
                              }`
                            : "No tasks"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInternship;
