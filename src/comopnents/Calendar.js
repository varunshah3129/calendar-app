import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import '../css/Calendar.css';
import taskIcon from '../images/icons-task.png';
import taskIconToday from '../images/icons-task-today.png';

function Calendar({ tasks: propTasks = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const [allTasks, setAllTasks] = useState({});

    useEffect(() => {
        const tasksToSet = propTasks.length ? propTasks : JSON.parse(localStorage.getItem("tasks")) || [];
        const taskObject = tasksToSet.reduce((acc, task) => {
            if (!acc[task.date]) {
                acc[task.date] = [];
            }
            acc[task.date].push(task);
            return acc;
        }, {});
        setAllTasks(taskObject);
    }, [propTasks]);

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const taskForDate = (day) => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return allTasks[formattedDate] || [];
    };

    const tasksContentForDate = (day) => {
        const tasks = taskForDate(day);
        if (!tasks.length) return null;

        const tasksTableRows = tasks.map(task => (
            <tr key={task.todo}>
                <td>{task.time}</td>
                <td>{task.todo}</td>
                <td>{task.category}</td>
            </tr>
        ));

        return (
            <table>
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Task</th>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>
                {tasksTableRows}
                </tbody>
            </table>
        );
    };

    const renderDays = () => {
        const totalDays = daysInMonth(currentDate);
        const firstDay = firstDayOfMonth(currentDate);
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        let days = [];

        for (let i = 1; i <= firstDay; i++) {
            days.push(<span key={`prev-${firstDay - i}`} className="empty-day disabled">{prevMonthLastDay - firstDay + i}</span>);
        }

        for (let i = 1; i <= totalDays; i++) {
            const taskId = `task-${i}`;
            const tasksContent = tasksContentForDate(i);
            const isSunday = (i - 1 + firstDay) % 7 === 0;
            const hasTasks = taskForDate(i).length;

            days.push(
                <span
                    key={i}
                    className={`day-cell ${hasTasks ? 'has-tasks' : ''} ${i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? 'today' : ''} ${isSunday ? 'sunday' : ''}`}
                    onClick={() => hasTasks && document.getElementById(taskId).classList.toggle('visible')}
                >
            {i}
                    {hasTasks ? (
                        <>
                            <span className="task-counter">{taskForDate(i).length}</span>
                            <img
                                src={i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? taskIconToday : taskIcon}
                                alt="task-icon"
                                className="task-icon"
                                id={taskId}
                            />

                            {tasksContent && <Tooltip anchorSelect={`#${taskId}`} content={tasksContent} />}
                        </>
                    ) : null}
        </span>
            );
        }

        let nextMonthDay = 1;
        while (days.length % 7 !== 0) {
            days.push(<span key={`next-${nextMonthDay}`} className="empty-day disabled">{nextMonthDay}</span>);
            nextMonthDay++;
        }

        return days;
    };

    return (
        <div className='calendar-main'>
            <h2 className="app-title">My Calendar</h2>
            <div className="calendar-container">
                <div className="calendar">
                    <div className="calendar-header">
                        <span className="arrow"
                              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}>&lt;</span>
                        {currentDate.toLocaleString('default', {month: 'long'})} {currentDate.getFullYear()}
                        <span className="arrow"
                              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}>&gt;</span>
                    </div>
                    <div className="week-days">
                        {daysOfWeek.map(day => <li key={day}>{day}</li>)}
                    </div>
                    <div className="weeks">
                        {renderDays()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;
