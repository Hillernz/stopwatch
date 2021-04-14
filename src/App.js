import './App.css';
import DisplayComponent from './Components/DisplayComponent';
import React, { useState, useEffect, useRef } from 'react';
import { interval, NEVER, merge, fromEvent} from 'rxjs';
import { startWith, switchMap, tap, mapTo, scan, takeUntil, debounceTime, map, filter, buffer } from 'rxjs/operators'


function App() {
  const [stopwatch, setStopwatch] = useState({time: 0, count: false});

  const startBtn = useRef(null);
  const stopBtn = useRef(null);
  const resetBtn = useRef(null);
  const waitBtn = useRef(null);

  useEffect(() => {
    const fromClick = ref => fromEvent(ref.current, 'click');
    const observableClickHandler = (ref, obj) => fromClick(ref).pipe(mapTo(obj));

    const events$ = merge(
      observableClickHandler(startBtn, {count: true}),
      observableClickHandler(stopBtn, {count: false, time: 0}),
      observableClickHandler(resetBtn, {time: 0}),
    );
    const stopWatch$ = events$.pipe(
        startWith({
            count: false,
            time: 0
        }),
        scan((state, curr) => ({ ...state, ...curr }), {}),
        tap((state) => setStopwatch({time: state.time})),
        switchMap((state) =>
            state.count ?
                interval(1000).pipe(
                    tap(() => (state.time++)),
                    tap(() => setStopwatch({time: state.time, count: state.count})),
                    takeUntil(fromEvent(waitBtn.current, 'click').pipe(
                        buffer(
                            fromEvent(waitBtn.current, 'click').pipe(debounceTime(300))
                        ),
                        map(list => list.length),
                        filter(x => x === 2)
                    ))
                    )
                : NEVER
        )
    );

    stopWatch$.subscribe();

  }, [])

  

  return (
    <div className="main-section">
      <div className="clock-holder">
        <div className="stopwatch">
          <DisplayComponent time ={stopwatch.time}/>
          <button ref={startBtn} className="stopwatch-btn stopwatch-btn-red"
          >Start</button>
          <button ref={stopBtn} className="stopwatch-btn stopwatch-btn-red"
          >Stop</button>
          <button ref={resetBtn} className="stopwatch-btn stopwatch-btn-yel"
                >Reset</button>
          <button ref={waitBtn} className="stopwatch-btn stopwatch-btn-gre"
                >Wait</button>
        </div>
      </div>
    </div>
  );
}

export default App;
