import React, { useState } from "react";
import { Howl } from "howler";
import { Scrollbars } from "react-custom-scrollbars";

export default function Player(props) {
  let index = 0;
  let blocksExperimental = props.allBlocks;
  let blocksNodes = [];
  let key = 0;
  let blockInMotion = null;
  const [isPlaying, setIsPlaying] = useState(null);
  const [animation, setAnimation] = useState(null);
  const [currentDrumset, setCurrentDrumset] = useState("drumset1");
  const [speed, setSpeed] = useState(100);
  let animationDuration = 10 / speed;

  const renderSoundBlocks = () => {
    //display all soundblocks accordint to state value
    blocksNodes = blocksExperimental.map((block) => {
      key++;
      return (
        <div
          className={block.isInEditMode ? "block edit-mode" : "block"}
          key={key}
          listid={props.allBlocks.indexOf(block)}
          onClick={(e) => props.onBlockClickToggleEditMode(e)}
        >
          <div className="block-number random-class">
            <p>{props.allBlocks.indexOf(block) + 1}</p>
          </div>
          <div
            className={block.isTrackActive[0] ? "crash" : "crash empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[1] ? "ride" : "ride empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[2] ? "hihat" : "hihat empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[3] ? "snare" : "snare empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[4] ? "tom1" : "tom1 empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[5] ? "tom2" : "tom2 empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[6] ? "floor-tom" : "floor-tom empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
          <div
            className={block.isTrackActive[7] ? "kick" : "kick empty"}
            onClick={(e) => props.handleSingleTileClick(e)}
          ></div>
        </div>
      );
    });
  };

  const LoopOverEachSound = () => {
    // //loop over each block, and over each sound and check if should play
    const drumset = document.querySelector(".drumset");
    const allTracksInsideBlock = blocksNodes[index].props.children;
    allTracksInsideBlock.forEach((children) => {
      const soundValue = children.props.className.split(" ");
      if (soundValue.length === 1) {
        //selectors
        const sound = new Howl({
          src: [require(`../drumsets/${currentDrumset}/${soundValue[0]}.wav`)],
        });
        const drumPadSelector = drumset.querySelector(`.${soundValue[0]}`);
        //actions
        sound.play();
        //animate drumPads
        //disable animation on mobile devices
        if (window.innerWidth > 640) {
          drumPadSelector.style.animation = `drumPadHighlight ${animationDuration}s alternate ease-in-out 2`;
          drumPadSelector.addEventListener("animationend", function () {
            this.style.animation = "";
          });
        }
      }
    });
    if (index < blocksExperimental.length - 1) {
      index++;
      //return to the first block after screening throught the last one
    } else index = 0;
  };

  const Start = (e) => {
    //check if speed value is not crazy, like 0 or 1 000 000
    if (speed < 40) {
      setSpeed(40);
    } else if (speed > 300) {
      setSpeed(300);
    } else {
      if (!isPlaying) {
        props.toggleIsPlaying(true);

        const playbackSpeed = (30 / speed) * 1000;

        //animateblocksmovement
        blockInMotion = document.querySelector(".motion");
        //75 because thats the hardcoded value of a single block
        const transformValue = blocksExperimental.length * 75;
        setAnimation(
          blockInMotion.animate(
            [
              {
                transform: "translateX(0px)",
              },
              {
                transform: `translate(-${transformValue}px)`,
              },
            ],
            {
              duration: playbackSpeed * blocksExperimental.length,
              iterations: Infinity,
            }
          )
        );
        setIsPlaying(
          setInterval(() => {
            LoopOverEachSound();
          }, playbackSpeed)
        );
      }
    }
  };

  const Pause = (e) => {
    index = 0;
    clearInterval(isPlaying);
    setIsPlaying(null);

    //remove animation
    animation.cancel();
    props.toggleIsPlaying(false);
  };
  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
    animationDuration = 10 / speed;
  };

  renderSoundBlocks();
  return (
    <div className="player-container">
      <div className="action-menu">
        <button className="btn play" onClick={(e) => Start(e)}>
          <i className="fas fa-play"></i>
        </button>
        <button className="btn pause" onClick={(e) => Pause(e)}>
          <i className="fas fa-pause"></i>
        </button>
        <div className="add-rm-section">
          <button className="btn add" onClick={(e) => props.addNewBlock(e)}>
            <i className="fas fa-plus"></i>
          </button>
          <button
            className="btn remove"
            onClick={(e) => props.removeLastBlock(e)}
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
        <button className="btn clear" onClick={(e) => props.clearPlayer()}>
          <i className="fas fa-eraser"></i>
        </button>
      </div>
      <div className="info-area">
        <p className="notation">{props.allBlocks.length}</p>
        <div className="tempo">
          <p className="tempo-header">Tempo</p>
          <input
            type="number"
            className="tempo-input"
            value={speed}
            onChange={(e) => handleSpeedChange(e)}
          ></input>
          <p className="tempo-units">BPM</p>
        </div>
        <div className="drum-select">
          <p className="drum-select-title">Drumset</p>
          <select
            id="drum-select"
            className="drum-select"
            onChange={(e) => {
              setCurrentDrumset(e.target.value);
            }}
          >
            <option value="drumset1">Acoustic 1</option>
            <option value="drumset2">Acoustic 2</option>
            <option value="drumset3">Vinyl</option>
            <option value="drumset4">Electro</option>
            <option value="drumset5">Electro2</option>
          </select>
        </div>
      </div>
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <div className="player">
          <div className="block-info">
            <div className="block-number random-class" style={{ opacity: 0 }}>
              0
            </div>
            <div className="crash"></div>
            <div className="ride"></div>
            <div className="hihat"></div>
            <div className="snare"></div>
            <div className="tom1"></div>
            <div className="tom2"></div>
            <div className="floor-tom"></div>
            <div className="kick"></div>
          </div>
          <div className="player motion">
            {blocksNodes}
            {isPlaying ? blocksNodes : null}
          </div>
        </div>
      </Scrollbars>
    </div>
  );
}
