import React, { useState, useEffect, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { StoreContext } from "./StoreProvider";
import { observer } from "mobx-react";

function Player() {
  const store = useContext(StoreContext);
  let index = 0;
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(80);
  const [beatScheduler, setBeatScheduler] = useState(null);
  const [blocksInMotion, setBlocksInMotion] = useState(null);
  const [tracksDOM, setTracksDOM] = useState([]);
  const [tracks, setTracks] = useState({
    crash: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    ride: [
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ],
    hihat: [
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
    ],
    snare: [
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
    ],
    tom1: [
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
    ],
    tom2: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    floor: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    kick: [
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
    ],
  });
  const [tracksLength, setTracksLength] = useState(tracks.crash.length);

  //necessary in appending phantom track:

  let singleTrackName;
  let singleTrackValue;
  let indexOfCurrentTrack = 0;

  let indexOfCurrentNote = 0;
  let interval;
  const context = store.context;
  let nextNoteTime = context.currentTime;

  //functions triggered in action menu:

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
    }
  };

  const handleDrumsetSelect = (e) => {
    store.currentDrumset = e.target.value;
    prepareAudioBuffers(e.target.value);
  };

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

  const animateTrack = () => {
    blocksInMotion.style.animation = `tracksAnimation ${
      interval * tracksLength
    }s linear infinite`;
  };

  const sampleAudio = (indexOfCurrentTrack, time, singleTrackName) => {
    //selectors
    const source = context.createBufferSource();

    //play sound
    source.buffer = store.arrayOfBuffers[indexOfCurrentTrack];
    source.connect(context.destination);
    source.start(time);

    //animate corresponding drumpad - only on larger devices:
    if (window.innerWidth > 720) {
      const drumset = document.querySelector(".drumset");

      const drumPadSelector = drumset.querySelector(`.${singleTrackName}`);

      drumPadSelector.style.animation = `drumPadHighlight ${
        interval / 3
      }s alternate ease-in-out 2`;
      drumPadSelector.addEventListener("animationend", function () {
        this.style.animation = "";
      });
    }
  };

  function scheduler() {
    //inny sposób na schedulling: po zagraniu dźwięku dodawanie go na koniec kolejki.
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
    const motionTrack = document.querySelector(".motion");
    const tracksContainer = document.querySelector(".tracks_container");

    const phantomTrackContainer = document.createElement("div");
    phantomTrackContainer.classList.add("phantom");
    const phantomTrack = motionTrack.cloneNode(true);
    phantomTrack.classList.add("phantom");
    tracksContainer.appendChild(phantomTrack);
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
    renderTracks();
  };

  //functions triggered in player:

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
      renderTracks();
    }
  };

  // functions triggered both in action menu and player:

  const renderTracks = () => {
    let arrayOfTracks = [];
    for (const track in tracks) {
      const currentTrack = (
        <div className={`track ${track}`}>
          {tracks[track].map((tile) => {
            index++;
            if (index === tracks.crash.length) {
              index = 0;
            }
            return (
              <div
                className={`tile ${track} ${tile ? null : "empty"}`}
                id={`${track}-${index - 1}`}
                onClick={(e) => onClickToggleActiveState(e)}
              ></div>
            );
          })}
        </div>
      );

      arrayOfTracks.push(currentTrack);
    }

    setTracksDOM(arrayOfTracks);
  };

  useEffect(() => {
    //render all tracks when app loads
    renderTracks();
    prepareAudioBuffers("drumset1");
    const animatedBlocks = document.querySelector(".tracks_container");
    setBlocksInMotion(animatedBlocks);
  }, []);

  return (
    <div className="player-container">
      <div className="action-menu">
        <button className="btn play" onClick={(e) => Start(e)}>
          <span className="fas fa-play"></span>
        </button>
        <button className="btn pause" onClick={(e) => Pause(e)}>
          <span className="fas fa-pause"></span>
        </button>
        <button className="btn clear" onClick={() => clearAllTracks()}>
          <span className="fas fa-eraser"></span>
        </button>
      </div>
      <div className="info-area">
        <div className="tracks-length">
          <div className="add-beat" onClick={() => modifyTracksLength(true)}>
            <span className="fas fa-plus"></span>
          </div>
          <div className="length">
            <p className="length-value">{tracksLength}</p>

            <p>beats</p>
          </div>

          <div
            className="remove-beat"
            onClick={() => modifyTracksLength(false)}
          >
            <span className="fas fa-minus"></span>
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
            <div className="motion">{tracksDOM}</div>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
}

export default observer(Player);
