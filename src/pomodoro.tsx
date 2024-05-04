import { useState, useEffect, useRef } from "react";
interface AppProps {
  restTime: number;
  sessionTime: number;
  repeatCount: number;
}
export default function App(props: AppProps) {
  const restTime: number = props.restTime * 60;
  const workTime: number = props.sessionTime * 60;
  const repeats: number = props.repeatCount * 2;
  const totalTime = (props.sessionTime + props.restTime) * props.repeatCount;
  const [repeatsDone, setRepeatsDone] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<number>(workTime);
  const [working, setWorking] = useState<boolean>(true);
  const Paused = useRef<boolean>(false);
  const pauseTimeinSeconds = useRef<number>(0);
  const resumeTimeinSeconds = useRef<number>(0);
  const totalPauseTimeinSeconds = useRef<number>(0);
  const modifier = useRef<number>(1);
  const [loaded, setLoaded] = useState(true);
  if (localStorage.getItem("timeInSeconds") !== "0" && loaded) {
    console.log(
      localStorage.getItem("repeatsDone"),
      localStorage.getItem("working"),
      localStorage.getItem("currentSession")
    );
    setRepeatsDone(Number(localStorage.getItem("repeatsDone")!));
    setWorking(localStorage.getItem("working") === "true");
    setCurrentSession(Number(localStorage.getItem("currentSession")!));
    setLoaded(false);
    console.log("Hey", currentSession, working, repeatsDone);
  }
  console.log(currentSession, working, repeatsDone);
  let date: Date;

  useEffect(() => {
    if (totalTime === 0) {
      return;
    }
    date = new Date();
    const timeInSeconds: number =
      date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    let minus = 0;
    if (localStorage.getItem("timeInSeconds")) {
      if (Number(localStorage.getItem("timeInSeconds")) < currentSession) {
        minus = Number(localStorage.getItem("timeInSeconds"));
      }
    }
    const interval = setInterval(() => {
      setTotalSeconds(() => {
        if (Paused.current) {
          const d: Date = new Date();
          resumeTimeinSeconds.current =
            d.getHours() * 3600 +
            d.getMinutes() * 60 +
            d.getSeconds() +
            modifier.current;
          totalPauseTimeinSeconds.current =
            resumeTimeinSeconds.current - pauseTimeinSeconds.current;
        }

        const newTime = new Date();
        const newSeconds: number =
          newTime.getHours() * 3600 +
          newTime.getMinutes() * 60 +
          newTime.getSeconds();
        const newTotalSeconds: number =
          newSeconds +
          minus -
          (timeInSeconds + totalPauseTimeinSeconds.current);
        if (newTotalSeconds >= currentSession) {
          if (working) {
            setCurrentSession(restTime);
            setWorking(false);
          } else {
            setCurrentSession(workTime);
            setWorking(true);
          }
          localStorage.setItem("working", String(working));
          localStorage.setItem("currentSession", String(currentSession));
        }
        return newTotalSeconds;
      });
    }, 1000);
    if (repeatsDone >= repeats) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [repeatsDone]);
  useEffect(() => {
    if (repeatsDone < repeats) {
      if (
        repeatsDone != Number(localStorage.getItem("repeatsDone")) &&
        working != Boolean(localStorage.getItem("working"))
      ) {
        setTotalSeconds(0);
        setRepeatsDone((prevRepeatsDone) => prevRepeatsDone + 1);
        localStorage.setItem("repeatsDone", String(repeatsDone + 1));
      }
    }
  }, [working, currentSession]);
  useEffect(() => {
    setTotalSeconds(0);
    setRepeatsDone(0);
    setWorking(true);
    setCurrentSession(workTime);
  }, [
    Number(props.sessionTime),
    Number(props.restTime),
    Number(props.repeatCount),
  ]);
  useEffect(() => {
    if (totalSeconds > 2) {
      localStorage.setItem("timeInSeconds", String(totalSeconds));
    }
  }, [totalSeconds]);
  function handlePause() {
    Paused.current = !Paused.current;
    if (Paused.current) {
      const d = new Date();
      pauseTimeinSeconds.current =
        d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    } else {
      modifier.current =
        resumeTimeinSeconds.current - pauseTimeinSeconds.current;
    }
  }
  const seconds: number = totalSeconds % 60;
  const minutes: number = Math.floor(totalSeconds / 60) % 60;
  const hours: number = Math.floor(totalSeconds / 3600);
  if (props.sessionTime === 0) {
    return <></>;
  } else if (totalTime > 480) {
    window.alert(
      "Total time should be less than 8 hours. We do not allow nor encourage overtime"
    );
    return <></>;
  }

  return (
    <div className="clockContainer">
      <h1 className="clock">
        {hours > 0 ? hours : ""}
        {hours > 0 ? ":" : ""}
        {minutes > 9 ? "" : "0"}
        {minutes}:{seconds > 9 ? "" : "0"}
        {seconds}
        <sup className="session">
          {working ? "Work Session" : "Rest Session"}
        </sup>
      </h1>
      <button type="button" onClick={() => handlePause()} className="pause">
        Paused
      </button>
    </div>
  );
}
