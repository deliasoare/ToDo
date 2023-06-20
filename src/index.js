import './styles.css';
import {Department, ToDo} from './obj';
import Plus from './assets/plus.svg';
import UpArrow from './assets/upArrow.svg';
import DownArrow from './assets/downArrow.svg';
import Minus from './assets/minus.svg';
import Done from './assets/done3.svg';

const tasks = document.querySelector('.tasks');
const modals = document.querySelectorAll('.modal-container');
const newDepModal = document.querySelector('.mod-contNewDep');
const newTaskModal = document.querySelector('.mod-contNewTask');
const colorMapModal = document.querySelector('.mod-contColorMap');
const taskModal = document.querySelector('.mod-contTask');
const addDep = document.querySelector('.addDep');
const colorMap = document.querySelector('.colorMap')
const warning = document.querySelector('.warning');
const categories = document.querySelectorAll('.category');

let currentCategory = 'all';
let taskClicked;

if (!window.localStorage.getItem('DEPARTMENTS')) {
    window.localStorage.setItem('DEPARTMENTS', JSON.stringify([
        new Department('General')
    ]))
}

let plusClicked = (JSON.parse(window.localStorage.getItem('DEPARTMENTS')))[0];

const formDep = document.querySelector('.formDep');
const formTask = document.querySelector('.formTask');
const formExistingTask = document.querySelector('.formExistingTask');

const DOM = (function() {
    const _focusModal = (modal) => {
        if (modal.querySelector('input')) 
             modal.querySelector('input').focus();
    }

    const _clearAllInputs = (element) => {
        if (element.querySelectorAll('input'))
            element.querySelectorAll('input').forEach(input => {
                input.value = '';
            })
        if (element.querySelectorAll('textarea'))
            element.querySelectorAll('textarea').forEach(area => {
                area.value = '';
            })
    }

    const openModal = (modal) => {
        modal.style.display = 'flex';
        _focusModal(modal);

    }

    const closeModal = (modal) => {
        modal.style.display = 'none';
        _clearAllInputs(modal);

        if (modal === newTaskModal) 
            closeTaskModal();
        
    }
    
    const switchCategory = (category) => {
        categories.forEach(cat => {
            if (cat.classList.value.includes('selectedCategory'))
                cat.classList.remove('selectedCategory');
        })
        category.classList.add('selectedCategory');
    }

    const showTemporaryWarning = (message) => {
        warning.textContent = message;
        warning.style.display = 'block';
        setTimeout(function() {
            warning.textContent = '';
            warning.style.display = 'none';
        }, 3000);
    }

    const openMod = function(department, DOMelement, DBelement) {
        const handler = function(e) {
            if (e.target !== DOMelement.querySelector('.done')) {
                openModal(taskModal)
                document.querySelector('.modalTask').classList = `modal modalTask taskModal${DBelement.priority}`;
                document.querySelector('.existingTaskTitle').textContent = DBelement.title;
                document.querySelector('.existingTaskPriority').textContent = DBelement.priority;
                document.querySelector('.existingTaskDescription').innerHTML = `Description: <br> ${DBelement.description}`;
                document.querySelector('.existingTaskNotes').innerHTML = `Notes: <br> ${DBelement.notes}`;
                document.querySelector('.existingTaskDeadline').innerHTML = `DEADLINE: <br> ${DBelement.deadline}`;
                document.querySelector('.editTask').classList = `editTask editTaskPr${DBelement.priority === 'I' ? 1 : (DBelement.priority === 'II' ? 2 : 3)}`;

                taskClicked = [department, DBelement];

                openTaskModalToEdit();
        }
            for (let i = 0; i < DOMelement.classList.length; i++)
                if (DOMelement.classList[i] === 'doneTask')
                    DOMelement.removeEventListener('click', handler);
        }
        return handler;
    }
    const openTaskModalOnClick = (department, DOMelement, DBelement) => {
        DOMelement.addEventListener('click', openMod(department, DOMelement, DBelement))
    }
    const activateMarkAsDone = (todo, toDo) => {
        todo.querySelector('.done').addEventListener('click', function() {
          todo.classList.add('doneTask');
          Functionality.markTaskAsDone(toDo);  
        })
    }
    const loadTask = (toDo, dep) => {
        const todo = document.createElement('div');
        todo.classList = `toDo toDo${toDo.priority}`;
        if (toDo.done === true) {
            todo.classList.add('doneTask');
        }
        const title = document.createElement('span');
        title.classList = 'toDoTitle';
        title.textContent = toDo.title;
        const done = document.createElement('img');
        done.classList = 'done icon';
        done.src = Done;

        todo.append(title, done);

        openTaskModalOnClick(dep, todo, toDo);

        activateMarkAsDone(todo, toDo);

        return todo;
}
    const loadTasks = (dep) => {
        const toDoCont = document.createElement('div');
        toDoCont.classList = 'toDoCont';
        let todo;
        if (currentCategory === 'all') {
            dep.toDos.forEach(toDo => {
                todo = loadTask(toDo);
                toDoCont.append(todo);
            })
        }
        else if (currentCategory === 'done') {
            dep.toDos.forEach(toDo => {
                if (toDo.done === true) {
                    todo = loadTask(toDo);
                    toDoCont.append(todo);
                }
            })
        }
        else if (currentCategory === 'missed') {
            dep.toDos.forEach(toDo => {
                if (toDo.done === false) {
                    const currentTime = new Date();
                    if (Number(toDo.deadline[0] + toDo.deadline[1] + toDo.deadline[2] + toDo.deadline[3]) < currentTime.getFullYear()) {
                        todo = loadTask(toDo);
                        toDoCont.append(todo);
                    }
                    else if (Number(toDo.deadline[0] + toDo.deadline[1] + toDo.deadline[2] + toDo.deadline[3]) === currentTime.getFullYear()) 
                        if (Number(toDo.deadline[5] + toDo.deadline[6]) < currentTime.getMonth() + 1) {
                            todo = loadTask(toDo);
                            toDoCont.append(todo);
                        }
                        else if (Number(toDo.deadline[5] + toDo.deadline[6]) === currentTime.getMonth() + 1)
                            if (Number(toDo.deadline[8] + toDo.deadline[9]) < currentTime.getDate()) {
                                todo = loadTask(toDo);
                                toDoCont.append(todo);
                            }
                            else if (Number(toDo.deadline[8] + toDo.deadline[9]) === currentTime.getDate())
                                if (Number(toDo.deadline[14] + toDo.deadline[15]) < currentTime.getHours()) {
                                    todo = loadTask(toDo);
                                    toDoCont.append(todo);
                                }
                                else if (Number(toDo.deadline[14] + toDo.deadline[15]) === currentTime.getHours())
                                    if (Number(toDo.deadline[17] + toDo.deadline[18]) < currentTime.getMinutes()) {
                                        todo = loadTask(toDo);
                                        toDoCont.append(todo);
                                    }
                }   
            })
        }
        else if (currentCategory === 'left') {
            dep.toDos.forEach(toDo => {
                if (toDo.done === false) {
                    todo = loadTask(toDo);
                    toDoCont.append(todo);
                }
            })
        }
       return toDoCont;
    }

    const updateDepartment = (department) => {
        let toDoCont = loadTasks(department);
        if (toDoCont) {
            const depCont = document.createElement('div');
            depCont.classList = `depContainer${department.title}`;
            const dep = document.createElement('div');
            dep.classList = `department ${department.title}`;
            const plus = document.createElement('img');
            plus.classList = `depPlus ${department.title} icon`;
            const title = document.createElement('span');
            title.textContent = department.title;
            title.classList = `depTitle ${department.title}`;
            const expand = document.createElement('img');
            expand.classList = `depExpand  ${department.title} icon`;
            const del = document.createElement('img');
            del.classList = `depDelete ${department.title} icon`;

            plus.src = Plus;
            expand.src = DownArrow;
            del.src = Minus;
            dep.append(plus, title, expand, del);
            depCont.append(dep);
            depCont.append(toDoCont);
            tasks.append(depCont);
            setTimeout(activateDepartmentButtons(dep), 0);
        }
 }
    const updateDepartments = () => {
        tasks.textContent = '';
        (JSON.parse(window.localStorage.getItem('DEPARTMENTS'))).forEach(department => {
            updateDepartment(department);
    })
}

    const activatePlus = (department) => {
        department.querySelector('.depPlus').addEventListener('click', function() {
            openModal(newTaskModal);
            openTaskModal();
            const DEPARTMENTS = JSON.parse(window.localStorage.getItem('DEPARTMENTS'));
            DEPARTMENTS.forEach(dep => {
                if (dep.title === department.querySelector('.depTitle').textContent) {
                    plusClicked = dep;
                }
            })
        })
    }
    const activateClick = (department) => {
        department.addEventListener('click', (e) => {
            if (e.target !== department.querySelector('.depPlus') && e.target !== department.querySelector('.depDelete'))
                DOM.toggleShowTasks(department.parentNode);
        })
    }
    const activateDelete = (department) => {
        department.querySelector('.depDelete').addEventListener('click', function() {
        Functionality.deleteDepartment(department);
        updateDepartments();
    })
    }
    const activateDepartmentButtons = (department) => {
        activatePlus(department);
        activateClick(department);
        activateDelete(department);
    }

    const openPrioritySelect = () => {
        let select = document.querySelector('.select_ul');
        select.style.display = 'block';
    }
    const closePrioritySelect = () => {
        let select = document.querySelector('.select_ul');
        select.style.display = 'none';
    }
    const togglePrioritySelect = () => {
        let select = document.querySelector('.select_ul');
        if (select.style.display === 'none')
            openPrioritySelect();
        else
            closePrioritySelect();
    }
    const changePriority = (priority) => {
        priority.textContent = priority.classList[1];
        let def = document.querySelector('.default_option');
        def.innerHTML = '';
        def.append(priority);
        closePrioritySelect();
    }
    const openTaskModalToEdit = () => {
        document.querySelector('.addTask').style.display = 'none';
        document.querySelector('.select_ul').style.display = 'none';
        const edit = document.createElement('button');
        edit.type = 'submit';
        edit.textContent = 'OK';
        edit.classList = 'editTaskBtn';

        if (!newTaskModal.querySelector('form').querySelector('.editTaskBtn'))
            newTaskModal.querySelector('form').append(edit);

        edit.addEventListener('click', function() {
            const [title, priority, description, notes, date] = Functionality.extractTaskData();
            processInfoEditTask(taskClicked[1], title, priority, description, notes, date);
        });
    }
    const closeTaskModal = () => {
        if (document.querySelector('.editTaskBtn'))
            document.querySelector('.editTaskBtn').remove();
    }
    const openTaskModal = () => {
        document.querySelector('.addTask').style.display = 'block';
        if (document.querySelector('.editTaskBtn')) 
            document.querySelector('.editTaskBtn').style.display = 'none';
    }

    const toggleShowTasks = (department) => {
        if (department.querySelector('.toDoCont').innerHTML) {
            const toDoContainer = department.querySelector('.toDoCont');
            if (toDoContainer.style.display === 'none') {
                toDoContainer.style.display = 'flex';
                department.querySelector('.depExpand').src = DownArrow;   
            }
            else {
                toDoContainer.style.display = 'none';
                department.querySelector('.depExpand').src = UpArrow;   
            }
        }
    }
    return {openModal, openTaskModalToEdit, closeModal, changePriority, closePrioritySelect, updateDepartments, showTemporaryWarning, switchCategory, togglePrioritySelect, toggleShowTasks};
})();

const Functionality = (function() {
    const addDepartment = (title) => {
        let stop = false;
        let dep;
        (JSON.parse(window.localStorage.getItem('DEPARTMENTS'))).forEach(department => {
            if (department.title.toLowerCase() === title.toLowerCase()) {
                DOM.showTemporaryWarning('There is already a department with this title.');
                stop = true;
            }
        })
        if (stop === true)
            return 0;
        dep = new Department(title);
        let departments = JSON.parse(window.localStorage.getItem('DEPARTMENTS'));
        departments.push(dep);
        window.localStorage.setItem('DEPARTMENTS', JSON.stringify(departments));
    }
    const extractTaskData = () => {
        const title = formTask.querySelector('#taskTitle').value;
        const priority = formTask.querySelector('.default_option').querySelector('.priority').textContent;
        const description = formTask.querySelector('#desc').value;
        const notes = formTask.querySelector('#notes').value;
        const dateValue = formTask.querySelector('#date').value;
        let date = new Date(dateValue);
        date = `${date.getFullYear()}.${date.getMonth() + 1 < 10 ? `0${date.getMonth() +1}` : date.getMonth() + 1}.${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} at ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes()<10 ? `0${date.getMinutes()}` : date.getMinutes()}`;

        return [title, priority, description, notes, date];
    }

    const addTask = (department, title, priority, description, notes, date) => {
        let stop = false;
        department.toDos.forEach(toDo => {
            if (toDo.title.toLowerCase() === title.toLowerCase()) {
                DOM.showTemporaryWarning('There already is such a task in this department!')
                stop = true;
            }
        })
        if (stop === true)
            return 0;
        let task = new ToDo(title, priority, description, notes, date);
        const DEPARTMENTS = (JSON.parse(window.localStorage.getItem('DEPARTMENTS')));
        let i;
        for (i = 0; i < DEPARTMENTS.length; i++) {
            if (DEPARTMENTS[i].title === department.title) 
                    DEPARTMENTS[i].toDos.push(task);
        }
        setTimeout(function() {
            window.localStorage.setItem('DEPARTMENTS', JSON.stringify(DEPARTMENTS));
        }, 0)
    }
    const editTask = (task, title, priority, description, notes, date) => {
        task.title = title;
        task.priority = priority;
        task.description = description;
        task.notes = notes;
        task.deadline = date;
    }
    
    const deleteDepartment = (departmentDOM) => {
        let DEPARTMENTS = JSON.parse(window.localStorage.getItem('DEPARTMENTS'));
        for (let i = 0; i < DEPARTMENTS.length; i++) {
            if (DEPARTMENTS[i].title === departmentDOM.querySelector('.depTitle').textContent)
                DEPARTMENTS.splice(i, 1);
        }
        setTimeout(function() {
            window.localStorage.setItem('DEPARTMENTS', JSON.stringify(DEPARTMENTS));
        }, 0)
    }
    
    const markTaskAsDone = (task) => {
        const DEPARTMENTS = JSON.parse(window.localStorage.getItem('DEPARTMENTS'));
        let i, j;
        for (i = 0; i < DEPARTMENTS.length; i++)
            for (j = 0; j < DEPARTMENTS[i].toDos.length; j++) {
                if (DEPARTMENTS[i].toDos[j].title === task.title)
                    DEPARTMENTS[i].toDos[j].done = true;
            }
        setTimeout(function() {
            window.localStorage.setItem('DEPARTMENTS', JSON.stringify(DEPARTMENTS));
        })
    }
    return {addDepartment, addTask, deleteDepartment, editTask, extractTaskData, markTaskAsDone};
})();

function processInfoEditTask(task, title, priority, description, notes, date) {
    Functionality.editTask(task, title, priority, description, notes, date);
    DOM.updateDepartments();
    setTimeout(DOM.closeModal(newTaskModal));
}

addDep.addEventListener('click', function() {
    DOM.openModal(newDepModal);
});
colorMap.addEventListener('click', function() {
    DOM.openModal(colorMapModal);
});

window.onclick = function(e) {
    modals.forEach(modal => {
        if (modal === e.target) 
            DOM.closeModal(modal);
    })
}

formDep.addEventListener('submit', function(e) {
    const value = document.querySelector('#title2').value;
    Functionality.addDepartment(value);
    setTimeout(function() {
        DOM.updateDepartments();
        DOM.closeModal(newDepModal);
    }, 0)
    e.preventDefault();
})

formTask.addEventListener('submit', function(e) {
    e.preventDefault();
    const [title, priority, description, notes, date] = Functionality.extractTaskData();
    Functionality.addTask(plusClicked, title, priority, description, notes, date);
    setTimeout(function() {
        DOM.updateDepartments();
        DOM.closeModal(newTaskModal);
    }, 0)
})

formExistingTask.addEventListener('submit', (e) => {
    e.preventDefault();
    DOM.closeModal(taskModal);
    DOM.openModal(newTaskModal);
    let department = taskClicked[0];
    let toDo = taskClicked[1];
    newTaskModal.querySelector('#taskTitle').value = toDo.title;
    newTaskModal.querySelector('#desc').value = toDo.description;
    newTaskModal.querySelector('#notes').value = toDo.notes;
    newTaskModal.querySelector('.default_option').querySelector('.priority').textContent = toDo.priority;
    let date = toDo.deadline.replaceAll('.', '-');
    date = date.replace(' at ', 'T');
    newTaskModal.querySelector('#date').value = date;
})

categories.forEach(category => {
    category.addEventListener('click', function() {
        DOM.switchCategory(category);
        currentCategory = category.classList[0];
        DOM.updateDepartments();
    })
})

document.querySelector('.default_option').addEventListener('click', function() {
    DOM.togglePrioritySelect();
})

document.querySelector('.select_ul').querySelectorAll('.priority').forEach(priority => {
    priority.addEventListener('click', function() {
        DOM.changePriority(priority.cloneNode());
    });
})
window.onload = function() {
    DOM.updateDepartments();

}

