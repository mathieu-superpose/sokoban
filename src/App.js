import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { startGame } from "./game";
import './App.css';

function App() {
  const domRef = useRef(null);

  useEffect(() => {
      const pixiApp = new PIXI.Application({ width: 540, height: 540 });
      domRef.current?.appendChild(pixiApp.view);
      startGame(pixiApp);
  }, []);

  return (
    <div className="App">
      <h1>Sokoban</h1>
      <div ref={domRef} />
    </div>
  );
}

export default App;
