import { Component } from "react";
import { io } from "socket.io-client";
import F from "fortissimo";

import "./App.scss";

export default class App extends Component {
  columns = 30;
  rows = 20;
  state = {
    board: "?".repeat(this.columns * this.rows),
    color: F.randomChoice("abcdefghijklmnopqrstuv"),
    countdown: 0,
    ignoreCountdown: false,
  };
  mouseDown = false;

  componentDidMount() {
    this.socket = io
      .connect("/")
      .on("connect", function () {
        console.log("! Server connect");
      })
      .on("disconnect", function () {
        console.warn("! Server disconnect");
      })
      .on("didChange", board => {
        this.setState({ board });
      });

    fetch("/api/get")
      .then(res => res.text())
      .then(board => {
        this.setState({ board });
      })
      .catch(err => {
        throw err;
      });

    document.onmousedown = event => {
      if (event.button === 0) {
        this.mouseDown = true;
      }
    };
    document.onmouseup = event => {
      if (event.button === 0) {
        this.mouseDown = false;
      }
    };
  }

  clickTile(x, y) {
    if (this.state.countdown > 0) {
      return;
    }

    var index = x + y * this.rows;
    this.setState({
      board:
        this.state.board.slice(0, index) +
        this.state.color +
        this.state.board.slice(index + 1),
    });

    fetch(`/api/post?x=${x}&y=${y}&color=${this.state.color}`).catch(err => {
      throw err;
    });

    if (!this.state.ignoreCountdown) {
      this.startCountdown();
    }
  }

  startCountdown() {
    if (this.state.hack) {
      this.setState({ countdown: 0 });
      return;
    }
    this.setState({ countdown: 5 }, async () => {
      while (this.state.countdown > 0) {
        await F.sleep(1000);
        this.setState({ countdown: this.state.countdown - 1 });
      }
    });
  }

  hack() {
    this.setState({ ignoreCountdown: true, countdown: 0 });
  }

  render() {
    return (
      <div className="App">
        <h1>Place</h1>

        <div className={"board" + (this.state.countdown > 0 ? " no" : "")}>
          {F.splitAt(this.state.board, this.rows).map((row, y) => {
            return (
              <section key={y} className="row">
                {row.split("").map((color, x) => {
                  return (
                    <article
                      key={x}
                      className="tile grow"
                      color={color}
                      onMouseDown={() => this.clickTile(x, y, color)}
                      onMouseOver={() => {
                        if (this.mouseDown) {
                          this.clickTile(x, y, color);
                        }
                      }}
                    ></article>
                  );
                })}
              </section>
            );
          })}
        </div>

        <div className="color">
          <section className="current tile" color={this.state.color} />

          <section className="select">
            {"abcdefghijklmnopqrstuv".split("").map((color, i) => {
              return (
                <article
                  key={i}
                  className="tile grow"
                  color={color}
                  onClick={() => this.setState({ color })}
                ></article>
              );
            })}
          </section>
        </div>

        <div className="countdown">
          <h1>{this.state.countdown}</h1>
          <button onClick={() => this.hack()}>Go hacker mode</button>
        </div>
      </div>
    );
  }
}
