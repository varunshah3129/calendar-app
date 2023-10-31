import React, { useState } from 'react';

function TodoInput(props) {
    const [todo, setTodo] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // You'll pass the data up to the App component or use context/redux to manage state
    };

    return (
        <div className="todo-input">
            <span>To-do: </span>
            <input type="text" placeholder="Enter new to-do" value={todo} onChange={e => setTodo(e.target.value)} />
            <span>Category: </span>
            <input type="text" placeholder="Enter category" value={category} onChange={e => setCategory(e.target.value)} list="categoryList" />
            <datalist id="categoryList">
                <option value="Manhã"></option>
                <option value="Tarde"></option>
                <option value="Noite"></option>
                <option value="Dia"></option>
            </datalist>
            <span>Date: </span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <span>Time: </span>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            <button onClick={handleSubmit}>Add</button>
        </div>
    );
}

export default TodoInput;
