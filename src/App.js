import React, { useRef, useState, useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import {
  RockGesture,
  PaperGesture,
  ScissorsGesture,
} from "./gestures/gestures";

import background from "./pics/round-frame-simple-template-background_1159-26660.jpeg";
import * as fp from "fingerpose";
import "./App.css";
import GameDashboard from "./components/gamecontrol/GameDashborad";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [robotScore, setRobotScore] = useState(0);
  const [emoji, setEmoji] = useState("None");

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net, 9);
    }, 50);
  };

  const detect = async (net, min) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      // Make Detections
      const hand = await net.estimateHands(video);

      const gestureStore = [RockGesture, PaperGesture, ScissorsGesture];
      if (hand.length > 0) {
        const GE = new fp.GestureEstimator(gestureStore);
        const gesture = await GE.estimate(hand[0].landmarks, min);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );

          const maxConfidence = gesture.gestures.reduce((p, c) => {
            return p.score > c.score ? p : c;
          });
          //console.log(maxConfidence.name);
          setEmoji(maxConfidence.name);
        } else {
          setEmoji("None");
        }
      }
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  const showScore = (player, robot) => {
    setPlayerScore(player);
    setRobotScore(robot);
  };

  return (
    <div
      style={{ backgroundImage: `url(${background})`, backgroundRepeat: true }}
    >
      <div className="container">
        <Webcam ref={webcamRef} className="item-video" />

        <section className="item-name">
          <p>{emoji}</p>
        </section>
        <div className="item-card-player">
          <GameDashboard
            playerGesture={emoji}
            onScore={showScore}
          ></GameDashboard>
        </div>
        <section className="playerscore">{playerScore}</section>
        <section className="robotscore">{robotScore}</section>
      </div>
    </div>
  );
}

export default App;
