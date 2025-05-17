window.onload = function () {
  loadTasks();
  requestNotificationPermission();
  renderTasks();
};

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  const taskDate = document.getElementById("taskDate").value;
  const taskTime = document.getElementById("taskTime").value;
  const taskCategory = document.getElementById("taskCategory").value;

  if (!taskText || !taskDate || !taskTime) {
    alert("Please fill in all fields.");
    return;
  }

  const dueDateTime = new Date(`${taskDate}T${taskTime}`);
  const task = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    time: taskTime,
    category: taskCategory,
    completed: false
  };

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  scheduleNotification(task);
  renderTasks();

  taskInput.value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskTime").value = "";
}

function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const updatedTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  renderTasks();
}

function toggleTaskComplete(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const updatedTasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  renderTasks();
}

function clearCompleted() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const pendingTasks = tasks.filter(task => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(pendingTasks));
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const filterStatus = document.getElementById("filterStatus").value;
  const filterCategory = document.getElementById("filterCategory").value;

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === "all" || !task.completed;
    const categoryMatch = filterCategory === "all" || task.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
      <span>
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${task.id})">
        <strong>[${task.category}]</strong> ${task.text} - Due: ${task.date} ${task.time}
      </span>
      <button onclick="deleteTask(${task.id})">✖</button>
    `;
    taskList.appendChild(li);
  });

  document.getElementById("taskCount").innerText = `Total Tasks: ${filteredTasks.length}`;
}

function scheduleNotification(task) {
  const now = new Date();
  const due = new Date(`${task.date}T${task.time}`);
  const delay = due.getTime() - now.getTime();

  if (delay > 0 && "Notification" in window && Notification.permission === "granted") {
    setTimeout(() => {
      new Notification("Task Reminder", {
        body: `${task.text} is due now! [${task.category}]`,
        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
      });
    }, delay);
  }
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(task => scheduleNotification(task));
}
