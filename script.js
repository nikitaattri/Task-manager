// Load tasks from local storage on page load
window.onload = function () {
  loadTasks();
};

// Add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  // Check if task is empty
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const taskDateInput = document.getElementById("taskDate");
  const taskTimeInput = document.getElementById("taskTime");
  const taskDate = taskDateInput.value;
  const taskTime = taskTimeInput.value;

  // Log inputs for debugging
  console.log("Task:", taskText);
  console.log("Date:", taskDate);
  console.log("Time:", taskTime);

  // If no date or time is selected, alert the user
  if (!taskDate || !taskTime) {
    alert("Please set a date and time for the task.");
    return;
  }

  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");

  // Display task with date and time
  li.textContent = `${taskText} - Due: ${taskDate} ${taskTime}`;

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  taskInput.value = ""; // Clear input after adding
  taskDateInput.value = ""; // Clear date input
  taskTimeInput.value = ""; // Clear time input
  saveTasks();
}

// Save all tasks to local storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const taskList = document.getElementById("taskList");

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) {
      li.classList.add("completed");
    }

    li.addEventListener("click", () => {
      li.classList.toggle("completed");
      saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      li.remove();
      saveTasks();
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}
