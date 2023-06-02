import './styles.css';

const modals = document.querySelectorAll('.modal-container');
const newDepModal = document.querySelector('.mod-contNewDep');
const newTaskModal = document.querySelector('.mod-contNewTask');
const colorMapModal = document.querySelector('.mod-contColorMap');
const addDep = document.querySelector('.addDep');
const colorMap = document.querySelector('.colorMap')

const DOM = {
    openModal(modal) {
        modal.style.display = 'flex';
    },
    closeModal(modal) {
        modal.style.display = 'none';
    }
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