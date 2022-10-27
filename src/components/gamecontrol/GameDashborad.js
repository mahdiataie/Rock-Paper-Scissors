import { useEffect, useState, useReducer } from "react";
import Timer from "./Timer";
import rockpic from "../../pics/rocks.png";
import scissorspic from "../../pics/scissorss.png";
import paperpic from "../../pics/papers.png";
import undefinedpic from "../../pics/undefineds.png";
import './GameDashboard.css'
const dummy = "rock";

const playerReducer = (state, action) => {
  if (action.type === "STATUS") {
    return { score: state.score, isWon: action.value, winner: state.winner };
  }
  if (action.type === "SCORE") {
    return { score: state.score + 1, isWon: state.isWon, winner: state.winner };
  }
  if (action.type === "WINNER") {
    return { score: state.score, isWon: state.isWon, winner: action.value };
  }
  if (action.type === "RESET") {
    return { score: 0, isWon: false, winner: false };
  }
  return { score: 0, isWon: false, winner: false };
};
const robotReducer = (state, action) => {
  if (action.type === "STATUS") {
    return {
      score: state.score,
      isWon: action.value,
      gesturefig: state.gesturefig,
      winner: state.winner,
    };
  }
  if (action.type === "SCORE") {
    return {
      score: state.score + 1,
      isWon: state.isWon,
      gesturefig: state.gesturefig,
      winner: state.winner,
    };
  }
  if (action.type === "WINNER") {
    return {
      score: state.score,
      isWon: state.isWon,
      gesturefig: state.gesturefig,
      winner: action.value,
    };
  }
  if (action.type === "FIGURE") {
    return { score: state.score, isWon: state.isWon, gesturefig: action.value };
  }
  if (action.type === "RESET") {
    return {
      score: 0,
      isWon: false,
      gesturefig: 'None',
      winner: false,
    }
  }
  return { score: 0, isWon: false, gesturefig: "None" };
};
const GameDashboard = (props) => {
  const [countStart, setCountstart] = useState(false);
  const [checkResult, setCheckResult] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isReset, setIsReset] = useState(false)

  const [playerState, dispatchPlayer] = useReducer(playerReducer, {
    score: 0,
    isWon: false,
    winner: false,
  });
  const [robotState, dispatchRobot] = useReducer(robotReducer, {
    score: 0,
    isWon: false,
    gesturefig: "None",
    winner: false,
  });

  const gesturePic = {
    rock: rockpic,
    paper: paperpic,
    scissors: scissorspic,
    None: undefinedpic,
  };
  const reStartGameHandler = () => {
    setCountstart(false);
    setIsDraw(false);
    dispatchPlayer({type:'RESET'});
    dispatchRobot({type:'RESET'});
    setCheckResult(false);
    setIsReset(false)
  }
  const countDownEndHandler = () => {
    setCountstart(false);
    setCheckResult(true);
  };
  const startCountdownHandler = () => {
    setCountstart(true);
    setIsDraw(false);
    dispatchPlayer({ type: "STATUS", value: false });
    dispatchRobot({ type: "STATUS", value: false });
    dispatchRobot({ type: "FIGURE", value: "None" });
    setCheckResult(false);
  };
  let robotClasses = "itemrobot";
  let playerClasses;
  if (!isDraw) {
    robotClasses = robotState.isWon ? "itemrobot winner" : "itemrobot";
    playerClasses = playerState.isWon ? "itemplayer winner" : "itemplayer";
  } else {
    robotClasses = "itemrobot draw";
    playerClasses = "itemplayer draw";
  }

  function getRandomGesture() {
    const gestures = ["rock", "paper", "scissors"];
    const randomNum = Math.floor(Math.random() * gestures.length);
    return gestures[randomNum];
  }

  const Result = (playerGesture, computerGesture) => {
    let statusText;
    let playerWins = false;
    let computerWins = false;

    if (playerGesture === computerGesture || playerGesture === "None") {
      // draw
      statusText = "It's a draw!";
      setIsDraw(true);
    } else {
      // check whinner
      if (playerGesture == "rock") {
        if (computerGesture == "scissors") {
          playerWins = true;
          statusText = "Rock beats scissors";
        } else {
          computerWins = true;
          statusText = "Paper beats rock";
        }
      } else if (playerGesture == "paper") {
        if (computerGesture == "rock") {
          playerWins = true;
          statusText = "Paper beats rock";
        } else {
          computerWins = true;
          statusText = "Scissors beat paper";
        }
      } else if (playerGesture == "scissors") {
        if (computerGesture == "paper") {
          playerWins = true;
          statusText = "Scissors beat paper";
        } else {
          computerWins = true;
          statusText = "Rock beats scissors";
        }
      }
    }

    if (playerWins) {
      dispatchPlayer({ type: "SCORE" });
      dispatchPlayer({ type: "STATUS", value: true });
      statusText += " - You win!";
    } else if (computerWins) {
      dispatchRobot({ type: "SCORE" });
      dispatchRobot({ type: "STATUS", value: true });
      statusText += " - The robot wins!";
    }

    console.log(statusText);
  };

  useEffect(() => {
    if (checkResult) {
      const RobotMove = getRandomGesture();
      const playerHand = props.playerGesture;
     // const playerHand = dummy;
      dispatchRobot({ type: "FIGURE", value: RobotMove });
      Result(playerHand, RobotMove);
    }
  }, [checkResult]);

  useEffect(() => {
    props.onScore(playerState.score, robotState.score);
    if (playerState.score === 5) {
      dispatchPlayer({ type: "WINNER", value: true });
      setIsReset(true);
    }
    if (robotState.score === 5) {
      dispatchRobot({ type: "WINNER", value: true });
      setIsReset(true);
    }
  }, [playerState.score, robotState.score]);

  return (
    <div className="control">
      <div className={playerClasses}>
        <span></span>
        <img
          src={gesturePic[props.playerGesture]}
          height="130"
          width="130"
          className="image"
        ></img>
      </div>
      <div className={robotClasses}>
        <span></span>
        <img
          src={gesturePic[robotState.gesturefig]}
          height="130"
          width="130"
          className="image"
        ></img>
      </div>
      <Timer
        className="countdown"
        start={countStart}
        onStop={countDownEndHandler}
      ></Timer>
      {!isReset && <button onClick={startCountdownHandler} className="button">
        START
      </button>}
      {isReset && <button onClick={reStartGameHandler} className="button">
        RE-START
      </button>}
    </div>
  );
};
export default GameDashboard;
