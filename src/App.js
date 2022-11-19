import React, { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [tiles, setTiles] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let msg = 'You move';

    if (isWinning(2, tiles)) {
      msg = 'You lost!';
      setFinished(true);
    } else if (isWinning(1, tiles)) {
      msg = 'You won!';
      setFinished(true);
    }
    if (tiles.indexOf(0) === -1) setFinished(true);
    setMessage(msg);
    setBoxColor(tiles);
  }, [tiles]);

  function restart() {
    setTiles([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setFinished(false);
    setBoxColor(tiles);
  }

  function setText(val) {
    if (val === 0) {
      return '?';
    }

    if (val !== 1) {
      return 'O';
    }

    return 'X';
  }

  function setValues(k) {
    if (finished || tiles[k] > 0) return;
    const tilesUpdated = [...tiles.slice(0, k), 1, ...tiles.slice(k + 1)];
    setTiles(tilesUpdated);
    if (isWinning(1, tilesUpdated)) return;
    callAi(tilesUpdated);
  }

  function setBoxColor(t) {
    t.forEach((v, k) => {
      const el = document.querySelector(`.item-${k}`);
      if (v === 1) {
        el.classList.add('box-player1');
      } else if (v === 2) {
        el.classList.add('box-player2');
      } else {
        el.classList.remove('box-player1', 'box-player2');
      }
    });
  }

  function callAi(t) {
    setTimeout(() => {
      let winning;
      let blocking;
      let normal;
      let future = [];

      for (let i = 0; i < t.length; i++) {
        const val = t[i];
        if (val > 0) continue;
        future = [
          ...t.slice(0, i),
          2,
          ...t.slice(i + 1),
        ];

        if (isWinning(2, future)) {
          winning = i;
        }

        future[i] = 1;

        if (isWinning(1, future)) {
          blocking = i;
        }
        normal = i;
      }

      let move;
      if (winning !== undefined) {
        move = winning;
      } else if (blocking !== undefined) {
        move = blocking;
      } else {
        move = normal;
      }

      // If got into for loop
      if (move !== undefined) {
        const tilesNew = [
          ...t.slice(0, move),
          2,
          ...t.slice(move + 1),
        ];
        setTiles(tilesNew);
      }
    }, 200);
  }

  function isWinning(who, tilesList) {
    return (
      (tilesList[0] === who && tilesList[1] === who && tilesList[2] === who) ||
      (tilesList[3] === who && tilesList[4] === who && tilesList[5] === who) ||
      (tilesList[6] === who && tilesList[7] === who && tilesList[8] === who) ||
      (tilesList[0] === who && tilesList[4] === who && tilesList[8] === who) ||
      (tilesList[2] === who && tilesList[4] === who && tilesList[6] === who) ||
      (tilesList[0] === who && tilesList[3] === who && tilesList[6] === who) ||
      (tilesList[1] === who && tilesList[4] === who && tilesList[7] === who) ||
      (tilesList[2] === who && tilesList[5] === who && tilesList[8] === who)
    );
  }

  return (
    <div className='container'>
      <div className="box">
        {tiles.map((v, k) => (
          <div className={`box-child item-${k}`} onClick={() => setValues(k)} key={k}>
            {setText(v)}
          </div>
        ))}
      </div>
      <div className='info'>
        <p>{message}</p>
        <button onClick={restart}>Restart</button>
      </div>
    </div>
  );
}
