const el = (target, multiple = false) => {
    if (typeof target === 'string') {
        if (multiple) {
            return document.querySelectorAll(target);
        } else {
            return document.querySelector(target);
        }
    } else {
        throw 'param type of el func must be string!';
    }
};

const createEl = (el, className = null) => {
    if (typeof el === 'string') {
        const newEl = document.createElement(el);

        if (typeof className === 'string' && className) {
            const classNameList = className.trim().split(" ");
            newEl.classList.add(...classNameList);
        }
        
        if (typeof className !== 'string' && className) {
            throw `className type of createEl func must be string! \nWrong className => ${className} for ${el} element`;
        }

        return newEl;
    } else {
        throw `el type of createEl func must be string! \nWrong el => ${el}`;
    }
};

let TODO_LIST = [];

const inputEl = el("input");
const labelEl = el("label");
const addBtnEl = el(".btn");
const containerTodosEl = el(".container__todos");

const changeActivePropertyForLabel = () => {
    if (inputEl.value === "") {
        labelEl.classList.toggle("active");
    }
}

const clearInput = () => {
    inputEl.value = "";
}

const editTodoHandler = (e) => {
    const targetTodoId = Number(e.target.dataset.id);
    const targetElIndex = targetTodoId - 1;
    const targetTodoName = TODO_LIST.find((TODO) => TODO.id === targetTodoId);

    const todoNameEls = el(".todo__name", true);
    const todoEditInputEls = el(".todo__edit-input", true);
    todoNameEls[targetElIndex].classList.remove("active");
    todoEditInputEls[targetElIndex].classList.add("active");
    todoEditInputEls[targetElIndex].value = targetTodoName.todo;
    todoEditInputEls[targetElIndex].focus();
}

const saveTodoHandler = (e) => {
    if (e.keyCode === 13) { // It means, user clicked enter
        const targetTodoId = Number(e.target.dataset.id);
        const newTodoValue = e.target.value;

        if (newTodoValue.trim() !== "") {
            const targetTodoObj = TODO_LIST.find((TODO) => TODO.id === targetTodoId);
            targetTodoObj.todo = newTodoValue;
            addToHTML();
        }
    }
};

const dontSaveTodoHandler = (e) => {
    const targetTodoId = Number(e.target.dataset.id);
    const targetElIndex = targetTodoId - 1;

    const todoNameEls = el(".todo__name", true);
    const todoEditInputEls = el(".todo__edit-input", true);
    todoNameEls[targetElIndex].classList.add("active");
    todoEditInputEls[targetElIndex].classList.remove("active");
};

const deleteTodoHandler = (e) => {
    const targetId = Number(e.target.dataset.id);
    FILTERED_TODO_LIST = TODO_LIST.filter((TODO) => TODO.id !== targetId);
    TODO_LIST = FILTERED_TODO_LIST.map((FILTERED_TODO, idx) => (
        {
            ...FILTERED_TODO,
            id: idx + 1,
        }
    ));
    addToHTML();
}

const setCompletedTodo = (e) => {
    const targetTodoId = Number(e.target.dataset.id);
    const targetTodoObj = TODO_LIST.find((TODO) => TODO.id === targetTodoId);
    targetTodoObj.isCompleted = !targetTodoObj.isCompleted; 
    addToHTML();
}

const clearTodosInHTML = () => {
    while (containerTodosEl.firstChild) {
        containerTodosEl.removeChild(containerTodosEl.lastChild);
    }
}

const addToHTML = () => {
    clearTodosInHTML();

     // add to HTML with dynamic values
     const childElements = TODO_LIST.map((TODO) => {
        // create html elements for todo
        const todoEl = createEl("div", "todo");

        // todo-left-part
        const todoLeftEl = createEl("div", "todo__left");
        todoLeftEl.addEventListener('dblclick', (e) => setCompletedTodo(e));
        if (TODO.isCompleted) {
            todoLeftEl.classList.add("active");
        }
        const todoNameEl = createEl("span", "todo__name active");
        const todoEditInputEl = createEl("input", "todo__edit-input");
        todoEditInputEl.type = "text";
        todoEditInputEl.addEventListener('keyup', (e) => saveTodoHandler(e));
        todoEditInputEl.addEventListener('blur', (e) => dontSaveTodoHandler(e));

        // todo-right-part
        const todoRightEl = createEl("div", "todo__right");
        const editButtonEl = createEl("button", "todo__btn todo__btn-edit");
        const editImgEL = createEl("img");
        editImgEL.src = './Img/pencil.png';
        editImgEL.width = 20;
        editImgEL.height = 20;
        const deleteButtonEl = createEl("button", "todo__btn todo__btn-delete");
        const deleteImgEL = createEl("img");
        deleteImgEL.src = './Img/trash.png';
        deleteImgEL.width = 20;
        deleteImgEL.height = 20;
        
        // listen some elements
        editButtonEl.addEventListener('click', (e) => editTodoHandler(e));
        deleteButtonEl.addEventListener('click', (e) => deleteTodoHandler(e));

        // placement
        todoLeftEl.append(todoNameEl, todoEditInputEl);
        editButtonEl.append(editImgEL);
        deleteButtonEl.append(deleteImgEL);
        todoRightEl.append(editButtonEl, deleteButtonEl);
        todoEl.append(todoLeftEl, todoRightEl);

        // dynamic values
        todoNameEl.innerHTML = TODO.todo;
        editImgEL.dataset.id = TODO.id;
        deleteImgEL.dataset.id = TODO.id;
        todoEditInputEl.dataset.id = TODO.id;
        todoLeftEl.dataset.id = TODO.id;
        todoEl.id = TODO.id;
        
        return todoEl;
    });
    containerTodosEl.append(...childElements);
}

const addNewTodo = () => {
    const todo_name = inputEl.value.trim();
    if (todo_name !== "") {
        if (TODO_LIST.length === 0) { // add first todo 
            TODO_LIST.push({
                id: 1,
                todo: todo_name,
                isCompleted: false,
                date: new Date(),
            });
        } else { // add not first todo
            const lastId = TODO_LIST[TODO_LIST.length - 1].id
            TODO_LIST.push({
                id: lastId + 1, 
                todo: todo_name,
                isCompleted: false,
                date: new Date(),
            });
        }
        clearInput();
        changeActivePropertyForLabel();
        addToHTML();
    }
}

inputEl.addEventListener('focus', changeActivePropertyForLabel);
inputEl.addEventListener('blur', changeActivePropertyForLabel);
inputEl.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) { // it means key is "Enter"
        inputEl.blur();
        addNewTodo();
    }
});
addBtnEl.addEventListener('click', addNewTodo);