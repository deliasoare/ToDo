import './styles.css';
import {Department, ToDo} from './obj';
import Plus from './assets/plus.svg';
import DownArrow from './assets/downArrow.svg';
import Minus from './assets/minus.svg';

const tasks = document.querySelector('.tasks');
const modals = document.querySelectorAll('.modal-container');
const newDepModal = document.querySelector('.mod-contNewDep');
const newTaskModal = document.querySelector('.mod-contNewTask');
const colorMapModal = document.querySelector('.mod-contColorMap');
const addDep = document.querySelector('.addDep');
const colorMap = document.querySelector('.colorMap')
const warning = document.querySelector('.warning');
const categories = document.querySelectorAll('.category');
const DEPARTMENTS = [
    new Department('General')
];
let plusClicked = DEPARTMENTS[0];

const formDep = document.querySelector('.formDep');
const formTask = document.querySelector('.formTask');

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
    const loadTasks = (DOMdepCont, dep) => {
        const toDoCont = document.createElement('div');
        toDoCont.classList = 'toDoCont';
        dep.toDos.forEach(toDo => {
            const todo = document.createElement('div');
            const title = document.createElement('span');
            title.classList = 'toDoTitle';
            title.textContent = toDo.title;
            const done = document.createElement('img');
            todo.append(title, done);

            toDoCont.append(todo);
        })
        setTimeout(DOMdepCont.append(toDoCont), 0);
    }
    const updateDepartments = () => {
        // ADD ICONS
        tasks.textContent = '';
        DEPARTMENTS.forEach(department => {
            const depCont = document.createElement('div');
            depCont.classList = 'depContainer';
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
            tasks.append(depCont);

            loadTasks(depCont, department);

            setTimeout(activateDepartmentButtons(dep), 0);
        })
    }

    const activatePlus = (department) => {
        department.querySelector('.depPlus').addEventListener('click', function() {
            openModal(newTaskModal);
            DEPARTMENTS.forEach(dep => {
                if (dep.title === department.querySelector('.depTitle').textContent)
                    plusClicked = dep;
            })
        })
    }
    const activateDepartmentButtons = (department) => {
        activatePlus(department);
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

    return {openModal, closeModal, changePriority, closePrioritySelect, updateDepartments, showTemporaryWarning, switchCategory, togglePrioritySelect};
})();

const Functionality = (function() {
    const addDepartment = (title) => {
        let stop = false;
        let dep;
        DEPARTMENTS.forEach(department => {
            if (department.title === title) {
                DOM.showTemporaryWarning('There is already a department with this title.');
                stop = true;
            }
        })
        if (stop === true)
            return 0;
        dep = new Department(title);
        DEPARTMENTS.push(dep);
    }

    const addTask = (department, title, priority, description, notes, date) => {
        let stop = false;
        department.toDos.forEach(toDo => {
            if (toDo.title === title) {
                DOM.showTemporaryWarning('There already is such a task in this department!')
                stop = true;
            }
        })
        if (stop === true)
            return 0;
        let task = new ToDo(title, priority, description, notes, date);
        department.toDos.push(task);
        console.log(DEPARTMENTS);
    }

    return {addDepartment, addTask};
})();

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
    const title = formTask.querySelector('#taskTitle').value;
    const priority = formTask.querySelector('.default_option').querySelector('.priority').textContent;
    const description = formTask.querySelector('#desc').textContent;
    const notes = formTask.querySelector('#notes').textContent;
    const dateValue = formTask.querySelector('#date').value;
    let date = new Date(dateValue);
    date = `${date.getHours()}:${date.getMinutes()<10 ? `0${date.getMinutes()}` : date.getMinutes()} ${date.getDay()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    Functionality.addTask(plusClicked, title, priority, description, notes, date);
    e.preventDefault();
    setTimeout(function() {
        DOM.updateDepartments();
        DOM.closeModal(newTaskModal);
    }, 0)
})

categories.forEach(category => {
    category.addEventListener('click', function() {
        DOM.switchCategory(category);
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