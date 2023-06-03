import './styles.css';
import {Department, ToDo} from './obj';
import Plus from './assets/plus.svg';

const tasks = document.querySelector('.tasks');
const modals = document.querySelectorAll('.modal-container');
const newDepModal = document.querySelector('.mod-contNewDep');
const newTaskModal = document.querySelector('.mod-contNewTask');
const colorMapModal = document.querySelector('.mod-contColorMap');
const addDep = document.querySelector('.addDep');
const colorMap = document.querySelector('.colorMap')
const warning = document.querySelector('.warning');

const DEPARTMENTS = [];

const formDep = document.querySelector('.formDep');

const DOM = (function() {
    const openModal = (modal) => {
        modal.style.display = 'flex';
    }
    const closeModal = (modal) => {
        modal.style.display = 'none';
    }
    const showTemporaryWarning = (message) => {
        warning.textContent = message;
        warning.style.display = 'block';
        setTimeout(function() {
            warning.textContent = '';
            warning.style.display = 'none';
        }, 3000);
    }
    const updateDepartments = () => {
        // ADD ICONS
        DEPARTMENTS.forEach(department => {
            const dep = document.createElement('div');
            dep.classList = `department ${department.title}Dep`;
            const plus = document.createElement('span');
            plus.classList = `plus`;
            const title = document.createElement('span');
            title.textContent = department.title;
            title.classList = 'depTitle';
            const expand = document.createElement('span');
            expand.classList = `depExpand`;
            const del = document.createElement('span');
            del.classList = `depDelete`;

            plus.style.background = `url(${Plus}) no-repeat 0 0`

            dep.append(plus, title, expand, del);

            tasks.append(dep);

            
        })
    }
    return {openModal, closeModal, updateDepartments, showTemporaryWarning};
})();

const Functionality = (function() {
    const addDepartment = (title) => {
        let stop = false;
        DEPARTMENTS.forEach(department => {
            if (department.title === title)
                DOM.showTemporaryWarning('There is already a department with this title.');
                stop = true;
        })
        if (stop === false) {
            const dep = new Department(title);
            DEPARTMENTS.push(dep);
        }
    }
    return {addDepartment};
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
    DOM.updateDepartments();
    e.preventDefault();
})

