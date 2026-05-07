import { motion, AnimatePresence } from "framer-motion";

const TasksNotes = ({
  T, orb, mono, raj, C,
  myTasks, setMyTasks,
  taskFilter, setTaskFilter,
  newTask, setNewTask,
  showAddTask, setShowAddTask,
  taskSubTab, setTaskSubTab,
  gainXP, takeXP,
  notes, setNotes,
  activeNoteId, setActiveNoteId,
  showNewNote, setShowNewNote,
  newNoteTitle, setNewNoteTitle,
  newNoteBody, setNewNoteBody,
  noteColor, setNoteColor,
  researchNotes, setResearchNotes,
  showResNote, setShowResNote,
  newResNote, setNewResNote,
  activeResNote, setActiveResNote,
}) => {
  const cats = ["Study", "Thesis", "Personal", "Health", "Admission", "Other"];
  const prioColors = { High: T.red, Medium: T.orange, Low: T.green };
  const noteColors = [T.green, T.blue, T.orange, T.pink, T.gold, T.cyan];
  const filtered = myTasks.filter(t => taskFilter === "All" || (taskFilter === "Done" ? t.done : taskFilter === "Active" ? !t.done : t.cat === taskFilter));
  const addTask = () => {
    if (!newTask.title.trim()) return;
    setMyTasks(p => [...p, { id: Date.now(), title: newTask.title, cat: newTask.cat, priority: newTask.priority, due: newTask.due, done: false, created: new Date().toLocaleDateString() }]);
    gainXP(5, "Task created 📋");
    setNewTask({ title: "", cat: "Study", priority: "Medium", due: "" });
    setShowAddTask(false);
  };
  const activeNoteObj = notes.find(x => x.id === activeNoteId);
  return (
    <div style={{}}>
      <div style={{ display: "flex", background: T.bg1, borderBottom: `1px solid ${T.border}`, overflowX: "auto" }}>
        {[{ id: "tasks", label: "✅ TASKS" }, { id: "matrix", label: "🎯 MATRIX" }, { id: "notes", label: "📝 NOTES" }, { id: "research", label: "🧪 RESEARCH" }].map(st => (
          <div key={st.id} onClick={() => setTaskSubTab(st.id)} style={{ flex: 1, padding: "11px 4px", textAlign: "center", cursor: "pointer", borderBottom: taskSubTab === st.id ? `2px solid ${T.green}` : "2px solid transparent", background: taskSubTab === st.id ? "#00ff8808" : "transparent", fontSize: 11, color: taskSubTab === st.id ? T.green : T.muted, ...mono, letterSpacing: .5, transition: "all .2s", minWidth: 60, whiteSpace: "nowrap" }}>
            {st.label}
          </div>
        ))}
      </div>

      {taskSubTab === "tasks" && (
        <div style={{ padding: 16 }}>
          <button onClick={() => setShowAddTask(!showAddTask)} className="btn-tap" style={{ width: "100%", padding: "11px", background: T.green + "22", border: `1px solid ${T.green}44`, color: T.green, borderRadius: 10, fontSize: 12, ...mono, cursor: "pointer", marginBottom: 12, letterSpacing: 1 }}>
            {showAddTask ? "✕ CANCEL" : "+ ADD NEW TASK"}
          </button>
          {showAddTask && (
            <div style={{ ...C({ padding: "16px", marginBottom: 12, border: `1px solid ${T.green}44` }) }}>
              <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Task title..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.bright, fontSize: 13, ...raj, marginBottom: 10, boxSizing: "border-box" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <select value={newTask.cat} onChange={e => setNewTask(p => ({ ...p, cat: e.target.value }))} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 11, ...mono }}>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 11, ...mono }}>
                  {["High", "Medium", "Low"].map(p2 => <option key={p2} value={p2}>{p2}</option>)}
                </select>
              </div>
              <input value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} type="date" style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 11, ...mono, marginBottom: 10, boxSizing: "border-box" }} />
              <button onClick={addTask} className="btn-tap" style={{ width: "100%", padding: "10px", background: T.green + "33", border: `1px solid ${T.green}55`, color: T.green, borderRadius: 8, fontSize: 12, ...mono, cursor: "pointer" }}>CREATE TASK</button>
            </div>
          )}
          <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 12, paddingBottom: 4 }}>
            {["All", "Active", "Done", "Study", "Thesis", "Personal", "Health", "Admission"].map(f => (
              <button key={f} onClick={() => setTaskFilter(f)} style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${taskFilter === f ? T.green : T.border}`, background: taskFilter === f ? T.green + "22" : "transparent", color: taskFilter === f ? T.green : T.muted, fontSize: 10, cursor: "pointer", ...mono, whiteSpace: "nowrap", transition: "all .2s" }}>{f}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[{ l: "TOTAL", v: myTasks.length, c: T.blue }, { l: "ACTIVE", v: myTasks.filter(t => !t.done).length, c: T.orange }, { l: "DONE", v: myTasks.filter(t => t.done).length, c: T.green }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: s.c + "11", border: `1px solid ${s.c}22`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                <div style={{ ...orb, fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 8, color: T.muted, ...mono, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: T.muted, fontSize: 12, ...raj }}>{myTasks.length === 0 ? "No tasks yet. Add your first task above." : "No tasks match this filter."}</div>}
          {filtered.map(task => (
            <div key={task.id} style={{ ...C({ padding: "14px", marginBottom: 8, border: `1px solid ${task.done ? T.border : prioColors[task.priority] + "33"}`, background: task.done ? T.bg1 : prioColors[task.priority] + "06", transition: "all .2s" }) }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div onClick={() => { const wasDone = task.done; setMyTasks(p => p.map(t => t.id === task.id ? { ...t, done: !t.done } : t)); if (!wasDone) gainXP(15, "Custom task done ✅"); else takeXP(15, "Custom task undone ↩"); }} style={{ width: 22, height: 22, border: `1.5px solid ${task.done ? T.green : prioColors[task.priority]}`, borderRadius: 5, flexShrink: 0, marginTop: 1, cursor: "pointer", background: task.done ? T.green + "33" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: task.done ? `0 0 8px ${T.green}44` : "none", transition: "all .2s" }}>
                  {task.done && <span style={{ fontSize: 12, color: T.green, fontWeight: 900 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: task.done ? "#2a4a3a" : T.bright, fontWeight: 600, ...raj, textDecoration: task.done ? "line-through" : "none" }}>{task.title}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, background: prioColors[task.priority] + "22", border: `1px solid ${prioColors[task.priority]}33`, color: prioColors[task.priority], padding: "2px 6px", borderRadius: 20, ...mono }}>{task.priority}</span>
                    <span style={{ fontSize: 9, background: T.blue + "22", border: `1px solid ${T.blue}33`, color: T.blue, padding: "2px 6px", borderRadius: 20, ...mono }}>{task.cat}</span>
                    {task.due && <span style={{ fontSize: 9, color: T.muted, ...mono }}>📅 {task.due}</span>}
                  </div>
                </div>
                <button onClick={() => {
                  if (task.done) takeXP(5, "Task deleted ↩");
                  setMyTasks(p => p.filter(t => t.id !== task.id));
                }} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 18, cursor: "pointer", padding: "0 4px", flexShrink: 0, lineHeight: 1 }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {taskSubTab === "matrix" && (
        <div style={{ padding: 16, }}>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, ...mono, marginBottom: 12 }}>EISENHOWER DECISION MATRIX — drag tasks to quadrant</div>
          {[
            { q: "urgent-important", label: "DO FIRST", sub: "Urgent + Important", color: T.red, icon: "🔥" },
            { q: "not-urgent-important", label: "SCHEDULE", sub: "Not Urgent + Important", color: T.blue, icon: "📅" },
            { q: "urgent-not-important", label: "DELEGATE", sub: "Urgent + Not Important", color: T.orange, icon: "👋" },
            { q: "not-urgent-not-important", label: "ELIMINATE", sub: "Not Urgent + Not Important", color: T.muted, icon: "🗑️" },
          ].map(quad => {
            const qTasks = myTasks.filter(t => t.quadrant === quad.q && !t.done);
            const allQTasks = myTasks.filter(t => !t.quadrant && !t.done);
            return (
              <div key={quad.q} style={{ ...C({ padding: "12px", marginBottom: 10, border: `1.5px solid ${quad.color}33` }) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, color: quad.color, letterSpacing: 2, fontWeight: 700, ...mono }}>{quad.icon} {quad.label}</div>
                    <div style={{ fontSize: 10, color: T.muted, ...raj }}>{quad.sub}</div>
                  </div>
                  <div style={{ ...orb, fontSize: 18, fontWeight: 900, color: quad.color }}>{qTasks.length}</div>
                </div>
                {qTasks.map(t => (
                  <div key={t.id} style={{ display: "flex", gap: 8, alignItems: "center", background: quad.color + "0d", borderRadius: 7, padding: "6px 8px", marginBottom: 5 }}>
                    <div onClick={() => { setMyTasks(p => p.map(x => x.id === t.id ? { ...x, done: true } : x)); gainXP(15, "Matrix task done ✅"); }} style={{ width: 18, height: 18, border: `1.5px solid ${quad.color}`, borderRadius: 4, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }} />
                    <span style={{ fontSize: 12, color: T.bright, flex: 1, ...raj }}>{t.title}</span>
                    <span style={{ fontSize: 8, color: quad.color, ...mono, background: quad.color + "22", padding: "2px 6px", borderRadius: 10 }}>{t.priority}</span>
                  </div>
                ))}
                {allQTasks.length > 0 && (
                  <div>
                    <div style={{ fontSize: 8, color: T.dim, ...mono, marginTop: 6, marginBottom: 4 }}>ASSIGN UNPLACED TASK:</div>
                    <select onChange={e => { if (e.target.value) { setMyTasks(p => p.map(t => t.id === parseInt(e.target.value) ? { ...t, quadrant: quad.q } : t)); e.target.value = "" } }} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "6px 8px", color: T.text, fontSize: 11, ...mono }}>
                      <option value="">+ assign task here...</option>
                      {allQTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
          {myTasks.filter(t => !t.quadrant && !t.done).length === 0 && myTasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: T.muted, fontSize: 12, ...raj }}>Add tasks in the TASKS tab, then assign them to quadrants here.</div>
          )}
        </div>
      )}

      {taskSubTab === "notes" && (
        <div style={{ padding: 16 }}>
          <button onClick={() => { setShowNewNote(!showNewNote); setActiveNoteId(null); }} className="btn-tap" style={{ width: "100%", padding: "11px", background: T.blue + "22", border: `1px solid ${T.blue}44`, color: T.blue, borderRadius: 10, fontSize: 12, ...mono, cursor: "pointer", marginBottom: 12, letterSpacing: 1 }}>
            {showNewNote ? "✕ CANCEL" : "+ NEW NOTE"}
          </button>
          {showNewNote && (
            <div style={{ ...C({ padding: "16px", marginBottom: 12, border: `1px solid ${noteColor}44` }) }}>
              <input value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="Note title..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.bright, fontSize: 14, ...raj, fontWeight: 700, marginBottom: 10, boxSizing: "border-box" }} />
              <textarea value={newNoteBody} onChange={e => setNewNoteBody(e.target.value)} placeholder="Write anything — ideas, blockers, wins, research notes, feelings, plans..." rows={5} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 12, ...raj, lineHeight: 1.7, resize: "vertical", marginBottom: 10, boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 10, color: T.muted, ...mono }}>COLOR:</span>
                {noteColors.map(nc => (
                  <div key={nc} onClick={() => setNoteColor(nc)} style={{ width: 20, height: 20, borderRadius: "50%", background: nc, border: `2px solid ${noteColor === nc ? "#fff" : nc + "44"}`, cursor: "pointer", transition: "all .15s" }} />
                ))}
              </div>
              <button onClick={() => { if (!newNoteTitle.trim()) return; setNotes(p => [{ id: Date.now(), title: newNoteTitle, body: newNoteBody, pinned: false, color: noteColor, date: new Date().toLocaleDateString() }, ...p]); setNewNoteTitle(""); setNewNoteBody(""); setShowNewNote(false); }} className="btn-tap" style={{ width: "100%", padding: "10px", background: T.blue + "33", border: `1px solid ${T.blue}55`, color: T.blue, borderRadius: 8, fontSize: 12, ...mono, cursor: "pointer" }}>SAVE NOTE</button>
            </div>
          )}
          {activeNoteObj && (
            <div style={{ ...C({ padding: "16px", marginBottom: 12, border: `1px solid ${activeNoteObj.color}55` }) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ ...orb, fontSize: 14, fontWeight: 700, color: activeNoteObj.color }}>{activeNoteObj.title}</div>
                <button onClick={() => setActiveNoteId(null)} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
              </div>
              <textarea value={activeNoteObj.body} onChange={e => setNotes(p => p.map(x => x.id === activeNoteObj.id ? { ...x, body: e.target.value } : x))} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px", color: T.text, fontSize: 13, ...raj, lineHeight: 1.8, resize: "vertical", minHeight: 130, boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: T.muted, ...mono }}>{activeNoteObj.date}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNotes(p => p.map(x => x.id === activeNoteObj.id ? { ...x, pinned: !x.pinned } : x))} style={{ padding: "5px 10px", background: activeNoteObj.pinned ? T.gold + "22" : "transparent", border: `1px solid ${activeNoteObj.pinned ? T.gold : T.border}`, color: activeNoteObj.pinned ? T.gold : T.muted, borderRadius: 6, fontSize: 10, cursor: "pointer", ...mono }}>{activeNoteObj.pinned ? "📌 PINNED" : "PIN"}</button>
                  <button onClick={() => { setNotes(p => p.filter(x => x.id !== activeNoteObj.id)); setActiveNoteId(null); }} style={{ padding: "5px 10px", background: T.red + "22", border: `1px solid ${T.red}33`, color: T.red, borderRadius: 6, fontSize: 10, cursor: "pointer", ...mono }}>DELETE</button>
                </div>
              </div>
            </div>
          )}
          {notes.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: T.muted, fontSize: 12, ...raj }}>No notes yet. Capture your first thought above.</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[...notes.filter(n => n.pinned), ...notes.filter(n => !n.pinned)].map(n => (
              <div key={n.id} onClick={() => setActiveNoteId(n.id === activeNoteId ? null : n.id)} className="hovlift" style={{ background: n.color + "0d", border: `1px solid ${n.id === activeNoteId ? n.color : n.color + "33"}`, borderRadius: 10, padding: "12px", cursor: "pointer", minHeight: 90, position: "relative", transition: "all .2s" }}>
                {n.pinned && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 12 }}>📌</div>}
                <div style={{ fontSize: 11, color: n.color, fontWeight: 700, ...raj, marginBottom: 5, paddingRight: n.pinned ? 18 : 0 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: T.muted, ...raj, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{n.body || "Empty. Tap to edit."}</div>
                <div style={{ fontSize: 9, color: T.dim, ...mono, marginTop: 8 }}>{n.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESEARCH NOTES ── */}
      {taskSubTab === "research" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, ...mono }}>🧪 RESEARCH NOTES</div>
              <div style={{ fontSize: 10, color: T.muted, ...raj, marginTop: 2 }}>CRO · SHAP · Dataset · Results · Ideas</div>
            </div>
            <button onClick={() => setShowResNote(!showResNote)} className="btn-tap" style={{ padding: "7px 12px", background: T.green + "22", border: `1px solid ${T.green}44`, color: T.green, borderRadius: 8, fontSize: 10, ...mono, cursor: "pointer" }}>+ NOTE</button>
          </div>
          {showResNote && (
            <div style={{ ...C({ padding: "14px", marginBottom: 12, border: `1px solid ${T.green}44` }) }}>
              <input value={newResNote.title} onChange={e => setNewResNote(p => ({ ...p, title: e.target.value }))} placeholder="Note title (e.g. CRO convergence issue)" style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.bright, fontSize: 13, ...raj, marginBottom: 8, boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {["CRO", "SHAP", "Dataset", "Results", "Ideas", "Writing"].map(tag => (
                  <button key={tag} onClick={() => setNewResNote(p => ({ ...p, tag }))} className="btn-tap" style={{ flex: 1, padding: "5px 4px", borderRadius: 6, border: `1px solid ${newResNote.tag === tag ? T.green : T.border}`, background: newResNote.tag === tag ? T.green + "22" : "transparent", color: newResNote.tag === tag ? T.green : T.muted, fontSize: 9, ...mono, cursor: "pointer" }}>{tag}</button>
                ))}
              </div>
              <textarea value={newResNote.body} onChange={e => setNewResNote(p => ({ ...p, body: e.target.value }))} placeholder="Write your research thought, finding, or idea..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 12, ...raj, lineHeight: 1.7, resize: "vertical", minHeight: 100, boxSizing: "border-box", marginBottom: 8 }} />
              <button onClick={() => {
                if (!newResNote.title.trim()) return;
                setResearchNotes(p => [{ id: Date.now(), title: newResNote.title, body: newResNote.body, tag: newResNote.tag, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...p]);
                setNewResNote({ title: "", body: "", tag: "CRO" });
                setShowResNote(false);
                gainXP(8, "Research note added 🧪");
              }} className="btn-tap" style={{ width: "100%", padding: "9px", background: T.green + "33", border: `1px solid ${T.green}55`, color: T.green, borderRadius: 8, fontSize: 12, ...mono, cursor: "pointer" }}>SAVE NOTE</button>
            </div>
          )}
          {researchNotes.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 0", color: T.muted, fontSize: 12, ...raj }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🧪</div>
              <div>No research notes yet.</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 4 }}>Write down CRO ideas, SHAP findings, dataset notes — anything thesis related.</div>
            </div>
          )}
          {/* Tag filter */}
          {researchNotes.length > 0 && (
            <div style={{ display: "flex", gap: 5, marginBottom: 10, overflowX: "auto", paddingBottom: 2 }}>
              {["All", "CRO", "SHAP", "Dataset", "Results", "Ideas", "Writing"].map(tag => (
                <button key={tag} onClick={() => setActiveResNote(activeResNote === tag ? null : tag)} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${activeResNote === tag ? T.green : T.border}`, background: activeResNote === tag ? T.green + "22" : "transparent", color: activeResNote === tag ? T.green : T.muted, fontSize: 9, ...mono, cursor: "pointer", flexShrink: 0 }}>{tag}</button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {researchNotes
              .filter(n => !activeResNote || activeResNote === "All" || n.tag === activeResNote)
              .map((n, i) => {
                const tagColors = { CRO: T.green, SHAP: T.blue, Dataset: T.orange, Results: T.pink, Ideas: T.gold, Writing: "#a855f7" };
                const col = tagColors[n.tag] || T.green;
                return (
                  <div key={n.id} style={{ ...C({ padding: "12px", border: `1px solid ${col}33`, background: `${col}06` }) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 9, color: col, background: col + "22", padding: "2px 7px", borderRadius: 10, ...mono }}>{n.tag}</span>
                          <span style={{ fontSize: 8, color: T.dim, ...mono }}>{n.date} {n.time}</span>
                        </div>
                        <div style={{ fontSize: 13, color: T.bright, fontWeight: 600, ...raj }}>{n.title}</div>
                      </div>
                      <button onClick={() => { setResearchNotes(p => p.filter(x => x.id !== n.id)); takeXP(8, "Research note removed ↩"); }} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 16, cursor: "pointer", lineHeight: 1, marginLeft: 8 }}>×</button>
                    </div>
                    {n.body && <div style={{ fontSize: 11, color: T.text, ...raj, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{n.body}</div>}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
export default TasksNotes;
