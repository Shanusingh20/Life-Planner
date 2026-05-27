const MOODS = [{e:'😔',l:'Low'},{e:'😐',l:'Meh'},{e:'🙂',l:'Good'},{e:'😄',l:'Great'},{e:'🤩',l:'Amazing'}];
const COLORS = [
  {ico:'var(--teal-light)',clr:'var(--teal)',bdg:'bt'},
  {ico:'var(--purple-light)',clr:'var(--purple)',bdg:'bp'},
  {ico:'var(--amber-light)',clr:'var(--amber)',bdg:'ba'},
  {ico:'var(--coral-light)',clr:'var(--coral)',bdg:'bc'},
  {ico:'var(--green-light)',clr:'var(--green)',bdg:'bg2'}
];
const ICONS = ['ti-target','ti-run','ti-book','ti-pig-money','ti-language','ti-barbell','ti-heart','ti-music','ti-code','ti-pencil'];

let state = {
  goals: [
    {id:1,name:'Run a 5K',cat:'Fitness',pct:65,icon:'ti-run',ci:0,target:'2026-06-30'},
    {id:2,name:'Read 12 books',cat:'Learning',pct:42,icon:'ti-book',ci:1,target:'2026-12-31'},
    {id:3,name:'Save ₹50,000',cat:'Finance',pct:30,icon:'ti-pig-money',ci:2,target:'2026-12-31'},
    {id:4,name:'Learn Spanish',cat:'Skills',pct:18,icon:'ti-language',ci:3,target:'2026-09-30'}
  ],
  tasks: [
    {id:1,text:'Morning meditation',tag:'wellness',done:true},
    {id:2,text:'Evening run — 3km',tag:'fitness',done:false},
    {id:3,text:'Read 20 pages',tag:'learning',done:true},
    {id:4,text:'Review budget',tag:'finance',done:false},
    {id:5,text:'Write journal entry',tag:'reflection',done:false}
  ],
  milestones: [
    {id:1,name:'Complete first 5K run',date:'2026-06-30',ci:0,done:false},
    {id:2,name:'Finish book #6',date:'2026-07-15',ci:1,done:false},
    {id:3,name:'Reach ₹25,000 savings',date:'2026-08-01',ci:2,done:false},
    {id:4,name:'30-day meditation streak',date:'2026-05-01',ci:0,done:true},
    {id:5,name:'Read first 5 books',date:'2026-04-20',ci:1,done:true}
  ],
  journal: [
    {id:1,date:'May 26, 2026',mood:'😄 Great',text:'Had a productive day. Finished the chapter and went for a longer run than planned.'},
    {id:2,date:'May 25, 2026',mood:'🙂 Good',text:'Stayed consistent with tasks. Meditated 15 min instead of 10. Small wins add up.'},
    {id:3,date:'May 24, 2026',mood:'😐 Meh',text:"Didn't feel like doing much. Skipped the run but read 30 minutes."}
  ],
  streakDays: [1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,2],
  selMood: 2,
  nextId: 100
};

// Load from localStorage if available
function loadState() {
  try {
    const saved = localStorage.getItem('lifePlanner');
    if (saved) state = JSON.parse(saved);
  } catch(e) {}
}

function saveState() {
  try { localStorage.setItem('lifePlanner', JSON.stringify(state)); } catch(e) {}
}

function now() {
  return new Date().toLocaleDateString('en-IN', {weekday:'short',month:'short',day:'numeric',year:'numeric'});
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

function go(id, el) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
  document.querySelectorAll('.nav').forEach(n => n.classList.remove('on'));
  document.getElementById('sec-' + id).classList.add('on');
  el.classList.add('on');
  render();
}

function render() {
  renderDash(); renderGoals(); renderTasks(); renderMilestones(); renderJournal(); renderStreak();
  saveState();
}

function renderDash() {
  document.getElementById('greeting').textContent = greeting();
  const done = state.tasks.filter(t => t.done).length;
  const avgPct = state.goals.length ? Math.round(state.goals.reduce((a,g) => a + g.pct, 0) / state.goals.length) : 0;
  document.getElementById('dm-goals').textContent = state.goals.length;
  document.getElementById('dm-goals-s').textContent = avgPct + '% avg';
  document.getElementById('dm-tasks').textContent = state.tasks.length;
  document.getElementById('dm-tasks-s').textContent = done + ' completed';
  document.getElementById('dm-streak').textContent = state.streakDays.filter(d => d > 0).length;
  document.getElementById('dm-miles').textContent = state.milestones.length;
  document.getElementById('dm-miles-s').textContent = state.milestones.filter(m => !m.done).length + ' upcoming';

  document.getElementById('dash-goals').innerHTML = state.goals.slice(0,3).map(g => {
    const c = COLORS[g.ci % COLORS.length];
    return `<div class="gi">
      <div class="gico" style="background:${c.ico};color:${c.clr}"><i class="ti ${g.icon}"></i></div>
      <div class="ginfo">
        <div class="gname">${esc(g.name)}</div>
        <div class="pbar"><div class="pfill" style="width:${g.pct}%;background:${c.clr}"></div></div>
      </div>
      <div class="gpct">${g.pct}%</div>
    </div>`;
  }).join('') || '<p class="empty">No goals yet.</p>';

  document.getElementById('dash-tasks').innerHTML = state.tasks.slice(0,5).map(t =>
    `<div class="ti2">
      <div class="chk${t.done?' dn':''}" onclick="toggleTask(${t.id})"></div>
      <div><div class="ttxt${t.done?' dn':''}">${esc(t.text)}</div><div class="ttag">${esc(t.tag)}</div></div>
    </div>`
  ).join('') || '<p class="empty">No tasks yet.</p>';
}

function renderGoals() {
  const el = document.getElementById('goals-list');
  el.innerHTML = state.goals.map(g => {
    const c = COLORS[g.ci % COLORS.length];
    return `<div class="gi">
      <div class="gico" style="background:${c.ico};color:${c.clr}"><i class="ti ${g.icon}"></i></div>
      <div class="ginfo">
        <div class="gname">${esc(g.name)}</div>
        <div class="gmeta">Target: ${g.target} · ${esc(g.cat)}</div>
        <div class="pbar"><div class="pfill" style="width:${g.pct}%;background:${c.clr}"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:4px">
        <span class="bdg ${c.bdg}">${g.pct}%</span>
        <button class="editbtn" onclick="editGoalPct(${g.id})" title="Edit progress"><i class="ti ti-edit"></i></button>
        <button class="dbtn" onclick="deleteItem('goals',${g.id})" title="Delete"><i class="ti ti-trash"></i></button>
      </div>
    </div>`;
  }).join('') || '<p class="empty">No goals yet. Add one!</p>';
}

function renderTasks() {
  document.getElementById('tasks-date').textContent = 'Tasks for today, ' + now();
  const el = document.getElementById('tasks-list');
  el.innerHTML = state.tasks.map(t =>
    `<div class="ti2">
      <div class="chk${t.done?' dn':''}" onclick="toggleTask(${t.id})"></div>
      <div style="flex:1">
        <div class="ttxt${t.done?' dn':''}">${esc(t.text)}</div>
        <div class="ttag">${esc(t.tag)}</div>
      </div>
      <button class="dbtn" onclick="deleteItem('tasks',${t.id})" title="Delete"><i class="ti ti-trash"></i></button>
    </div>`
  ).join('') || '<p class="empty">No tasks yet. Add one!</p>';
}

function renderMilestones() {
  const up = state.milestones.filter(m => !m.done);
  const dn = state.milestones.filter(m => m.done);
  document.getElementById('miles-count').textContent = up.length;
  document.getElementById('miles-upcoming').innerHTML = up.map(m => {
    const c = COLORS[m.ci % COLORS.length];
    return `<div class="mi">
      <div class="mdot" style="background:${c.clr}"></div>
      <div class="minfo"><div class="mn">${esc(m.name)}</div><div class="md">Target: ${m.date}</div></div>
      <span class="bdg ${c.bdg}">upcoming</span>
      <button class="editbtn" onclick="completeMilestone(${m.id})" title="Mark done"><i class="ti ti-check"></i></button>
      <button class="dbtn" onclick="deleteItem('milestones',${m.id})" title="Delete"><i class="ti ti-trash"></i></button>
    </div>`;
  }).join('') || '<p class="empty">No upcoming milestones.</p>';

  document.getElementById('miles-done').innerHTML = dn.map(m => {
    const c = COLORS[m.ci % COLORS.length];
    return `<div class="mi">
      <div class="mdot" style="background:${c.clr}"></div>
      <div class="minfo"><div class="mn">${esc(m.name)}</div><div class="md">Achieved: ${m.date}</div></div>
      <span class="bdg bt">done</span>
      <button class="dbtn" onclick="deleteItem('milestones',${m.id})" title="Delete"><i class="ti ti-trash"></i></button>
    </div>`;
  }).join('') || '<p class="empty">No achievements yet. Keep going!</p>';
}

function renderJournal() {
  document.getElementById('moodRow').innerHTML = MOODS.map((m, i) =>
    `<button class="mb${state.selMood===i?' on':''}" onclick="selMood(${i})"><span class="em">${m.e}</span>${m.l}</button>`
  ).join('');
  document.getElementById('journal-list').innerHTML = state.journal.map(j =>
    `<div class="je">
      <div class="jd">${esc(j.date)} · ${j.mood}</div>
      <div class="jt">${esc(j.text)}</div>
      <button class="dbtn" onclick="deleteItem('journal',${j.id})" title="Delete" style="margin-top:4px"><i class="ti ti-trash"></i></button>
    </div>`
  ).join('') || '<p class="empty">No entries yet.</p>';
}

function renderStreak() {
  const sg = document.getElementById('streakGrid');
  if (!sg) return;
  sg.innerHTML = state.streakDays.map(v =>
    `<div class="sd${v===1?' dn':v===2?' td':''}"></div>`
  ).join('');
}

function selMood(i) { state.selMood = i; renderJournal(); }

function toggleTask(id) {
  const t = state.tasks.find(x => x.id === id);
  if (t) { t.done = !t.done; render(); }
}

function completeMilestone(id) {
  const m = state.milestones.find(x => x.id === id);
  if (m) { m.done = true; render(); }
}

function deleteItem(type, id) {
  state[type] = state[type].filter(x => x.id !== id);
  render();
}

function saveJournal() {
  const txt = document.getElementById('jtxt').value.trim();
  if (!txt) return;
  const m = MOODS[state.selMood];
  const d = new Date().toLocaleDateString('en-IN', {month:'short',day:'numeric',year:'numeric'});
  state.journal.unshift({id: state.nextId++, date: d, mood: m.e + ' ' + m.l, text: txt});
  state.streakDays.push(2); state.streakDays.shift();
  document.getElementById('jtxt').value = '';
  render();
}

function editGoalPct(id) {
  const g = state.goals.find(x => x.id === id);
  if (!g) return;
  const v = prompt('Update progress for "' + g.name + '" (0–100):', g.pct);
  if (v === null) return;
  g.pct = Math.min(100, Math.max(0, parseInt(v) || 0));
  render();
}

function openModal(type) {
  const box = document.getElementById('modalBox');
  if (type === 'goal') {
    box.innerHTML = `<h3>Add goal</h3>
      <div class="field"><label>Goal name</label><input id="f-name" type="text" placeholder="e.g. Learn guitar" autofocus></div>
      <div class="field"><label>Category</label><input id="f-cat" type="text" placeholder="e.g. Skills"></div>
      <div class="field"><label>Target date</label><input id="f-date" type="date" value="2026-12-31"></div>
      <div class="field"><label>Starting progress (%)</label><input id="f-pct" type="number" min="0" max="100" value="0"></div>
      <div class="frow">
        <button class="sbtn" onclick="submitGoal()"><i class="ti ti-plus"></i> Add goal</button>
        <button class="sbtn cancel" onclick="closeModal()">Cancel</button>
      </div>`;
  } else if (type === 'task') {
    box.innerHTML = `<h3>Add task</h3>
      <div class="field"><label>Task description</label><input id="f-name" type="text" placeholder="e.g. Evening walk" autofocus></div>
      <div class="field"><label>Tag / category</label><input id="f-tag" type="text" placeholder="e.g. wellness"></div>
      <div class="frow">
        <button class="sbtn" onclick="submitTask()"><i class="ti ti-plus"></i> Add task</button>
        <button class="sbtn cancel" onclick="closeModal()">Cancel</button>
      </div>`;
  } else if (type === 'milestone') {
    box.innerHTML = `<h3>Add milestone</h3>
      <div class="field"><label>Milestone name</label><input id="f-name" type="text" placeholder="e.g. Run my first 10K" autofocus></div>
      <div class="field"><label>Target date</label><input id="f-date" type="date" value="2026-12-31"></div>
      <div class="frow">
        <button class="sbtn" onclick="submitMilestone()"><i class="ti ti-plus"></i> Add milestone</button>
        <button class="sbtn cancel" onclick="closeModal()">Cancel</button>
      </div>`;
  }
  document.getElementById('modalBg').classList.add('show');
  setTimeout(() => { const f = box.querySelector('input'); if (f) f.focus(); }, 50);
}

function closeModal() { document.getElementById('modalBg').classList.remove('show'); }

function handleBgClick(e) { if (e.target === document.getElementById('modalBg')) closeModal(); }

function submitGoal() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) return;
  state.goals.push({
    id: state.nextId++, name,
    cat: document.getElementById('f-cat').value || 'General',
    pct: Math.min(100, Math.max(0, parseInt(document.getElementById('f-pct').value) || 0)),
    icon: ICONS[state.goals.length % ICONS.length],
    ci: state.goals.length % COLORS.length,
    target: document.getElementById('f-date').value || '2026-12-31'
  });
  closeModal(); render();
}

function submitTask() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) return;
  state.tasks.push({ id: state.nextId++, text: name, tag: document.getElementById('f-tag').value || 'general', done: false });
  closeModal(); render();
}

function submitMilestone() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) return;
  state.milestones.push({
    id: state.nextId++, name,
    date: document.getElementById('f-date').value || '2026-12-31',
    ci: state.milestones.length % COLORS.length, done: false
  });
  closeModal(); render();
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Keyboard: Escape closes modal
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Init
loadState();
document.getElementById('todayLabel').textContent = now();
render();