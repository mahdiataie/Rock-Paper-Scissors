import "./Timer.css";

import React from "react";
import { useState, useEffect, useRef } from "react";


const Timer = (props) => {
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState(3);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(seconds);
    }
    if(total===0){
        props.onStop();
    }
  };

  const clearTimer = (e) => {
    setTimer(3);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 3);
    return deadline;
  };

  useEffect(() => {
    if (props.start) {
      clearTimer(getDeadTime());
    }
  }, [props.start]);

  return (
    <div className="timer">
      <h2 className="text">{timer}</h2>
    </div>
  );
};

export default Timer;
