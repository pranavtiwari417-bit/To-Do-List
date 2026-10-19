
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";

// Save tasks in Local Storage
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.append(checkbox, span, deleteButton);
        taskList.appendChild(li);
    });

    // Update task statistics
    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedCount;
    pendingTasks.textContent = tasks.length - completedCount;

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    clearCompleted.disabled = completedCount === 0;
    clearCompleted.style.opacity =
        completedCount === 0 ? "0.5" : "1";
}

// Filter tasks
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

// Clear all completed tasks
clearCompleted.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});

// Show saved tasks on page load
renderTasks();
