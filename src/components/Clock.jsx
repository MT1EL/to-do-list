import React, { useState, useEffect } from "react";

function Clock() {
  /* Clock States */
  const [time, setTime] = useState({ second: 0, minute: 0, hour: 0 });
  const [dayTime, setDayTime] = useState("");
  useEffect(() => {
    setInterval(() => {
      setClock();
    }, 1000);
  });
  /* setting Clock */
  const setClock = () => {
    const currentDate = new Date();
    let secondRatio = currentDate.getSeconds() / 60;

    let minuteRatio = (secondRatio + currentDate.getMinutes()) / 60;
    let hourRatio = (minuteRatio + currentDate.getHours()) / 12;

    setTime({ second: secondRatio, minute: minuteRatio, hour: hourRatio });
    if (hourRatio > 0.12 && hourRatio < 0.18) {
      setDayTime("afternoon");
    } else if (hourRatio > 0.6 && hourRatio < 0.12) {
      setDayTime("morning");
    } else {
      setDayTime("Evening");
    }
  };
  return (
    <div className="clock">
      <div
        className="hand hour"
        style={{ transform: `translate(-50%) rotate(${time.hour * 360}deg)` }}
      ></div>
      <div
        className="hand minute"
        style={{ transform: `translate(-50%) rotate(${time.minute * 360}deg)` }}
      ></div>
      <div
        className="hand second"
        style={{ transform: `translate(-50%) rotate(${time.second * 360}deg)` }}
      ></div>

      <div className="number number1">
        <div>1</div>
      </div>
      <div className="number number2">
        <div>2</div>
      </div>
      <div className="number number3">
        <div>3</div>
      </div>
      <div className="number number4">
        <div>4</div>
      </div>
      <div className="number number5">
        <div>5</div>
      </div>
      <div className="number number6">
        <div>6</div>
      </div>
      <div className="number number7">
        <div>7</div>
      </div>
      <div className="number number8">
        <div>8</div>
      </div>
      <div className="number number9">
        <div>9</div>
      </div>
      <div className="number number10">
        <div>10</div>
      </div>
      <div className="number number11">
        <div>11</div>
      </div>
      <div className="number number12">
        <div>12</div>
      </div>
    </div>
  );
}

export default Clock;
