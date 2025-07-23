<script>
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      ${task.text}
      <div>
        <button onclick="toggleComplete(${index})"> ✓ </button>
        <button onclick="deleteTask(${index})"> × </button>
      </div>
    `;
    taskList.appendChild(li);
    });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    renderTasks();
  }
});
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}
</script>