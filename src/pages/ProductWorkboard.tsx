import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

interface Step {
  id: number;
  title: string;
  checked: boolean;
  showMenu?: boolean;
  showDatePicker?: boolean;
  completionDate?: string;
}

interface Task {
  id: number;
  title: string;
  priority: string;
  assignTo: string;
  description: string;
  linkedSteps: number[];
  status?: string;
  dueDate?: string;
  createdBy: string; // 👈 Add this
}


interface PhaseData {
  steps: Step[];
  tasks: Task[];
}
localStorage.setItem("currentUser", "You");


const ProductWorkbook: React.FC = () => {
  const phases = [
    "Ideation & Conceptualization",
    "Market Research & Validation",
    "Requirements Gathering & Planning",
    "Prototyping & Design",
    "Development (MVP & Iterations)",
    "Testing & Quality Assurance",
    "Pre-Launch (Go-to-Market)",
    "Launch",
    "Post-Launch Monitoring & Iteration",
    "Scaling & Growth",
    "Maintenance & End-of-Life",
  ];

  const [mentors, setMentors] = useState<string[]>([
    "You",
    "Riya",
    "Rohit",
    "Ankit",
  ]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

React.useEffect(() => {
  const user = localStorage.getItem("currentUser");
  setCurrentUser(user);
}, []);
 // or however you store logged-in user info

  const [selectedMentor, setSelectedMentor] = useState("Mentor");
  const [isOpen, setIsOpen] = useState(false);
  const [activePhase, setActivePhase] = useState(0);

  const [phaseData, setPhaseData] = useState<PhaseData[]>(
    phases.map(() => ({
      steps: [
        { id: 1, title: "Step A", checked: false },
        { id: 2, title: "Step B", checked: false },
        { id: 3, title: "Step C", checked: false },
      ],
      tasks: [],
    }))
  );
  const [dueDate, setDueDate] = useState("");


  const [newStep, setNewStep] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignTo, setAssignTo] = useState("");
  const [description, setDescription] = useState("");

  // --- toggle step check
  const handleCheck = (id: number) => {
    setPhaseData((prev) =>
      prev.map((phase, i) =>
        i === activePhase
          ? {
              ...phase,
              steps: phase.steps.map((s) =>
                s.id === id ? { ...s, checked: !s.checked } : s
              ),
            }
          : phase
      )
    );
  };

  // --- add step
  const handleAddStep = () => {
    if (!newStep.trim()) return;
    setPhaseData((prev) =>
      prev.map((phase, i) =>
        i === activePhase
          ? {
              ...phase,
              steps: [
                ...phase.steps,
                { id: Date.now(), title: newStep, checked: false },
              ],
            }
          : phase
      )
    );
    setNewStep("");
  };

  // --- add mentor dynamically if new person assigned
  const addMentorIfNew = (name: string) => {
    if (name && !mentors.includes(name)) {
      setMentors((prev) => [...prev, name]);
    }
  };

  // --- create task for selected / focused step(s)
  const handleCreateTask = (
  type: "selected" | "focused",
  focusedStepId?: number
) => {
  if (!taskTitle.trim()) {
    alert("Task title is required!");
    return;
  }

  const newTask: Task = {
    id: Date.now(), // unique id
    title: `${taskTitle} (${type === "selected" ? "Selected" : "Focused"})`,
    priority,
    assignTo,
    description,
    dueDate,
    status: "Pending",
    createdBy: currentUser, // 👈 save who created it
    linkedSteps:
      type === "focused"
        ? focusedStepId
          ? [focusedStepId]
          : []
        : phaseData[activePhase].steps
            .filter((s) => s.checked)
            .map((s) => s.id),
  };

  if (newTask.linkedSteps.length === 0) {
    alert("Please select or focus a step before creating task!");
    return;
  }

  addMentorIfNew(assignTo);

  setPhaseData((prev) =>
    prev.map((phase, i) =>
      i === activePhase
        ? { ...phase, tasks: [...phase.tasks, newTask] }
        : phase
    )
  );

  // Reset
  setTaskTitle("");
  setPriority("Medium");
  setAssignTo("");
  setDescription("");
  setDueDate("");
};
const handleStatusChange = (taskId: number, newStatus: string) => {
  setPhaseData((prev) =>
    prev.map((phase, i) =>
      i === activePhase
        ? {
            ...phase,
            tasks: phase.tasks.map((t) =>
              t.id === taskId ? { ...t, status: newStatus } : t
            ),
          }
        : phase
    )
  );
};

const handleDeleteTask = (taskId: number) => {
  setPhaseData((prev) =>
    prev.map((phase, i) =>
      i === activePhase
        ? { ...phase, tasks: phase.tasks.filter((t) => t.id !== taskId) }
        : phase
    )
  );
};


  const currentPhase = phaseData[activePhase];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-4 font-sans w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-xl font-bold">
            PD
          </div>
          <div>
            <h1 className="text-xl font-semibold">Product Workboard</h1>
            <p className="text-sm text-gray-400">
              Each phase has its own steps and tasks.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Mentor Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-1 bg-gray-800 rounded-md text-sm text-white flex items-center justify-between w-32"
            >
              {selectedMentor}
              <svg
                className="ml-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {mentors.map((mentor) => (
                    <button
                      key={mentor}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setIsOpen(false);
                      }}
                    >
                      {mentor}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="px-3 py-1 bg-gray-800 rounded-md text-sm">
            Export Workspace
          </button>
          <button className="px-3 py-1 bg-gray-800 rounded-md text-sm">
            Import Workspace
          </button>
        </div>
      </div>

      {/* Phases */}
      <div className="bg-gradient-to-b from-gray-800 to-black shadow-lg hover:shadow-indigo-500/40 transition rounded-xl p-4 flex gap-4 overflow-x-auto w-full max-w-full mb-6">
        {phases.map((title, index) => (
          <div
            key={index}
            onClick={() => setActivePhase(index)}
            className={`flex-shrink-0 flex items-center gap-3 rounded-full px-5 py-3 cursor-pointer ${
              activePhase === index
                ? "bg-gradient-to-r from-cyan-400 to-purple-500"
                : "bg-gray-800"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                activePhase === index ? "bg-black/20" : "bg-gray-700"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-sm font-semibold ${
                  activePhase === index ? "text-white" : "text-gray-300"
                }`}
              >
                {title}
              </span>
              <span
                className={`text-xs ${
                  activePhase === index ? "text-white/70" : "text-gray-400"
                }`}
              >
                {phaseData[index].steps.filter((s) => s.checked).length} /{" "}
                {phaseData[index].steps.length} done
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Steps Section */}
      <div className="bg-gradient-to-b from-gray-800 to-black shadow-lg hover:shadow-indigo-500/40 transition rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">
          Steps to be followed — {phases[activePhase]}
        </h2>

        <div className="space-y-3">
          {currentPhase.steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between bg-[#111827] rounded-lg px-4 py-3 relative"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={step.checked}
                  onChange={() => handleCheck(step.id)}
                  className="w-5 h-5 accent-cyan-400"
                />
                <span className="text-gray-200 font-medium">{step.title}</span>
              </div>

              {/* kebab */}
              <div className="relative">
                <button
                  onClick={() =>
                    setPhaseData((prev) =>
                      prev.map((phase, i) =>
                        i === activePhase
                          ? {
                              ...phase,
                              steps: phase.steps.map((s) =>
                                s.id === step.id
                                  ? { ...s, showMenu: !s.showMenu }
                                  : s
                              ),
                            }
                          : phase
                      )
                    )
                  }
                  className="text-gray-400 hover:text-gray-200"
                >
                  ⋮
                </button>

                {step.showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20 p-1">
                    <button
                      onClick={() => {
                        handleCreateTask("focused", step.id);
                        setPhaseData((prev) =>
                          prev.map((phase, i) =>
                            i === activePhase
                              ? {
                                  ...phase,
                                  steps: phase.steps.map((s) =>
                                    s.id === step.id
                                      ? { ...s, showMenu: false }
                                      : s
                                  ),
                                }
                              : phase
                          )
                        );
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Create task (focus)
                    </button>
                    <button
                      onClick={() =>
                        setPhaseData((prev) =>
                          prev.map((phase, i) =>
                            i === activePhase
                              ? {
                                  ...phase,
                                  steps: phase.steps.filter(
                                    (s) => s.id !== step.id
                                  ),
                                }
                              : phase
                          )
                        )
                      }
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center mt-4 gap-2">
          <input
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Add step title..."
            className="flex-1 bg-[#111827] rounded-md px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleAddStep}
            className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Create Task Section */}
      <div className="bg-gradient-to-b from-gray-800 to-black shadow-lg hover:shadow-indigo-500/40 transition rounded-xl p-5 mt-6">
  <h2 className="text-lg font-semibold mb-3">Create Task</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Task Title */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">
        Task Title (required)
      </label>
      <input
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="E.g. Prepare interview script"
        className="w-full bg-[#111827] rounded-md px-3 py-2 text-sm focus:outline-none"
      />
    </div>

    {/* Priority */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">Priority</label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full bg-[#111827] rounded-md px-3 py-2 text-sm focus:outline-none"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
  </div>

  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Assign To */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">
        Assign to (name)
      </label>
      <input
        value={assignTo}
        onChange={(e) => setAssignTo(e.target.value)}
        placeholder="E.g. Riya"
        className="w-full bg-[#111827] rounded-md px-3 py-2 text-sm focus:outline-none"
      />
    </div>

    {/* Due Date Picker */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full bg-[#111827] text-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  </div>

  {/* Description */}
  <div className="mt-4">
    <label className="block text-sm text-gray-400 mb-1">Description</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Optional details"
      rows={3}
      className="w-full bg-[#111827] rounded-md px-3 py-2 text-sm focus:outline-none"
    />
  </div>

  {/* Buttons */}
  <div className="mt-5 flex flex-wrap gap-3">
    <button
      onClick={() => handleCreateTask("selected")}
      className="bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-2 rounded-md font-semibold text-sm"
    >
      Create for Selected Steps
    </button>
    <button
      onClick={() => handleCreateTask("focused")}
      className="bg-gray-700 px-5 py-2 rounded-md hover:bg-gray-600 text-sm"
    >
      Create for Focused Step
    </button>
  </div>
</div>

      {/* Created Tasks Section */}
      {currentPhase.tasks.length > 0 && (
  <div className="mt-6 w-full  mx-auto">
    <h3 className="text-lg font-semibold text-indigo-300 mb-4">
      Created Tasks : Assigned Tasks
    </h3>

    {currentPhase.steps.map((step) => {
      const stepTasks = currentPhase.tasks.filter((t) =>
        t.linkedSteps.includes(step.id)
      );

      return (
        <div
          key={step.id}
          className="bg-[#111827] p-5 rounded-2xl mb-6 shadow-md border border-gray-800"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-semibold text-white">
              {step.title}
            </h4>
            <span className="text-sm text-gray-400">
              {stepTasks.length} {stepTasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {stepTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tasks yet for this step.
            </p>
          ) : (
            <ul className="space-y-3">
              {stepTasks.map((t, i) => (
                <li
                  key={i}
                  className="relative bg-[#1f2937] p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors duration-200"
                >
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full ${
                      t.status === "Pending"
                        ? "bg-purple-700 text-purple-200"
                        : t.status === "Completed"
                        ? "bg-green-700 text-green-200"
                        : "bg-blue-700 text-blue-200"
                    }`}
                  >
                    {t.status}
                  </span>

                  {/* Task Info */}
                  <div className="mb-2">
                    <h5 className="text-white font-semibold text-base">
                      {t.title}
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      By <b>Mentor (You)</b> • To{" "}
                      <b>{t.assignTo || "Unassigned"}</b> • Priority:{" "}
                      <span className="capitalize">{t.priority}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-3">
  <select
    value={t.status}
    onChange={(e) => handleStatusChange(t.id, e.target.value)}
    className="bg-[#111827] text-white rounded-md px-3 py-1 text-xs border border-gray-700"
  >
    <option value="Pending">Pending</option>
    <option value="Review">Review</option>
    <option value="Completed">Completed</option>
    <option value="Inprogress">Inprogress</option>
    <option value="Approved">Approved</option>
  </select>

  {/* Delete button only if current user is creator */}
  {t.createdBy === currentUser && (
    <button
      onClick={() => handleDeleteTask(t.id)}
      className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-lg"
    >
      Delete
    </button>
  )}

  <button className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-lg cursor-not-allowed">
    Details
  </button>

  <button
    onClick={() => handleStatusChange(t.id, "Review")}
    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-4 py-1 rounded-lg font-medium"
  >
    Mark For Review
  </button>
</div>

                </li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
  </div>
)}

    </div>
  );
};

export default ProductWorkbook;
