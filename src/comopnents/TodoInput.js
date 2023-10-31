import React, { useState, useEffect } from 'react';
import '../css/TodoInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import closeImage from '../images/close.svg'
import Select from 'react-select';

function TodoInput({ onAddTask, editTask, onSave, onCancel }) {
    const [todo, setTodo] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const options = [  // react-select options format
        { value: 'Morning', label: 'Morning' },
        { value: 'Afternoon', label: 'Afternoon' },
        { value: 'Night', label: 'Night' },
        { value: 'Day', label: 'Day' }
    ];

    useEffect(() => {
        if (editTask) {
            setTodo(editTask.todo);
            setCategory(editTask.category);
            setDate(editTask.date);
            setTime(editTask.time);
            setIsPopupVisible(true);
        }
    }, [editTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (todo && category && date && time) {
            const newTask = { todo, category, date, time };
            if (editTask) {
                onSave(newTask);
            } else {
                onAddTask(newTask);
                setTodo('');
                setCategory('');
                setDate('');
                setTime('');
            }
            setIsPopupVisible(false);
        } else {
            alert("Please fill in all fields.");
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minWidth: '402px',
            minHeight: '62px',
            borderRadius: '5px',
            boxShadow: 'none',
            border: '1px solid #ced6e0',
            transition: 'all 0.3s ease-in-out',
            fontSize: '18px',
            padding: '5px 15px',
            background: 'none'
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 15px'
        }),
        input: (provided) => ({
            ...provided,
            fontSize: '18px',
            color: '#000'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#cf584d',
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : '#333',
            backgroundColor: state.isSelected ? '#cf584d' : 'white',
            '&:hover': {
                backgroundColor: '#e5e5e5'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#cf584d'
        }),
    };

    return (
        <div className="todo-wrapper">
            <button className="open-popup-btn" onClick={() => setIsPopupVisible(true)}>+</button>

            {isPopupVisible && (
                <div id="myModal" className="modal">
                    <div className="modal-content slideDown">
                        <div className="modal-header">
                    <span className="close" onClick={() => {
                        setIsPopupVisible(false);
                        if (onCancel) onCancel();
                    }}><img src={closeImage} alt="Close" /></span>
                            <h2 className="add-task-icon">
                                <FontAwesomeIcon icon={editTask ? faPen : faPlus} />
                                {editTask ? "Update Task" : "Add Task"}
                            </h2>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-row">
                                    <label>To-do:</label>
                                    <input className="form-input" type="text" placeholder="Enter new to-do" value={todo} onChange={e => setTodo(e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <label>Category:</label>
                                    <Select
                                        className=""
                                        options={options}
                                        value={options.find(option => option.value === category)}
                                        onChange={selectedOption => setCategory(selectedOption.value)}
                                        placeholder="Enter category"
                                        styles={customStyles}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Date:</label>
                                    <input className="form-input"type="date" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <label>Time:</label>
                                    <input className="form-input"type="time" value={time} onChange={e => setTime(e.target.value)} />
                                </div>
                                <div className="modal-footer">
                                    {/*<input className="form-input"type="submit" className="button good" value={editTask ? "Save" : "Add"} />*/}
                                    <button type="submit" className="button good">
                                        <FontAwesomeIcon icon={editTask ? faPen : faPlus} />
                                        <span>{editTask ? "Update" : "Add"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoInput;
