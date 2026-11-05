console.log("task-details.js loaded");
const params = new URLSearchParams(
window.location.search
);
const goalId = params.get("goalId");

console.log("goalId =", goalId);



async function loadTaskDetail() {

  const response = await fetch(
    `/api/tasks/${goalId}`
  );

  const data = await response.json();

  document.getElementById("goalTitle")
    .textContent = data.goal;

  const taskList =
    document.getElementById("taskList");

  taskList.innerHTML = "";

  data.tasks.forEach(task => {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task;

    const complete = document.createElement("button");
    complete.textContent = "完了";

    complete.onclick = () => {
      span.classList.toggle("done");
    };

    const edit = document.createElement("button");
    edit.textContent = "編集";

    edit.onclick = () => {
      const text =
        prompt("タスク編集", span.textContent);

      if (text && text.trim()) {
        span.textContent = text.trim();
      }
    };

    const remove = document.createElement("button");
    remove.textContent = "削除";

    remove.onclick = () => {
      li.remove();
    };

    li.append(
      span,
      complete,
      edit,
      remove
    );

    taskList.appendChild(li);

  });

}
async function saveTaskChanges() {

  const tasks =
    [...document.querySelectorAll(".task-text")]
      .map(el => ({
        text: el.textContent,
        completed: el.classList.contains("done")
      }));

  const payload = {
    goalId,
    tasks
  };

  console.log(
    JSON.stringify(payload, null, 2)
  );

  await fetch(
    `/api/tasks/${goalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );
}
loadTaskDetail();
