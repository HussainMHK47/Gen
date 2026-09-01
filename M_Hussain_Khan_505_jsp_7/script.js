const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === '') return;
    
    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.innerText = taskText;

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerText = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = 'Delete';

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);
    todoList.appendChild(li);

    todoInput.value = '';

    deleteBtn.addEventListener('click', function () {
        const itemToDelete = this.parentElement.parentElement;
        todoList.removeChild(itemToDelete);
    });

    editBtn.addEventListener('click', function () {
        const itemToEdit = this.parentElement.parentElement;
        const span = itemToEdit.querySelector('.task-text');
        
        if (this.innerText === 'Edit') {
            span.contentEditable = true;
            span.focus();
            this.innerText = 'Save';
            this.style.backgroundColor = '#007bff';
            this.style.color = 'white';
        } else {
            span.contentEditable = false;
            this.innerText = 'Edit';
            this.style.backgroundColor = '#ffc107';
            this.style.color = '#212529';
        }
    });
}
