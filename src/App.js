import { useState, useEffect, useRef } from "react";

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>
  ),
  Courses: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
    </svg>
  ),
  Students: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  ),
  Faculties: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Library: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
    </svg>
  ),
  Support: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  ),
  Power: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
    </svg>
  ),
  React: () => (
    <svg viewBox="0 0 24 24" fill="#61dafb" width="30" height="30">
      <circle cx="12" cy="12" r="2.5"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61dafb" strokeWidth="1.2"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61dafb" strokeWidth="1.2" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61dafb" strokeWidth="1.2" transform="rotate(120 12 12)"/>
    </svg>
  ),
};

// ─── Reusable Card ────────────────────────────────────────────────────────────
const Card = ({ title, value, sub, color = "#3b82f6", icon }) => (
  <div style={{
    background: "linear-gradient(135deg,#0f1535 60%,#1a2555)",
    border: `1px solid ${color}33`,
    borderRadius: 16, padding: "22px 26px",
    boxShadow: `0 0 18px ${color}22`,
    display: "flex", flexDirection: "column", gap: 8, flex: "1 1 180px", minWidth: 160,
  }}>
    <div style={{ fontSize: 28 }}>{icon}</div>
    <div style={{ color: "#94a3b8", fontSize: 13 }}>{title}</div>
    <div style={{ color, fontSize: 32, fontWeight: 700 }}>{value}</div>
    {sub && <div style={{ color: "#64748b", fontSize: 12 }}>{sub}</div>}
  </div>
);

// ─── Tiny Bar Chart ───────────────────────────────────────────────────────────
const BarChart = ({ data, color = "#3b82f6", label }) => {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ background: "#0f1535", border: "1px solid #1e3a5f", borderRadius: 14, padding: 20 }}>
      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 14 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: "100%", height: `${(d.v / max) * 90}px`,
              background: `linear-gradient(to top,${color},${color}88)`,
              borderRadius: "4px 4px 0 0",
              boxShadow: `0 0 10px ${color}66`,
              transition: "height 0.5s ease"
            }}/>
            <span style={{ color: "#475569", fontSize: 10 }}>{d.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const Donut = ({ pct, color, label }) => {
  const r = 36, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#1e3a5f" strokeWidth="10"/>
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform="rotate(-90 45 45)" style={{ filter: `drop-shadow(0 0 6px ${color})` }}/>
        <text x="45" y="50" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">{pct}%</text>
      </svg>
      <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const DashboardPage = () => {
  const gradeData = [
    { l: "Jan", v: 72 }, { l: "Feb", v: 78 }, { l: "Mar", v: 74 }, { l: "Apr", v: 85 },
    { l: "May", v: 80 }, { l: "Jun", v: 88 }, { l: "Jul", v: 82 },
  ];
  const attendanceData = [
    { l: "Mon", v: 92 }, { l: "Tue", v: 88 }, { l: "Wed", v: 95 }, { l: "Thu", v: 85 }, { l: "Fri", v: 78 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>
        Student Analytics <span style={{ color: "#3b82f6" }}>Dashboard</span>
      </h1>

      {/* KPI Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Card title="Total Students" value="1,248" sub="↑ 12% this semester" color="#3b82f6" icon="🎓"/>
        <Card title="Avg. Grade" value="82%" sub="↑ 4% from last term" color="#06b6d4" icon="📊"/>
        <Card title="Attendance" value="91%" sub="This week" color="#8b5cf6" icon="📅"/>
        <Card title="At Risk" value="37" sub="Need intervention" color="#ef4444" icon="⚠️"/>
        <Card title="Honour Roll" value="214" sub="Top performers" color="#10b981" icon="🏆"/>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <BarChart data={gradeData} color="#3b82f6" label="Monthly Average Grades (%)"/>
        <BarChart data={attendanceData} color="#06b6d4" label="Weekly Attendance (%)"/>
      </div>

      {/* Well-being donuts */}
      <div style={{ background: "#0f1535", border: "1px solid #1e3a5f", borderRadius: 14, padding: 24 }}>
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>Student Well-being Indicators</div>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          <Donut pct={76} color="#3b82f6" label="Academic Satisfaction"/>
          <Donut pct={88} color="#10b981" label="Social Well-being"/>
          <Donut pct={64} color="#f59e0b" label="Mental Health Score"/>
          <Donut pct={91} color="#06b6d4" label="Physical Activity"/>
          <Donut pct={55} color="#ef4444" label="Stress Level (inv.)"/>
        </div>
      </div>

      {/* Recent alerts */}
      <div style={{ background: "#0f1535", border: "1px solid #1e3a5f", borderRadius: 14, padding: 20 }}>
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 14 }}>Recent Alerts</div>
        {[
          { name: "Alex Johnson", msg: "Grade dropped below 60% in Calculus", color: "#ef4444" },
          { name: "Maria Chen", msg: "Absent 3 consecutive days", color: "#f59e0b" },
          { name: "Tyler Brooks", msg: "Submitted counselling request", color: "#8b5cf6" },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0", borderBottom: "1px solid #1e3a5f"
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0, boxShadow: `0 0 6px ${a.color}` }}/>
            <span style={{ color: "#cbd5e1", fontSize: 13 }}><b style={{ color: "#fff" }}>{a.name}</b> — {a.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Courses ───────────────────────────────────────────────────────────────────
const CoursesPage = () => {
  const courses = [
    { name: "Advanced Mathematics", code: "MATH401", students: 34, instructor: "Dr. Richards", progress: 72, color: "#3b82f6" },
    { name: "Physics Fundamentals", code: "PHYS201", students: 28, instructor: "Prof. Nguyen", progress: 55, color: "#06b6d4" },
    { name: "Computer Science", code: "CS301", students: 42, instructor: "Dr. Martinez", progress: 88, color: "#8b5cf6" },
    { name: "Literature & Writing", code: "ENG102", students: 31, instructor: "Ms. Thompson", progress: 60, color: "#10b981" },
    { name: "Biology Essentials", code: "BIO201", students: 25, instructor: "Dr. Patel", progress: 45, color: "#f59e0b" },
    { name: "World History", code: "HIST305", students: 38, instructor: "Prof. Davis", progress: 79, color: "#ef4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>Courses</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        {courses.map((c, i) => (
          <div key={i} style={{
            background: "linear-gradient(135deg,#0f1535,#1a2555)",
            border: `1px solid ${c.color}44`, borderRadius: 16, padding: 22,
            boxShadow: `0 0 18px ${c.color}22`,
          }}>
            <div style={{ color: c.color, fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>{c.code}</div>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 14 }}>{c.instructor}</div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 12, marginBottom: 10 }}>
              <span>👥 {c.students} students</span>
              <span>{c.progress}% complete</span>
            </div>
            <div style={{ background: "#1e3a5f", borderRadius: 4, height: 6 }}>
              <div style={{ width: `${c.progress}%`, height: "100%", background: c.color, borderRadius: 4, boxShadow: `0 0 8px ${c.color}` }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Students ──────────────────────────────────────────────────────────────────
const StudentsPage = () => {
  const students = [
    { name: "Alice Wang", id: "S001", grade: "A", attendance: "96%", status: "Excellent", color: "#10b981" },
    { name: "Ben Carter", id: "S002", grade: "B+", attendance: "88%", status: "Good", color: "#3b82f6" },
    { name: "Clara Smith", id: "S003", grade: "C", attendance: "72%", status: "At Risk", color: "#f59e0b" },
    { name: "David Kim", id: "S004", grade: "A+", attendance: "99%", status: "Honour Roll", color: "#06b6d4" },
    { name: "Eva Rossi", id: "S005", grade: "D", attendance: "58%", status: "Critical", color: "#ef4444" },
    { name: "Felix Müller", id: "S006", grade: "B", attendance: "84%", status: "Good", color: "#3b82f6" },
    { name: "Grace Lee", id: "S007", grade: "A", attendance: "93%", status: "Excellent", color: "#10b981" },
    { name: "Hiro Tanaka", id: "S008", grade: "B-", attendance: "80%", status: "Good", color: "#3b82f6" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>Students</h1>
      <div style={{ background: "#0f1535", border: "1px solid #1e3a5f", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0a0f2a" }}>
              {["Student", "ID", "Grade", "Attendance", "Status"].map(h => (
                <th key={h} style={{ color: "#3b82f6", padding: "14px 20px", textAlign: "left", fontSize: 12, letterSpacing: 1 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} style={{ borderTop: "1px solid #1e3a5f", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1a2555"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${s.color}33`, border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {s.name[0]}
                  </div>
                  {s.name}
                </td>
                <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>{s.id}</td>
                <td style={{ padding: "14px 20px", color: s.color, fontWeight: 700 }}>{s.grade}</td>
                <td style={{ padding: "14px 20px", color: "#94a3b8" }}>{s.attendance}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ background: `${s.color}22`, color: s.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, border: `1px solid ${s.color}44` }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Faculties ─────────────────────────────────────────────────────────────────
const FacultiesPage = () => {
  const faculty = [
    { name: "Dr. Eleanor Richards", dept: "Mathematics", courses: 3, students: 96, rating: 4.8, color: "#3b82f6" },
    { name: "Prof. James Nguyen", dept: "Physics", courses: 2, students: 54, rating: 4.6, color: "#06b6d4" },
    { name: "Dr. Sofia Martinez", dept: "Computer Science", courses: 4, students: 138, rating: 4.9, color: "#8b5cf6" },
    { name: "Ms. Rachel Thompson", dept: "English", courses: 2, students: 67, rating: 4.4, color: "#10b981" },
    { name: "Dr. Arun Patel", dept: "Biology", courses: 3, students: 72, rating: 4.7, color: "#f59e0b" },
    { name: "Prof. Charles Davis", dept: "History", courses: 2, students: 88, rating: 4.5, color: "#ef4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>Faculties</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
        {faculty.map((f, i) => (
          <div key={i} style={{
            background: "linear-gradient(135deg,#0f1535,#1a2555)",
            border: `1px solid ${f.color}44`, borderRadius: 16, padding: 24,
            boxShadow: `0 0 20px ${f.color}22`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${f.color}22`, border: `2px solid ${f.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, fontSize: 22, fontWeight: 700 }}>
                {f.name.split(" ").pop()[0]}
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{f.name}</div>
                <div style={{ color: f.color, fontSize: 12 }}>{f.dept}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["📚", f.courses, "Courses"], ["👥", f.students, "Students"], ["⭐", f.rating, "Rating"]].map(([icon, val, lbl]) => (
                <div key={lbl} style={{ background: "#0a0f2a", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18 }}>{icon}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{val}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Library ───────────────────────────────────────────────────────────────────
const LIBRARY_KEY = "edu_library_books";
const LibraryPage = () => {
  const defaultBooks = [
    { id: 1, title: "Introduction to Algorithms", author: "CLRS", category: "CS", available: true },
    { id: 2, title: "Calculus: Early Transcendentals", author: "Stewart", category: "Math", available: false },
    { id: 3, title: "The Great Gatsby", author: "Fitzgerald", category: "Literature", available: true },
    { id: 4, title: "Physics for Scientists", author: "Serway", category: "Physics", available: true },
    { id: 5, title: "Molecular Biology of the Cell", author: "Alberts", category: "Biology", available: false },
  ];
  const [books, setBooks] = useState(() => {
    try { const s = localStorage.getItem(LIBRARY_KEY); return s ? JSON.parse(s) : defaultBooks; }
    catch { return defaultBooks; }
  });
  const [form, setForm] = useState({ title: "", author: "", category: "" });
  const [search, setSearch] = useState("");

  const save = (b) => { setBooks(b); try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(b)); } catch {} };
  const addBook = () => {
    if (!form.title || !form.author) return;
    const next = [...books, { id: Date.now(), ...form, available: true }];
    save(next); setForm({ title: "", author: "", category: "" });
  };
  const toggle = (id) => save(books.map(b => b.id === id ? { ...b, available: !b.available } : b));
  const remove = (id) => save(books.filter(b => b.id !== id));
  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  const inp = (ph, key) => (
    <input placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={{ background: "#0a0f2a", border: "1px solid #1e3a5f", color: "#fff", padding: "10px 14px", borderRadius: 8, fontSize: 13, outline: "none", flex: 1 }}/>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>📚 Library</h1>

      {/* Add book */}
      <div style={{ background: "#0f1535", border: "1px solid #1e3a5f", borderRadius: 16, padding: 20 }}>
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 14 }}>Add New Book</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {inp("Title *", "title")}{inp("Author *", "author")}{inp("Category", "category")}
          <button onClick={addBook} style={{
            background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: "none", color: "#fff",
            padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
            boxShadow: "0 0 14px #3b82f688"
          }}>+ Add</button>
        </div>
      </div>

      {/* Search */}
      <input placeholder="🔍 Search books..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ background: "#0f1535", border: "1px solid #1e3a5f", color: "#fff", padding: "12px 16px", borderRadius: 10, fontSize: 14, outline: "none" }}/>

      {/* Book list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(b => (
          <div key={b.id} style={{
            background: "#0f1535", border: `1px solid ${b.available ? "#10b98144" : "#ef444444"}`,
            borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
            boxShadow: `0 0 12px ${b.available ? "#10b98111" : "#ef444411"}`
          }}>
            <span style={{ fontSize: 22 }}>📖</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 600 }}>{b.title}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{b.author}{b.category ? ` · ${b.category}` : ""}</div>
            </div>
            <span style={{ color: b.available ? "#10b981" : "#ef4444", fontSize: 12, background: b.available ? "#10b98122" : "#ef444422", padding: "4px 10px", borderRadius: 20, border: `1px solid ${b.available ? "#10b98144" : "#ef444444"}` }}>
              {b.available ? "Available" : "Checked Out"}
            </span>
            <button onClick={() => toggle(b.id)} style={{ background: "#1e3a5f", border: "none", color: "#94a3b8", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
              {b.available ? "Check Out" : "Return"}
            </button>
            <button onClick={() => remove(b.id)} style={{ background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>No books found</div>}
      </div>
    </div>
  );
};

// ── Support Chat ──────────────────────────────────────────────────────────────
const AGENTS = [
  { id: 1, name: "Alex (Tech Support)", avatar: "🛠️", status: "online" },
  { id: 2, name: "Sara (Academic)", avatar: "📚", status: "online" },
  { id: 3, name: "Mike (Counselling)", avatar: "💬", status: "away" },
];
const SupportPage = () => {
  const [agent, setAgent] = useState(AGENTS[0]);
  const [msgs, setMsgs] = useState({
    1: [{ from: "agent", text: "Hi! I'm Alex. How can I help you with technical issues today?", time: "now" }],
    2: [{ from: "agent", text: "Hello! Sara here. I can assist with academic queries.", time: "now" }],
    3: [{ from: "agent", text: "Hey, Mike here. I'm here to listen. What's on your mind?", time: "now" }],
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const responses = [
      "Got it! Let me look into that for you.",
      "Thanks for reaching out. I'll get back to you shortly.",
      "That's a great question. Here's what I suggest...",
      "I understand. Let me escalate this to the right team.",
      "Happy to help! Can you provide more details?",
    ];
    const agentReply = { from: "agent", text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMsgs(m => ({ ...m, [agent.id]: [...m[agent.id], userMsg] }));
    setInput("");
    setTimeout(() => setMsgs(m => ({ ...m, [agent.id]: [...m[agent.id], agentReply] })), 900);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, agent]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>Support Chat</h1>
      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        {/* Agent list */}
        <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {AGENTS.map(a => (
            <div key={a.id} onClick={() => setAgent(a)} style={{
              background: agent.id === a.id ? "linear-gradient(135deg,#1d4ed8,#3b82f6)" : "#0f1535",
              border: `1px solid ${agent.id === a.id ? "#3b82f6" : "#1e3a5f"}`,
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              boxShadow: agent.id === a.id ? "0 0 20px #3b82f688" : "none",
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{a.avatar}</span>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ color: a.status === "online" ? "#10b981" : "#f59e0b", fontSize: 11 }}>● {a.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div style={{ flex: 1, background: "#0f1535", border: "1px solid #1e3a5f", borderRadius: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a5f", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{agent.avatar}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{agent.name}</div>
              <div style={{ color: "#10b981", fontSize: 11 }}>● {agent.status}</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12, maxHeight: 340 }}>
            {msgs[agent.id].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  background: m.from === "user" ? "linear-gradient(135deg,#1d4ed8,#3b82f6)" : "#1a2555",
                  color: "#fff", padding: "10px 16px", borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  maxWidth: "70%", fontSize: 13, lineHeight: 1.5,
                  boxShadow: m.from === "user" ? "0 0 12px #3b82f666" : "none",
                }}>
                  {m.text}
                  <div style={{ color: "#ffffff55", fontSize: 10, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #1e3a5f", display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              style={{ flex: 1, background: "#0a0f2a", border: "1px solid #1e3a5f", color: "#fff", padding: "12px 16px", borderRadius: 10, fontSize: 13, outline: "none" }}/>
            <button onClick={send} style={{
              background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: "none", color: "#fff",
              padding: "0 22px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15,
              boxShadow: "0 0 14px #3b82f688",
            }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "Dashboard", Icon: Icons.Dashboard },
  { id: "Courses",   Icon: Icons.Courses },
  { id: "Students",  Icon: Icons.Students },
  { id: "Faculties", Icon: Icons.Faculties },
  { id: "Library",   Icon: Icons.Library },
  { id: "Support",   Icon: Icons.Support },
];

const PAGES = {
  Dashboard: DashboardPage,
  Courses:   CoursesPage,
  Students:  StudentsPage,
  Faculties: FacultiesPage,
  Library:   LibraryPage,
  Support:   SupportPage,
};

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [expanded, setExpanded] = useState(true);
  const PageComponent = PAGES[active];

  const sidebarW = expanded ? 220 : 64;

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "linear-gradient(135deg,#020818 0%,#0a0f2a 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarW, flexShrink: 0, background: "linear-gradient(180deg,#080e2a 0%,#060b20 100%)",
        borderRight: "1px solid #1e3a5f44", transition: "width 0.3s ease",
        display: "flex", flexDirection: "column",
        boxShadow: "4px 0 30px #000a",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: expanded ? "space-between" : "center", padding: expanded ? "18px 16px 10px" : "18px 0 10px", borderBottom: "1px solid #1e3a5f33" }}>
          {expanded && <Icons.React/>}
          <button onClick={() => setExpanded(e => !e)} style={{
            background: "transparent", border: "1px solid #1e3a5f", color: "#3b82f6",
            width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Icons.Power/>
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {NAV.map(({ id, Icon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)} title={!expanded ? id : ""} style={{
                display: "flex", alignItems: "center", gap: expanded ? 14 : 0,
                justifyContent: expanded ? "flex-start" : "center",
                padding: expanded ? "12px 16px" : "12px 0",
                borderRadius: 12, cursor: "pointer", border: "none", outline: "none",
                background: isActive ? "linear-gradient(135deg,#1d4ed8,#3b82f6)" : "transparent",
                color: isActive ? "#fff" : "#4b6a9b",
                boxShadow: isActive ? "0 0 20px #3b82f688, inset 0 1px 0 #ffffff22" : "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap", overflow: "hidden",
                width: "100%",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#1e3a5f44"; e.currentTarget.style.color = "#7eb3ff"; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b6a9b"; } }}
              >
                <span style={{ flexShrink: 0, filter: isActive ? "drop-shadow(0 0 6px #60a5fa)" : "none" }}><Icon/></span>
                {expanded && <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}>{id}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{
          height: 60, background: "#080e2a", borderBottom: "1px solid #1e3a5f44",
          display: "flex", alignItems: "center", padding: "0 30px",
          boxShadow: "0 2px 20px #0008",
        }}>
          <div style={{ color: "#3b82f6", fontSize: 20, fontWeight: 700, textShadow: "0 0 14px #3b82f6aa" }}>
            {active}
          </div>
          <div style={{ marginLeft: "auto", color: "#64748b", fontSize: 13 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Page */}
        <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          <PageComponent/>
        </div>
      </div>
    </div>
  );
}