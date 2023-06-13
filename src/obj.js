export class Department {
    constructor(title, todos=[]) {
        this.title = title;
        this.toDos = todos;
    }
    addToDo(toDo) {
        this.toDos.push(toDo);
    }
}

export class ToDo {
    constructor(title, priority, description, notes, deadline) {
        this.title = title;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
        this.deadline = deadline;
        this.done = false;
    }
}