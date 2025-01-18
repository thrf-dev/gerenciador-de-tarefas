// Carregar as tarefas ao inicializar a página
window.onload = loadTasks;

// Função para salvar tarefas no localStorage

function saveTasks() {
  const tasks = [];
  const taskLists = document.querySelectorAll(".task-list");

  taskLists.forEach((taskList, index) => {
    const columnId = taskList.closest(".column").id; // Pega o ID da coluna
    const columnTasks = [];

    taskList.querySelectorAll(".task").forEach((task) => {
      columnTasks.push({
        id: task.id,
        text: task.textContent.trim(),
      });
    });

    tasks.push({ columnId, columnTasks });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para carregar tarefas do Local Storage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (savedTasks) {
    savedTasks.forEach(({ columnId, columnTasks }) => {
      const taskList = document.querySelector(`#${columnId} .task-list`);

      columnTasks.forEach(({ id, text }) => {
        const newTask = document.createElement("li");
        newTask.className = "task";
        newTask.draggable = true;
        newTask.textContent = text;
        newTask.id = id;
        newTask.ondragstart = drag;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-task";
        removeButton.onclick = () => {
          newTask.remove();
          saveTasks(); // Atualiza o Local Storage ao remover
        };

        const trashIcon = document.createElement("img");
        trashIcon.src = "./image/bin.png";
        trashIcon.alt = "Remover";
        trashIcon.className = "trash-icon";

        removeButton.appendChild(trashIcon);
        newTask.appendChild(removeButton);
        taskList.appendChild(newTask);
      });
    });
  }
}

// Função para adicionar a tarefa

addTask = (event, columnId) => {
  event.preventDefault();

  // Obter o valor do input
  const inputId = `task-input-${columnId}`;
  const taskInput = document.getElementById(inputId);
  const taskText = taskInput.value;

  if (taskText.trim() !== "") {
    // .trim: Remove espaços em branco no início e no fim da string armazenada em taskText

    // Criar um novo elemento de tarefa
    const newTask = document.createElement("li");
    newTask.className = "task";
    newTask.draggable = true;
    newTask.textContent = taskText;

    // Adiciona um ID exclusivo à tarefa
    newTask.id = `task-${Date.now()}`; // ID único baseado no relógio, ou seja, exatamente naquela hora.

    // Adicionar evento de drag
    newTask.ondragstart = drag;

    // Criar o botão de remoção com imagem de lixeira
    const removeButton = document.createElement("button");
    removeButton.className = "remove-task";
    removeButton.onclick = () => {
      newTask.remove(); // Remove o elemento da lista
      saveTasks();
    };

    // Adicionar a imagem da lixeira dentro do botão
    const trashIcon = document.createElement("img");
    trashIcon.src = "./image/bin.png"; // Link para o ícone da lixeira
    trashIcon.alt = "Remover";
    trashIcon.className = "trash-icon";

    removeButton.appendChild(trashIcon);

    // Adicionar o botão à tarefa
    newTask.appendChild(removeButton);

    // Adicionar a tarefa à lista
    const taskList = document.querySelector(`.task-list`);
    taskList.appendChild(newTask);

    // Limpar o input e ocultar o formulário
    taskInput.value = "";
    toggleForm(`${columnId}-form`);
    saveTasks();
  }
};

// Função para mostrar/ocultar o formulário
function toggleForm(formId) {
  const form = document.getElementById(formId);
  form.style.display = form.style.display === "block" ? "none" : "block";
}

// Permitir o drop na área

allowDrop = (event) => {
  event.preventDefault();
  const column = event.target.closest(".column");
  if (column) column.classList.add("dragover");
};

// Remover o estilo de "dragover" quando o elemento sair da área
dragLeave = (event) => {
  const column = event.target.closest(".column");
  if (column) column.classList.remove("dragover");
};

// Inicia o arrasto, definindo o ID do elemento arrastado
drag = (event) => {
  event.dataTransfer.setData("text", event.target.id);
};

// Lógica para soltar o item na nova área
drop = (event) => {
  event.preventDefault();
  const column = event.target.closest(".column");
  const taskId = event.dataTransfer.getData("text");
  const task = document.getElementById(taskId);

  if (column && task) {
    const taskList = column.querySelector(".task-list");
    taskList.appendChild(task);
    saveTasks();
  }

  // Remove o estilo de "dragover"
  if (column) column.classList.remove("dragover");
};
