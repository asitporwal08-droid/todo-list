const STORAGE_KEY = "daymark-tasks";

let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = document.querySelector("#emptyTitle");
const emptyDetail = document.querySelector("#emptyDetail");
const allCount = document.querySelector("#allCount");
const activeCount = document.querySelector("#activeCount");
const completedCount = document.querySelector("#completedCount");
const progressRing = document.querySelector("#progressRing");
const progressNumber = document.querySelector("#progressNumber");
const progressLabel = document.querySelector("#progressLabel");
const progressDetail = document.querySelector("#progressDetail");

document.querySelector("#dateStamp").textContent = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
}).format(new Date());

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.unshift({ id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() });
  taskInput.value = "";
  saveAndRender();
  taskInput.focus();
});

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active);
    });
    render();
  });
});

document.querySelector("#clearCompleted").addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveAndRender();
});

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}

function render() {
  const completed = tasks.filter((task) => task.completed).length;
  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  allCount.textContent = tasks.length;
  activeCount.textContent = tasks.length - completed;
  completedCount.textContent = completed;
  updateProgress(completed);

  taskList.innerHTML = visibleTasks.map((task, index) => `
    <article class="task-item${task.completed ? " is-complete" : ""}" style="animation-delay: ${index * 35}ms">
      <button class="check-button" type="button" aria-label="${task.completed ? "Mark incomplete" : "Mark complete"}: ${escapeHtml(task.title)}" data-action="toggle" data-id="${task.id}"></button>
      <div class="task-copy">
        <div>${escapeHtml(task.title)}</div>
        <div class="task-time">${formatTime(task.createdAt)}</div>
      </div>
      <button class="delete-button" type="button" aria-label="Delete ${escapeHtml(task.title)}" data-action="delete" data-id="${task.id}">×</button>
    </article>
  `).join("");

  const hasTasks = visibleTasks.length > 0;
  taskList.hidden = !hasTasks;
  emptyState.hidden = hasTasks;
  if (!hasTasks) {
    const isFiltered = currentFilter !== "all";
    emptyTitle.textContent = isFiltered ? `No ${currentFilter} tasks` : "Nothing here yet";
    emptyDetail.textContent = isFiltered ? "Try another view or add a fresh task." : "Put one small thing on the board and start there.";
  }
}

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const task = tasks.find((item) => item.id === button.dataset.id);
  if (!task) return;

  if (button.dataset.action === "toggle") task.completed = !task.completed;
  if (button.dataset.action === "delete") tasks = tasks.filter((item) => item.id !== task.id);
  saveAndRender();
});

function updateProgress(completed) {
  const total = tasks.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressNumber.textContent = `${percent}%`;
  progressRing.style.transform = `rotate(${percent * 3.6}deg)`;
  progressRing.classList.toggle("is-complete", total > 0 && percent === 100);
  progressLabel.textContent = total === 0 ? "A clean slate." : percent === 100 ? "Everything handled." : `${total - completed} ${total - completed === 1 ? "thing" : "things"} in motion.`;
  progressDetail.textContent = total === 0 ? "Add something worth doing." : `${completed} of ${total} ${total === 1 ? "task" : "tasks"} complete.`;
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(timestamp);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

render();
