const taskList = document.getElementById("taskList");
    const counter = document.getElementById("counter");
    const progressBar = document.getElementById("progressBar");
    const message = document.getElementById("message");
    const generateBtn = document.getElementById("generateBtn");
    const saveBtn = document.getElementById("saveBtn");
    async function generateTasks() {
      const goal = document.getElementById("goalInput")
        .value.trim();

      if (!goal) {
        message.textContent = "まずは目標を入力してください。";
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = "生成中...";
      message.textContent = "";

      try {
        const response = await fetch(
          "http://localhost:3000/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ goal })
          }
        );

        if (!response.ok) {
          throw new Error("タスクを生成できませんでした。APIの応答が不正です。");
        }

        const tasks = await response.json();


        if (!Array.isArray(tasks)) {
          throw new Error("タスクを生成できませんでした。APIの応答が不正です。");
        }
        currentGoal = goal;
        currentTasks = tasks;
        console.log("Goals:", currentGoal);
        console.log("Generated tasks:", currentTasks);
        taskList.innerHTML = "";

        tasks.forEach(createTaskElement);
        updateProgress();

        if (tasks.length === 0) {
          showEmpty("AIがタスクを生成できませんでした。");
        }
      } catch (error) {
        message.textContent =
          error.message.includes("Failed to fetch")
            ? "APIに接続できませんでした."
            : error.message;
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "✦ タスクを生成";
      }
    }

    function createTaskElement(taskText) {
      const li = document.createElement("li");

      const check = document.createElement("button");
      check.className = "task-check";
      check.textContent = "✓";
      check.onclick = () => selectTask(check);

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = String(taskText);

      const actions = document.createElement("div");
      actions.className = "task-actions hidden";


      const edit = document.createElement("button");
      edit.textContent = "編集";
      edit.onclick = () => editTask(edit);

      const complete = document.createElement("button");
      complete.textContent = "完了";
      complete.onclick = () => toggleTask(check);

      const remove = document.createElement("button");
      remove.className = "delete";
      remove.textContent = "削除";
      remove.setAttribute("aria-label", "削除");
      remove.onclick = () => deleteTask(remove);

      actions.append(complete, edit, remove);
      li.append(check, span, actions);
      taskList.appendChild(li);

      updateProgress();
    }
    function selectTask(btn) {
      const li = btn.closest("li");
      btn.classList.toggle("checked");
      const actions = li.querySelector(".task-actions");
      actions.classList.toggle("hidden");
    }
    function toggleTask(btn) {
      const li = btn.closest("li");
      const span = li.querySelector(".task-text");
      const completed = span.classList.toggle("done");
      btn.setAttribute("aria-pressed", String(completed));

      updateProgress();
    }

    function deleteTask(btn) {
      btn.closest("li").remove();

      if (taskList.children.length === 0) {
        showEmpty("タスクなし");
      }

      updateProgress();
    }

    function editTask(btn) {
      const span = btn.closest("li").querySelector(".task-text");
      const text = prompt("タスク編集", span.textContent);

      if (text !== null && text.trim()) {
        span.textContent = text.trim();
      }
    }

    function addTask() {
      const input = document.getElementById("newTask");
      const text = input.value.trim();

      if (!text) return;

      if (taskList.querySelector(".empty")) {
        taskList.innerHTML = "";
      }

      createTaskElement(text);
      input.value = "";
      input.focus();
    }

    document.getElementById("addTaskForm")
      .addEventListener("submit", event => {
        event.preventDefault();
        addTask();
      });

    document.getElementById("goalInput")
      .addEventListener("keydown", event => {
        if (event.key === "Enter") {
          generateTasks();
        }
      });

    function updateProgress() {
      const items = [...taskList.querySelectorAll("li")]
        .filter(li => !li.classList.contains("empty"));

      const completed = items.filter(li =>
        li.querySelector(".task-text").classList.contains("done")
      ).length;

      counter.textContent =
        `${completed}/${items.length} 完了`;

      progressBar.style.width = items.length
        ? `${completed / items.length * 100}%`
        : "0%";
    }

    function showEmpty(text) {
      taskList.innerHTML = "";

      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = text;

      taskList.appendChild(li);
    }
  async function saveTasks() {
    try{
      const goal = document.getElementById("goalInput").value.trim();
      const tasks = [...document.querySelectorAll(".task-text")]
      .map(el => el.textContent);
      console.log("Saving tasks:", goal, tasks);
      const response = await fetch(
        "http://localhost:3000/api/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            goal: goal,
            tasks : tasks
          })
        }
      );const result = await response.json();
      if (response.ok) {
        console.log("Tasks saved successfully:", result);
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }