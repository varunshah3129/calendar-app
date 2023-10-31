import React, { useState, useEffect } from 'react';
import TodoInput from './comopnents/TodoInput';
import TodoList from './comopnents/TodoList';
import Calendar from "./comopnents/Calendar";
import DateAndTimeDisplay from "./comopnents/DateAndTimeDisplay";
function App() {
    const [inputValue, setInputValue] = useState('');
    const [tasks, setTasks] = useState([]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const addTask = (newTask) => {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    return (
        <div className="todo-list-container">
            <DateAndTimeDisplay />
            <h1 className='app-title'>My ToDo</h1>
            <TodoInput
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onAddTask={addTask}
            />
            <div className="flex-row-container">
                <TodoList tasks={tasks} setTasks={setTasks} />
                <Calendar tasks={tasks} />
            </div>
        </div>
    );
}

export default App;
