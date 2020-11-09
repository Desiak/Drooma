import React, { useContext } from "react";

import Snare from "../assets/snare.svg";
import Tom1 from "../assets/tom1.svg";
import Tom2 from "../assets/tom2.svg";
import FloorTom from "../assets/floor.svg";
import HihatTop from "../assets/hihat.svg";
import Crash from "../assets/crash.svg";
import Ride from "../assets/ride.svg";
import Kick from "../assets/kick.svg";

import { StoreContext } from "./StoreProvider";
import { observer } from "mobx-react";

function Drumset() {
  const store = useContext(StoreContext);

  const playSound = (index) => {
    const source = store.context.createBufferSource();
    source.buffer = store.arrayOfBuffers[index];
    source.connect(store.context.destination);
    source.start();
  };

  return (
    <div className="drumset">
      <div className="kick-pad" onClick={() => playSound(7)}>
        <img src={Kick} alt="" datakey="kick" className="kick"></img>
      </div>
      <div className="snare-pad" onClick={() => playSound(3)}>
        <img src={Snare} alt="" datakey="snare" className="snare"></img>
      </div>
      <div className="tom1-pad" onClick={() => playSound(4)}>
        <img src={Tom1} alt="" datakey="tom1" className="tom1"></img>
      </div>
      <div className="tom2-pad" onClick={() => playSound(5)}>
        <img src={Tom2} alt="" datakey="tom2" className="tom2"></img>
      </div>
      <div className="floor-tom-pad" onClick={() => playSound(6)}>
        <img src={FloorTom} alt="" datakey="floor" className="floor"></img>
      </div>
      <div className="crash-pad" onClick={() => playSound(0)}>
        <img src={Crash} alt="" datakey="crash" className="crash"></img>
      </div>
      <div className="ride-pad" onClick={() => playSound(1)}>
        <img src={Ride} alt="" datakey="ride" className="ride"></img>
      </div>

      <div className="hihat-pad" onClick={() => playSound(2)}>
        <img src={HihatTop} alt="" datakey="hihat" className="hihat"></img>
      </div>
    </div>
  );
}

export default observer(Drumset);
