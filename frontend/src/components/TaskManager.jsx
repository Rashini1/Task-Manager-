import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000";

// ── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ClipboardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button style={styles.iconBtn} onClick={onClose}><CloseIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Task Form ────────────────────────────────────────────────────────────────
function TaskForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    status: initial?.status || "Pending",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.trim().length > 100) e.title = "Max 100 characters";
    if (form.description.length > 500) e.description = "Max 500 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit(form);
  };

  return (
    <div style={styles.formBody}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Task Title <span style={styles.required}>*</span></label>
        <input
          style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
          placeholder="e.g., Review quarterly report"
          value={form.title}
          onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: "" })); }}
          maxLength={100}
        />
        {errors.title && <span style={styles.errorMsg}>{errors.title}</span>}
        <span style={styles.charCount}>{form.title.length}/100</span>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          style={{ ...styles.input, ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
          placeholder="Add details about this task..."
          value={form.description}
          onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: "" })); }}
          maxLength={500}
          rows={3}
        />
        {errors.description && <span style={styles.errorMsg}>{errors.description}</span>}
        <span style={styles.charCount}>{form.description.length}/500</span>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Status</label>
        <div style={styles.statusToggle}>
          {["Pending", "Completed"].map(s => (
            <button
              key={s}
              style={{ ...styles.statusBtn, ...(form.status === s ? (s === "Completed" ? styles.statusBtnActiveCompleted : styles.statusBtnActivePending) : {}) }}
              onClick={() => setForm(f => ({ ...f, status: s }))}
            >
              {s === "Completed" && <CheckIcon />}
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.formActions}>
        <button style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update Task" : "Create Task"}
        </button>
      </div>
    </div>
  );
}

// ── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onEdit, onDelete, onToggleStatus, deleting, toggling }) {
  const isCompleted = task.status === "Completed";

  return (
    <div style={{ ...styles.card, ...(isCompleted ? styles.cardCompleted : {}) }}>
      <div style={styles.cardTop}>
        <div style={styles.cardLeft}>
          <button
            style={{ ...styles.checkbox, ...(isCompleted ? styles.checkboxChecked : {}) }}
            onClick={() => onToggleStatus(task)}
            disabled={toggling}
            title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
          >
            {isCompleted && <CheckIcon />}
          </button>
          <div style={styles.cardContent}>
            <h3 style={{ ...styles.cardTitle, ...(isCompleted ? styles.cardTitleCompleted : {}) }}>
              {task.title}
            </h3>
            {task.description && (
              <p style={styles.cardDesc}>{task.description}</p>
            )}
          </div>
        </div>
        <div style={styles.cardActions}>
          <button style={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">
            <EditIcon />
          </button>
          <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => onDelete(task._id)} disabled={deleting} title="Delete">
            <TrashIcon />
          </button>
        </div>
      </div>
      <div style={styles.cardMeta}>
        <span style={{ ...styles.badge, ...(isCompleted ? styles.badgeCompleted : styles.badgePending) }}>
          {isCompleted ? "✓ Completed" : "● Pending"}
        </span>
        <span style={styles.dateText}>
          {formatDate(task.createdAt)} · {formatTime(task.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={styles.toastContainer}>
      {toasts.map(t => (
        <div key={t.id} style={{ ...styles.toast, ...(t.type === "error" ? styles.toastError : styles.toastSuccess) }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch {
      showToast("Failed to load tasks. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (form) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => [data.data, ...prev]);
        setShowAddModal(false);
        showToast("Task created successfully!");
      } else {
        showToast(data.message || "Failed to create task", "error");
      }
    } catch {
      showToast("Network error. Check your connection.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (form) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${editTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.map(t => t._id === editTask._id ? data.data : t));
        setEditTask(null);
        showToast("Task updated successfully!");
      } else {
        showToast(data.message || "Failed to update task", "error");
      }
    } catch {
      showToast("Network error. Check your connection.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.filter(t => t._id !== id));
        showToast("Task deleted.");
      } else {
        showToast(data.message || "Failed to delete", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    setTogglingId(task._id);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.map(t => t._id === task._id ? data.data : t));
        showToast(`Marked as ${newStatus}!`);
      }
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = tasks.filter(t => filter === "All" ? true : t.status === filter);
  const counts = {
    All: tasks.length,
    Pending: tasks.filter(t => t.status === "Pending").length,
    Completed: tasks.filter(t => t.status === "Completed").length,
  };

  return (
    <div style={styles.app}>
      {/* Background decoration */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <div style={styles.headerEyebrow}>TASK MANAGER</div>
            <h1 style={styles.heading}>Your Workspace</h1>
            <p style={styles.subheading}>
              {counts.Pending > 0
                ? `${counts.Pending} task${counts.Pending > 1 ? "s" : ""} pending · ${counts.Completed} completed`
                : counts.Completed > 0 ? "🎉 All tasks completed!" : "Start by adding your first task"}
            </p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <PlusIcon /> New Task
          </button>
        </header>

        {/* Stats Bar */}
        <div style={styles.statsBar}>
          {["All", "Pending", "Completed"].map(f => (
            <button
              key={f}
              style={{ ...styles.filterChip, ...(filter === f ? styles.filterChipActive : {}) }}
              onClick={() => setFilter(f)}
            >
              <span style={styles.filterLabel}>{f}</span>
              <span style={{ ...styles.filterCount, ...(filter === f ? styles.filterCountActive : {}) }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <main style={styles.main}>
          {loading ? (
            <div style={styles.emptyState}>
              <div style={styles.spinner} />
              <p style={styles.emptyText}>Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><ClipboardIcon /></div>
              <p style={styles.emptyTitle}>
                {filter === "All" ? "No tasks yet" : `No ${filter.toLowerCase()} tasks`}
              </p>
              <p style={styles.emptyText}>
                {filter === "All" ? "Create your first task to get started." : `Switch to "All" or add a new task.`}
              </p>
              {filter === "All" && (
                <button style={styles.emptyAddBtn} onClick={() => setShowAddModal(true)}>
                  <PlusIcon /> Add Task
                </button>
              )}
            </div>
          ) : (
            <div style={styles.taskList}>
              {filtered.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={setEditTask}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  deleting={deletingId === task._id}
                  toggling={togglingId === task._id}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Task">
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowAddModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        <TaskForm
          initial={editTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditTask(null)}
          loading={submitting}
        />
      </Modal>

      <Toast toasts={toasts} />
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0d0d14",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgOrb1: {
    position: "fixed", top: "-200px", right: "-200px",
    width: "600px", height: "600px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgOrb2: {
    position: "fixed", bottom: "-300px", left: "-100px",
    width: "700px", height: "700px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: "760px", margin: "0 auto",
    padding: "48px 24px 80px",
    position: "relative", zIndex: 1,
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "36px",
    flexWrap: "wrap", gap: "16px",
  },
  headerEyebrow: {
    fontSize: "11px", fontWeight: "600", letterSpacing: "3px",
    color: "#6366f1", marginBottom: "8px",
  },
  heading: {
    fontSize: "clamp(28px, 5vw, 40px)", fontWeight: "700",
    color: "#f1f5f9", margin: 0, letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: "15px", color: "#64748b", marginTop: "6px",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "12px 24px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontWeight: "600", fontSize: "14px",
    cursor: "pointer", boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
    transition: "all 0.2s", flexShrink: 0,
    fontFamily: "inherit",
  },
  statsBar: {
    display: "flex", gap: "8px", marginBottom: "28px",
  },
  filterChip: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "8px 16px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
    color: "#64748b", fontWeight: "500", fontSize: "14px",
    cursor: "pointer", transition: "all 0.2s",
    fontFamily: "inherit",
  },
  filterChipActive: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#a5b4fc",
  },
  filterLabel: { },
  filterCount: {
    background: "rgba(255,255,255,0.06)",
    padding: "2px 7px", borderRadius: "6px",
    fontSize: "12px", fontWeight: "600",
  },
  filterCountActive: {
    background: "rgba(99,102,241,0.25)", color: "#a5b4fc",
  },
  main: { },
  taskList: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px", padding: "18px 20px",
    transition: "all 0.2s",
    backdropFilter: "blur(10px)",
  },
  cardCompleted: {
    background: "rgba(16,185,129,0.03)",
    border: "1px solid rgba(16,185,129,0.12)",
    opacity: 0.85,
  },
  cardTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", gap: "12px",
  },
  cardLeft: { display: "flex", gap: "14px", flex: 1, minWidth: 0 },
  cardContent: { flex: 1, minWidth: 0 },
  checkbox: {
    width: "22px", height: "22px", borderRadius: "7px",
    border: "2px solid rgba(255,255,255,0.15)",
    background: "transparent", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: "2px", transition: "all 0.2s",
    color: "#fff",
  },
  checkboxChecked: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "2px solid #10b981",
    boxShadow: "0 0 12px rgba(16,185,129,0.4)",
  },
  cardTitle: {
    fontSize: "16px", fontWeight: "600",
    color: "#e2e8f0", margin: "0 0 4px 0",
    wordBreak: "break-word",
  },
  cardTitleCompleted: {
    textDecoration: "line-through", color: "#475569",
  },
  cardDesc: {
    fontSize: "14px", color: "#64748b",
    margin: 0, lineHeight: "1.5", wordBreak: "break-word",
  },
  cardActions: { display: "flex", gap: "6px", flexShrink: 0 },
  actionBtn: {
    width: "32px", height: "32px", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#64748b", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
  },
  deleteBtn: { },
  cardMeta: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: "14px", paddingTop: "12px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    flexWrap: "wrap", gap: "8px",
  },
  badge: {
    fontSize: "12px", fontWeight: "600", padding: "3px 10px",
    borderRadius: "6px", letterSpacing: "0.3px",
  },
  badgePending: {
    background: "rgba(245,158,11,0.12)",
    color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)",
  },
  badgeCompleted: {
    background: "rgba(16,185,129,0.12)",
    color: "#34d399", border: "1px solid rgba(16,185,129,0.2)",
  },
  dateText: { fontSize: "12px", color: "#475569" },

  // Empty State
  emptyState: {
    textAlign: "center", padding: "80px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
  },
  emptyIcon: { color: "#1e293b", marginBottom: "8px" },
  emptyTitle: { fontSize: "20px", fontWeight: "600", color: "#334155", margin: 0 },
  emptyText: { fontSize: "15px", color: "#475569", margin: 0 },
  emptyAddBtn: {
    marginTop: "8px", display: "flex", alignItems: "center", gap: "6px",
    padding: "10px 20px", borderRadius: "10px", border: "none",
    background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
    fontWeight: "600", fontSize: "14px", cursor: "pointer",
    fontFamily: "inherit",
  },
  spinner: {
    width: "32px", height: "32px", borderRadius: "50%",
    border: "3px solid rgba(99,102,241,0.15)",
    borderTop: "3px solid #6366f1",
    animation: "spin 0.8s linear infinite",
  },

  // Modal
  overlay: {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "#13131f", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px", width: "100%", maxWidth: "480px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
    animation: "slideUp 0.25s ease",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "22px 24px 0",
  },
  modalTitle: {
    fontSize: "20px", fontWeight: "700", color: "#f1f5f9", margin: 0,
  },
  iconBtn: {
    width: "32px", height: "32px", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#64748b", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Form
  formBody: { padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px", position: "relative" },
  label: { fontSize: "13px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.3px" },
  required: { color: "#f87171" },
  input: {
    padding: "11px 14px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0", fontSize: "14px",
    outline: "none", transition: "border-color 0.2s",
    fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  },
  textarea: { resize: "vertical", minHeight: "80px" },
  inputError: { border: "1px solid rgba(248,113,113,0.5)" },
  errorMsg: { fontSize: "12px", color: "#f87171" },
  charCount: { fontSize: "11px", color: "#475569", textAlign: "right" },
  statusToggle: { display: "flex", gap: "8px" },
  statusBtn: {
    flex: 1, padding: "10px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#64748b", fontWeight: "500", fontSize: "14px",
    cursor: "pointer", transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    fontFamily: "inherit",
  },
  statusBtnActivePending: {
    background: "rgba(245,158,11,0.12)", color: "#fbbf24",
    border: "1px solid rgba(245,158,11,0.3)",
  },
  statusBtnActiveCompleted: {
    background: "rgba(16,185,129,0.12)", color: "#34d399",
    border: "1px solid rgba(16,185,129,0.3)",
  },
  formActions: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" },
  cancelBtn: {
    padding: "10px 20px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "transparent", color: "#64748b",
    fontWeight: "500", fontSize: "14px", cursor: "pointer",
    fontFamily: "inherit",
  },
  submitBtn: {
    padding: "10px 24px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontWeight: "600", fontSize: "14px",
    cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
    fontFamily: "inherit",
  },

  // Toast
  toastContainer: {
    position: "fixed", bottom: "24px", right: "24px",
    display: "flex", flexDirection: "column", gap: "8px", zIndex: 200,
  },
  toast: {
    padding: "12px 18px", borderRadius: "10px",
    fontSize: "14px", fontWeight: "500",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    animation: "slideUp 0.25s ease",
  },
  toastSuccess: { background: "#1a2e24", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" },
  toastError: { background: "#2a1a1a", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" },
};

// Inject keyframes
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  button:hover { opacity: 0.85; }
  input:focus, textarea:focus { border-color: rgba(99,102,241,0.5) !important; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0d0d14; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
`;
document.head.appendChild(styleTag);