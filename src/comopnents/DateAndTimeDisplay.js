import React, { useEffect, useState } from 'react';
import '../css/DateAndTimeDisplay.css';

const DateAndTimeDisplay = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    return (
        <div className="container">
            <div className="display-date">
                <span id="day">{dayWeek[time.getDay()]}</span>
                <span>&nbsp;</span>
                <span id="daynum">{time.getDate()}</span>
                <span>&nbsp;</span>
                <span id="month">{months[time.getMonth()]}</span>
                <span>&nbsp;</span>
                <span id="year">{time.getFullYear()}</span>
            </div>
            <div className="display-time">
                {time.toLocaleTimeString("en-US", { hour12: false })}
            </div>
        </div>
    );
}

export default DateAndTimeDisplay;
