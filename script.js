// Initialize the calendar
document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ["dayGrid", "interaction"],
    initialView: "dayGridMonth",  // Show calendar in month view
    selectable: true,
    events: [],  // To display existing tasks
    dateClick: function (info) {
      // Open task input when a date is clicked
      const taskDate = info.dateStr;
      const taskInput = document.getElementById("taskInput");
      const taskTime = document.getElementById("taskTime");

      taskInput.value = "";
      taskTime.value = "";

      const addTaskButton = document.querySelector("button");
      addTaskButton.onclick = function () {
        const taskText = taskInput.value.trim();
        const taskDueTime = taskTime.value;
        if (taskText === "") {
          alert("Please enter a task.");
          return;
        }

        // Add event to calendar for the selected date
        calendar.addEvent({
          title: taskText,
          start: taskDate + "T" + taskDueTime,
          allDay: false
        });

        // Save task to local storage with the selected date
        saveTaskToStorage(taskText, taskDate, taskDueTime);

        taskInput.value = "";
        taskTime.value = "";
      };
    },
  });

  // Render the calendar
  calendar.render();
});

// Save task to local storage
function saveTaskToStorage(taskText, taskDate, taskDueTime) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push({
    text: taskText,
    date: taskDate,
    time: taskDueTime,
    completed: false,
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((task) => {
    // Add existing tasks as FullCalendar events
    calendar.addEvent({
      title: task.text,
      start: task.date + "T" + task.time,
      allDay: false
    });
  });
}

// Check for reminders every minute
setInterval(() => {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const now = new Date();
  tasks.forEach((task, index) => {
    const taskTime = new Date(task.date + "T" + task.time);
    if (taskTime <= now && !task.completed) {
      alert(`Reminder: "${task.text}" is due now!`);
      tasks[index].completed = true; // Mark as completed after reminder
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
}, 60000);
