import React, { Component } from "react";
import "./css/style.css";
import Player from "./components/player";
import Drumset from "./components/drumset";
import KeyboardEventHandler from "react-keyboard-event-handler";

class App extends Component {
  state = {
    blocks: [
      {
        isInEditMode: true,
        isTrackActive: [false, false, true, false, false, false, false, true],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, true, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, true],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, false, false, false, false, true],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, false, false, false, false, true],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, true, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, true, false, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, true, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, true, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, true],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, true],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, true, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, true, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, true, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, true, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, true, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, true, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, false, true],
      },
      {
        isInEditMode: true,
        isTrackActive: [false, false, false, true, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, true, false, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, true, false, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, true, false, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, true, false],
      },
      {
        isInEditMode: false,
        isTrackActive: [false, false, false, false, false, false, true, false],
      },
    ],
    interval: 100,
    isPlaying: false,
    loop: null,
    currentlyInEditMode: 0,
  };

  //modify sound track actually...
  handleDrumPadClick = (e) => {
    //prevent from editing while in playing mode
    if (!this.state.isPlaying) {
      //array of tracks
      const tracksAvaliable = [
        "crash",
        "ride",
        "hihat",
        "snare",
        "tom1",
        "tom2",
        "floor-tom",
        "kick",
      ];
      //selector of track related to clicked pad
      const indexOfModifiedTrack = tracksAvaliable.indexOf(e.target.className);

      const modifiedArrayOfBlocks = this.state.blocks.map((block) => {
        if (block.isInEditMode) {
          //toggle 'active' property of track related to clicked pad
          block.isTrackActive[indexOfModifiedTrack] = !block.isTrackActive[
            indexOfModifiedTrack
          ];
          return block;
        } else {
          return block;
        }
      });
      this.setState({
        blocks: modifiedArrayOfBlocks,
      });
    }
  };

  handleSingleTileClick = (e) => {
    const tracksAvaliable = [
      "crash",
      "ride",
      "hihat",
      "snare",
      "tom1",
      "tom2",
      "floor-tom",
      "kick",
    ];

    const indexOfModifiedTrack = tracksAvaliable.indexOf(e.target.classList[0]);

    if (!this.state.isPlaying) {
      if (e.target.parentElement.classList.contains("edit-mode")) {
        const modifiedArrayOfBlocks = this.state.blocks.map((block) => {
          if (block.isInEditMode) {
            block.isTrackActive[indexOfModifiedTrack] = !block.isTrackActive[
              indexOfModifiedTrack
            ];
            return block;
          } else {
            return block;
          }
        });
        this.setState({
          blocks: modifiedArrayOfBlocks,
        });
      }
    }
  };

  updateEditMode = (demandedIndex) => {
    const blocks = this.state.blocks;
    blocks.forEach((block, index) => {
      if (index !== demandedIndex) {
        block.isInEditMode = false;
      }
    });
    blocks[demandedIndex].isInEditMode = !blocks[demandedIndex].isInEditMode;
    this.setState({
      blocks: blocks,
      currentlyInEditMode: demandedIndex,
    });
  };

  onBlockClickToggleEditMode = (e) => {
    //if you click on a block, but outside of its children
    if (e.target.classList.contains("block")) {
      const indexOfBlock = parseInt(e.target.attributes.listid.value);
      this.updateEditMode(indexOfBlock);
    }
    //if you click on any tile (children of block)
    if (
      !e.target.parentElement.classList.contains("edit-mode") &&
      e.target.parentElement.classList.contains("block")
    ) {
      const indexOfParent = parseInt(
        e.target.parentElement.attributes.listid.value
      );
      this.updateEditMode(indexOfParent);
    }
  };

  speedChange = (e) => {
    this.setState({
      speed: e.target.value,
    });
  };

  toggleIsPlaying = (arg) => {
    this.setState({
      isPlaying: arg,
    });
  };

  clearPlayer = () => {
    this.setState({
      blocks: [],
    });
  };

  handleArrowsClick = (e) => {
    //navigate between blocks using arrows
    const indexOfCurrentBlock = this.state.currentlyInEditMode;
    if (e === "left") {
      if (indexOfCurrentBlock > 0) {
        const previousIndex = indexOfCurrentBlock - 1;
        this.updateEditMode(previousIndex);
      } else {
        this.updateEditMode(this.state.blocks.length - 1);
      }
    }
    if (e === "right") {
      if (indexOfCurrentBlock < this.state.blocks.length - 1) {
        const nextIndex = indexOfCurrentBlock + 1;
        this.updateEditMode(nextIndex);
      } else {
        this.updateEditMode(0);
      }
    }
  };

  addNewBlock = (e) => {
    const block = {
      isInEditMode: false,
      isTrackActive: [false, false, false, false, false, false, false, false],
    };
    const blocks = this.state.blocks;
    blocks.push(block);
    this.setState({
      blocks: blocks,
    });
  };

  removeLastBlock = (e) => {
    const newArray = this.state.blocks.slice(0, this.state.blocks.length - 1);
    this.setState({
      blocks: newArray,
    });
  };
  render() {
    return (
      <div className="App">
        <div className="main">
          <Player
            allBlocks={this.state.blocks}
            interval={this.state.interval}
            clearPlayer={this.clearPlayer}
            onBlockClickToggleEditMode={this.onBlockClickToggleEditMode}
            pause={this.pause}
            handleSingleTileClick={this.handleSingleTileClick}
            addNewBlock={this.addNewBlock}
            removeLastBlock={this.removeLastBlock}
            toggleIsPlaying={this.toggleIsPlaying}
            isPlaying={this.state.isPlaying}
          ></Player>
          <Drumset toggleSound={this.handleDrumPadClick}></Drumset>
        </div>
        <KeyboardEventHandler
          handleKeys={["left", "right"]}
          onKeyEvent={(e) => this.handleArrowsClick(e)}
        ></KeyboardEventHandler>
      </div>
    );
  }
}
export default App;
