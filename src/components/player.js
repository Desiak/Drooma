import React, { useState, useEffect, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { StoreContext } from "./StoreProvider";
import { observer } from "mobx-react";

function Player() {
  const store = useContext(StoreContext);
  let index = 0;
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [beatScheduler, setBeatScheduler] = useState(null);
  const [blocksInMotion, setBlocksInMotion] = useState(null);
  const [tracks, setTracks] = useState({
    crash: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ride: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    tom1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tom2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    floor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    kick: [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
  });
  const [tracksLength, setTracksLength] = useState(tracks.crash.length);
  const drumset = document.querySelector(".drumset");

  //necessary in appending phantom track:
  const motionTrack = document.querySelector(".motion");
  const tracksContainer = document.querySelector(".tracks_container");

  let singleTrackName;
  let singleTrackValue;
  let indexOfCurrentTrack = 0;

  let indexOfCurrentNote = 0;
  let interval;
  let context;
  const allTracks = [];

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  store.context = context;

  let nextNoteTime = context.currentTime;
  const prepareAudioBuffers = async (drumset) => {
    let arrayOfBuffers = [];

    for (const track in tracks) {
      const url = require(`../assets/drumsets/${drumset}/${track}.mp3`);
      const buffer = await fetch(url)
        .then((response) => {
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
          return context.decodeAudioData(arrayBuffer);
        })
        .then((audioBuffer) => {
          return audioBuffer;
        });
      arrayOfBuffers.push(buffer);
    }

    store.arrayOfBuffers = arrayOfBuffers;
  };

  const modifyTracksLength = (shouldAdd) => {
    //disable modification when app is playing
    if (!isPlaying) {
      if (shouldAdd && tracksLength < 100) {
        const longerTracks = tracks;
        for (let track in longerTracks) {
          const longerTrack = [...longerTracks[track], 0];
          longerTracks[track] = longerTrack;
        }
        setTracks(longerTracks);
      } else if (!shouldAdd && tracksLength > 4) {
        const shorterTracks = tracks;
        for (let track in shorterTracks) {
          const indexOfRemovedBeat = shorterTracks[track].length - 1;
          const shorterTrack = shorterTracks[track].slice(
            0,
            indexOfRemovedBeat
          );
          shorterTracks[track] = shorterTrack;
        }
        setTracks(shorterTracks);
      }
    }
    setTracksLength(tracks.crash.length);
    renderSoundBlocks();
  };

  const renderSoundBlocks = () => {
    //display all soundblocks according to state value
    const container = document.querySelector(".motion");

    container.innerHTML = "";
    for (const track in tracks) {
      const singleTrack = document.createElement("div");
      singleTrack.classList.add("track", `${track}`);
      tracks[track].forEach((tile) => {
        let singleTile = document.createElement("div");
        singleTile.id = `${track}-${index}`;
        singleTile.classList.add("tile", `${track}`);
        if (!tile) {
          singleTile.classList.add(`empty`);
        }
        singleTile.addEventListener("click", (e) => {
          onClickToggleActiveState(e);
        });
        singleTrack.appendChild(singleTile);
        index++;

        if (index === tracks.crash.length) {
          allTracks.push(singleTrack);
          index = 0;
        }
      });
      container.appendChild(singleTrack);
    }
  };

  const onClickToggleActiveState = (e) => {
    if (!isPlaying) {
      const clickedTile = e.target.id.split("-");
      const indexOfClickedTile = clickedTile.pop();
      const trackOfClickedTile = clickedTile[0];

      for (const track in tracks) {
        if (track === trackOfClickedTile) {
          const updatedValue = tracks[track][indexOfClickedTile] ? 0 : 1;
          tracks[track][indexOfClickedTile] = updatedValue;
        }
      }
      renderSoundBlocks();
    }
  };
  const animateTrack = () => {
    blocksInMotion.style.animation = `tracksAnimation ${
      interval * tracksLength
    }s linear infinite`;
  };

  const sampleAudio = (indexOfCurrentTrack, time, singleTrackName) => {
    //selectors
    const drumPadSelector = drumset.querySelector(`.${singleTrackName}`);
    const source = context.createBufferSource();

    //play sound
    source.buffer = store.arrayOfBuffers[indexOfCurrentTrack];
    source.connect(context.destination);
    source.start(time);
    //animate corresponding drumpad, but only on larger devices:
    if (window.innerWidth > 720) {
      drumPadSelector.style.animation = `drumPadHighlight ${
        interval / 3
      }s alternate ease-in-out 2`;
      drumPadSelector.addEventListener("animationend", function () {
        this.style.animation = "";
      });
    }
  };

  function scheduler() {
    interval = 60 / (speed * 4);
    setBeatScheduler(
      setInterval(() => {
        //schedule sounds ahead of time...
        if (context.currentTime !== 0) {
          if ((indexOfCurrentNote === 0 && indexOfCurrentTrack) === 0) {
            animateTrack();
          }
          for (const track in tracks) {
            //1) loop over each tile (first, second etc.) of each track (snare,hihat etc.).
            //   so it starts with first tile of each track, then goes to next one, and next one and so on...

            singleTrackName = track;
            singleTrackValue = tracks[track];
            if (singleTrackValue[indexOfCurrentNote]) {
              //2) if tile is active then schedule sound relative to this tile in this track.
              // indexOfCurrentTrack to find proper buffer in arrayOfBuffers,
              // nextNoteTime+interval - it is when the sound should be played,
              // singleTrackName is used to animate corresponding drum pad.
              sampleAudio(
                indexOfCurrentTrack,
                nextNoteTime + interval,
                singleTrackName
              );
            }
            if (indexOfCurrentTrack === 7) {
              indexOfCurrentTrack = 0;
            } else indexOfCurrentTrack++;
          }
          nextNoteTime += interval;
          indexOfCurrentNote++;

          if (indexOfCurrentNote === singleTrackValue.length) {
            indexOfCurrentNote = 0;
          }
        }
      }, interval * 1000)
    );
  }

  const appendPhantomTrack = () => {
    //its job is to prevent player from being empty when it starts animating tracks
    //so it looks like tracks are in infinite loop.
    const phantomTrackContainer = document.createElement("div");
    phantomTrackContainer.classList.add("phantom");
    const phantomTrack = motionTrack.cloneNode(true);
    phantomTrack.classList.add("phantom");
    tracksContainer.appendChild(phantomTrack);
  };

  const Start = () => {
    context.resume().then(() => {
      //if app is not playing, then start playing
      if (!isPlaying) {
        // check if speed value is not insanely big or small...
        if (speed < 40) {
          setSpeed(40);
        } else if (speed > 200) {
          setSpeed(200);
        } else {
          scheduler();
          appendPhantomTrack();
          setIsPlaying(true);
        }
      }
    });
  };

  const Pause = () => {
    if (isPlaying) {
      index = 0;
      clearInterval(beatScheduler);
      setBeatScheduler(null);
      setIsPlaying(false);
      const phantomTrack = document.querySelector(".phantom");
      phantomTrack.remove();
      blocksInMotion.style.animation = "";
    }
  };

  const clearAllTracks = () => {
    if (!isPlaying) {
      let emptyTracks = tracks;
      for (let track in tracks) {
        emptyTracks[track] = tracks[track].map(() => {
          return 0;
        });
      }
      setTracks(emptyTracks);
      renderSoundBlocks();
    }
  };

  const handleDrumsetSelect = (e) => {
    store.currentDrumset = e.target.value;
    prepareAudioBuffers(e.target.value);
  };

  useEffect(() => {
    //render all tracks when app loads
    renderSoundBlocks();
    prepareAudioBuffers("drumset1");
    const animatedBlocks = document.querySelector(".tracks_container");
    setBlocksInMotion(animatedBlocks);
  }, []);

  return (
    <div className="player-container">
      <div className="action-menu">
        <button className="btn play" onClick={(e) => Start(e)}>
          <i className="fas fa-play"></i>
        </button>
        <button className="btn pause" onClick={(e) => Pause(e)}>
          <i className="fas fa-pause"></i>
        </button>
        <button className="btn clear" onClick={() => clearAllTracks()}>
          <i className="fas fa-eraser"></i>
        </button>
      </div>
      <div className="info-area">
        <div className="tracks-length">
          <div
            className="remove-beat"
            onClick={() => modifyTracksLength(false)}
          >
            <i className="fas fa-minus"></i>
          </div>
          <div className="length">
            <p className="length-value">{tracksLength}</p>

            <p>beats</p>
          </div>

          <div className="add-beat" onClick={() => modifyTracksLength(true)}>
            <i className="fas fa-plus"></i>
          </div>
        </div>
        <div className="tempo">
          <p className="tempo-header">Tempo</p>
          <input
            type="number"
            className="tempo-input"
            value={speed}
            onChange={(e) => {
              if (!isPlaying) {
                setSpeed(e.target.value);
              }
            }}
          ></input>
          <p className="tempo-units">BPM</p>
        </div>
        <div className="drum-select">
          <p className="drum-select-title">Drumset</p>
          <select
            id="drum-select"
            className="drum-select"
            onChange={(e) => {
              handleDrumsetSelect(e);
            }}
          >
            <option value="drumset1">Acoustic 1</option>
            <option value="drumset2">Acoustic 2</option>
            <option value="drumset3">Electro 1</option>
            <option value="drumset4">Electro 2</option>
          </select>
        </div>
      </div>
      <Scrollbars>
        <div className="player">
          <div className="block-info">
            <div className="crash"></div>
            <div className="ride"></div>
            <div className="hihat"></div>
            <div className="snare"></div>
            <div className="tom1"></div>
            <div className="tom2"></div>
            <div className="floor-tom"></div>
            <div className="kick"></div>
          </div>
          <div className="tracks_container">
            <div className="motion">
              {
                // here go all the tracks...
              }
            </div>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
}

export default observer(Player);
