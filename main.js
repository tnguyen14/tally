import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "./style.css";

const KEY = "tally:counters";

const $ = (id) => document.getElementById(id);
const $list = $("list");
const $add = $("add");
const $name = $("name");

const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const newId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// [{ id, name, value }]. Starts with one counter when nothing is stored.
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    // Storage unavailable or corrupt: fall through to the default.
  }
  return [{ id: newId(), name: "Counter", value: 0 }];
}

let counters = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(counters));
  } catch {
    // Private mode or quota: keep working in memory.
  }
}

function row(c) {
  return `<li data-id="${c.id}">
    <input class="label" value="${esc(c.name)}" aria-label="Counter name" />
    <div class="controls">
      <button class="step" data-act="dec" aria-label="Decrement ${esc(c.name)}">−</button>
      <output class="value">${c.value.toLocaleString()}</output>
      <button class="step" data-act="inc" aria-label="Increment ${esc(c.name)}">+</button>
    </div>
    <div class="actions">
      <button class="link" data-act="reset">Reset</button>
      <button class="link danger" data-act="delete">Delete</button>
    </div>
  </li>`;
}

function render() {
  $list.innerHTML = counters.map(row).join("");
}

const find = (el) => {
  const li = el.closest("li");
  return li && counters.find((c) => c.id === li.dataset.id);
};

$list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const c = find(btn);
  if (!c) return;
  switch (btn.dataset.act) {
    case "inc":
      c.value += 1;
      break;
    case "dec":
      c.value -= 1;
      break;
    case "reset":
      if (c.value !== 0 && !confirm(`Reset "${c.name}" to 0?`)) return;
      c.value = 0;
      break;
    case "delete":
      if (!confirm(`Delete "${c.name}"?`)) return;
      counters = counters.filter((x) => x !== c);
      break;
  }
  save();
  render();
});

// Rename in place; saved on every keystroke, no re-render so focus stays.
$list.addEventListener("input", (e) => {
  if (!e.target.matches(".label")) return;
  const c = find(e.target);
  if (!c) return;
  c.name = e.target.value;
  save();
});
$list.addEventListener("keydown", (e) => {
  if (e.target.matches(".label") && e.key === "Enter") e.target.blur();
});

$add.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $name.value.trim() || `Counter ${counters.length + 1}`;
  counters.push({ id: newId(), name, value: 0 });
  $name.value = "";
  save();
  render();
});

// Keep multiple open tabs in sync.
window.addEventListener("storage", (e) => {
  if (e.key !== KEY) return;
  counters = load();
  render();
});

render();
