import DownArrow from './assets/downArrow.svg';
import UpArrow from './assets/upArrow.svg';

export function toggleShowTasks(department) {
    console.log(department.querySelector('.toDoCont'));
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