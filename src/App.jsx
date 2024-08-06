import { useEffect, useState, useRef } from "react";
import "./App.css";
import styled from "styled-components";
import { Header, GameBoard } from "./components";
import { BEST_SCORE_KEY } from "./constants";
import GlobalStyle from "./styles/GlobalStyle";
import useApi from "./hooks/useApi";

function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [reset, setReset] = useState(false);
  const [apiFn] = useApi();
  const [updateFn] = useApi();
  const searchParams = new URLSearchParams(window.location.search);
  const gameId = searchParams.get("id");
  const ref = useRef(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const updateScore = async () => {
    const { response, error } = await updateFn({
      url: "/games/" + gameId,
      options: {
        method: "PUT",
        body: {
          gameInfo: { score, bestScore, earnedPoints },
        },
      },
    });

    if (error) {
      return;
    }
    console.log(response);
  };

  console.log({ earnedPoints });

  const getGameInfo = async () => {
    const { response, error } = await apiFn({
      url: "/games/" + gameId,
      options: {
        method: "GET",
      },
    });

    if (error) {
      return;
    }
    const gameInfo = response?.result?.gameInfo;
    setBestScore(gameInfo?.bestScore ? gameInfo?.bestScore : 0);
    setScore(gameInfo?.score ? gameInfo?.score : 0);
    console.log(response, response?.result?.score);
  };

  useEffect(() => {
    getGameInfo();
  }, []);

  useEffect(() => {
    if (ref.current) {
      if (bestScore < score) {
        setBestScore(score);
        localStorage.setItem(BEST_SCORE_KEY, score);
      }
      updateScore();
    }
    console.log({ score });
    ref.current = "render";
  }, [score]);

  return (
    <div className='App'>
      <GlobalStyle />
      <Header
        score={score}
        bestScore={bestScore}
        reset={reset}
        setReset={setReset}
      />
      <Main>
        <GameBoard
          score={score}
          setScore={setScore}
          setBestScore={setBestScore}
          reset={reset}
          setReset={setReset}
          setEarnedPoints={setEarnedPoints}
        ></GameBoard>
      </Main>
    </div>
  );
}

export default App;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;
