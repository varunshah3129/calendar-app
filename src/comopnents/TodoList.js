import React from 'react';
import TodoInput from './TodoInput';
import '../css/TodoList.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faPen, faTimes} from '@fortawesome/free-solid-svg-icons';
import closeImage from '../images/close-popup.svg'

function TodoList(props) {
    const [isEditModalOpen, setEditModalOpen] = React.useState(false);
    const [currentEditIndex, setCurrentEditIndex] = React.useState(null);
    const [displayCount, setDisplayCount] = React.useState(5);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [toBeDeletedIndex, setToBeDeletedIndex] = React.useState(null);
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);

    const openDeleteConfirm = (index) => {
        setToBeDeletedIndex(index);
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setToBeDeletedIndex(null);
    };

    const confirmDelete = () => {
        handleDelete(toBeDeletedIndex);
        closeDeleteConfirm();
    };

    const handleDelete = (index) => {
        const newTasks = [...props.tasks];
        newTasks.splice(index, 1);
        props.setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setIsPopupVisible(true);
    };

    const loadMoreTasks = () => {
        setDisplayCount(displayCount + 5);  // Loads 5 more tasks on each click
    };

    const handleEdit = (index) => {
        setCurrentEditIndex(index);
        setEditModalOpen(true);
    };

    const handleEditSave = (editedTask) => {
        const newTasks = [...props.tasks];
        newTasks[currentEditIndex] = editedTask;
        props.setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setEditModalOpen(false);
    };

    const toggleComplete = (index) => {
        const newTasks = [...props.tasks];
        newTasks[index].isCompleted = !newTasks[index].isCompleted;
        props.setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const isDueToday = (taskDate) => {
        const today = new Date();
        const task = new Date(taskDate + "T00:00:00Z"); // Set the task time to midnight and specify it's in UTC
        return (today.getUTCDate() === task.getUTCDate()) &&
            (today.getUTCMonth() === task.getUTCMonth()) &&
            (today.getUTCFullYear() === task.getUTCFullYear());
    };

    // Sorting logic as provided
    const sortedTasks = props.tasks.sort((a, b) => {
        const aDateObj = new Date(a.date + "T00:00:00Z");
        const bDateObj = new Date(b.date + "T00:00:00Z");

        const currentDate = new Date();

        // Incomplete tasks due today.
        if (!a.isCompleted && isDueToday(a.date) && (b.isCompleted || !isDueToday(b.date))) return -1;
        if (!b.isCompleted && isDueToday(b.date) && (a.isCompleted || !isDueToday(a.date))) return 1;

        // Incomplete tasks (future).
        if (!a.isCompleted && aDateObj > currentDate && (b.isCompleted || bDateObj <= currentDate)) return -1;
        if (!b.isCompleted && bDateObj > currentDate && (a.isCompleted || aDateObj <= currentDate)) return 1;

        // Incomplete tasks (past).
        if (!a.isCompleted && aDateObj < currentDate && b.isCompleted) return -1;
        if (!b.isCompleted && bDateObj < currentDate && a.isCompleted) return 1;

        // Completed tasks.
        if (a.isCompleted && !b.isCompleted) return 1;
        if (!a.isCompleted && b.isCompleted) return -1;

        // If still not sorted, then sort by date and time for remaining tasks.
        return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
    });

    return (
        <div className="todo-container">
            <h2 className="app-title">My Tasks</h2>
            <div className="todo-list-header">
                <span className="todo-date-header">Date</span>
                <span className="todo-date-header">Time</span>
                <span className="todo-category-header">Category</span>
                <span className="todo-text-header">Task</span>
                <span className="todo-actions-header">Actions</span>
            </div>

            {
                sortedTasks
                    .slice(0, displayCount)
                    .map((task, index) => {
                        console.log(`Task date: ${task.date}, Is Due Today: ${isDueToday(task.date)}`); // for debugging
                        return (
                            <div key={index}
                                 className={`todo-block ${task.isCompleted ? "completed" : ""} ${isDueToday(task.date) ? "due-today" : ""}`}>
                                {
                                    task.isCompleted &&
                                    <span className="completed-badge">Completed</span>
                                }
                                <span className="todo-date">{isDueToday(task.date) ? "Today" : task.date}</span>
                                <span className="todo-time">{task.time}</span>
                                <span className="todo-category">{task.category}</span>
                                <span className="todo-text">{task.todo}</span>
                                <div className="todo-actions">
                                    <button className="todo-action" onClick={() => toggleComplete(index)}>
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                    <button className="todo-action" onClick={() => handleEdit(index)}>
                                        <FontAwesomeIcon icon={faPen}/>
                                    </button>
                                    <button className="todo-action" onClick={() => openDeleteConfirm(index)}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                </div>
                            </div>
                        );
                    })
            }

            {props.tasks.length === 0 &&
                <div className="no-tasks">
                    No tasks available.
                </div>
            }

            {displayCount < props.tasks.length &&
                <button className="load-more-btn" onClick={loadMoreTasks}>
                    Load More
                </button>
            }

            {isEditModalOpen &&
                <div className="edit-modal">
                    <TodoInput
                        editTask={props.tasks[currentEditIndex]}
                        onSave={handleEditSave}
                        onCancel={() => setEditModalOpen(false)}
                    />
                </div>
            }
            {showDeleteConfirm &&
                <div>
                    <div className="overlay"></div>
                    <div className="delete-confirm-popup">
                        <span className="close-popup" onClick={closeDeleteConfirm}><img src={closeImage}
                                                                                        alt="Close"/></span>
                        <p>Are you sure? Deleting a task cannot be undone.</p>
                        <button className='delete_task' onClick={confirmDelete}>Delete it!</button>
                        <button className='cancel' onClick={closeDeleteConfirm}>Nope, go back</button>
                    </div>
                </div>
            }

            {isPopupVisible &&
                <div>
                    <div className="overlay"></div>
                    <div className="task-deleted-popup">
                        <span className="close-popup" onClick={() => setIsPopupVisible(false)}><img src={closeImage}
                                                                                                    alt="Close"/></span>
                        Task is deleted!
                    </div>
                </div>
            }
        </div>
    );
}

export default TodoList;
