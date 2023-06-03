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
const categoryCont = document.querySelector('.categoires');
const categories = document.querySelectorAll('.category');

const DEPARTMENTS = [
    new Department('General')
];

const formDep = document.querySelector('.formDep');

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
            element.querySelectorAll('textarea').forEach(input => {
                input.textContent = '';
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
            console.log(cat.classList);
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

    const updateDepartments = () => {
        // ADD ICONS
        tasks.textContent = '';
        DEPARTMENTS.forEach(department => {
            const dep = document.createElement('div');
            dep.classList = `department ${department.title}Dep`;
            const plus = document.createElement('img');
            plus.classList = `depPlus icon`;
            const title = document.createElement('span');
            title.textContent = department.title;
            title.classList = 'depTitle';
            const expand = document.createElement('img');
            expand.classList = `depExpand icon`;
            const del = document.createElement('img');
            del.classList = `depDelete icon`;

            plus.src = Plus;
            expand.src = DownArrow;
            del.src = Minus;

            dep.append(plus, title, expand, del);

            tasks.append(dep)

        })
    }
    return {openModal, closeModal, updateDepartments, showTemporaryWarning, switchCategory};
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
    setTimeout(function() {
        DOM.updateDepartments();
        DOM.closeModal(newDepModal);
        console.log(DEPARTMENTS);
    }, 0)
    e.preventDefault();
})

categories.forEach(category => {
    category.addEventListener('click', function() {
        DOM.switchCategory(category);
    })
})

window.onload = function() {
    DOM.updateDepartments();
}