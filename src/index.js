import './styles.css';

const modals = document.querySelectorAll('.modal-container');
const newDepModal = document.querySelector('.mod-contNewDep');
const newTaskModal = document.querySelector('.mod-contNewTask');
const colorMapModal = document.querySelector('.mod-contColorMap');
const addDep = document.querySelector('.addDep');
const colorMap = document.querySelector('.colorMap')

const formDep = document.querySelector('.formDep');
const projects = [];
const DOM = (function() {
    const openModal = (modal) => {
        modal.style.display = 'flex';
    }
    const closeModal = (modal) => {
        modal.style.display = 'none';
    }
    return {openModal, closeModal};
})()
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
    const values = document.querySelector('#title2').value;
    console.log(values);
    e.preventDefault();
})