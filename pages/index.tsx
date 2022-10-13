import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useRef, useState } from "react";
import styles from "../styles/Home.module.css";

const SIDES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const getRandom = () => {
  return SIDES[Math.floor(Math.random() * SIDES.length)];
};

const Home: NextPage = () => {
  const [dices, setDices] = useState(["⚀", "⚁", "⚂", "⚃", "⚄"]);
  const [selected, setSelected] = useState<number[]>([]);
  const [myInternal, setMyInternal] = useState<NodeJS.Timer>();

  const selectDices = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setDices(Array.from({ length: value }).map(getRandom));
  };

  const runRoll = () => {
    const roll = () => {
      if (selected.length === 0 || selected.length === dices.length) {
        setDices((prev) => prev.map(getRandom));
      } else {
        setDices((prev) =>
          prev.map((dice, index) => {
            if (!selected.includes(index)) return dice;
            return getRandom();
          })
        );
      }
    };

    const interval = setInterval(() => {
      roll();
    }, 50);
    setMyInternal(interval);

    setTimeout(() => {
      clearInterval(myInternal || interval);
      setMyInternal(undefined);
      setSelected([]);
    }, 500);
  };

  const toggleSelectedDice = (index: number) => {
    if (selected.includes(index)) {
      setSelected((prev) => prev.filter((v) => v !== index));
    } else {
      setSelected((prev) => [...prev, index]);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Roll dicer</title>
        <meta
          name="description"
          content="Roll dicer app to make rolling dices"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="header">
          <span>Кубиков:</span>
          <select onChange={selectDices} value={dices.length}>
            {Array.from({ length: 10 }).map((_, index) => (
              <option key={index}>{index + 1}</option>
            ))}
          </select>
          <button onClick={runRoll} disabled={Boolean(myInternal)}>
            Бросить
          </button>
        </div>
        <div className="dices">
          {dices.map((dice, index) => (
            <div
              onClick={() => toggleSelectedDice(index)}
              key={index}
              className={`dice ${selected.includes(index) && "selected"}`}
            >
              {dice}
            </div>
          ))}
        </div>
        {myInternal && (
          <p>
            Всего:{" "}
            {dices.reduce((acc, cur) => {
              return acc + SIDES.indexOf(cur) + 1;
            }, 0)}
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;
