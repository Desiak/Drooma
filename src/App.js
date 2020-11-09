import React, { Component } from "react";
import "./css/style.css";
import Player from "./components/player";
import Drumset from "./components/drumset";

import StoreProvider from "./components/StoreProvider";

class App extends Component {
  render() {
    return (
      <StoreProvider>
        <div className="main">
          <Player></Player>
          <Drumset></Drumset>
        </div>
      </StoreProvider>
    );
  }
}
export default App;
