import { Component } from "react";
import { io } from "socket.io-client";
import F from "fortissimo";

import "./App.scss";

export default class App extends Component {
  columns = 30;
  rows = 20;
  state = { board: "?".repeat(this.columns * this.rows), color: "e" };

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
        console.log("Tile changed");
      });

    fetch("/api/get")
      .then(res => res.text())
      .then(board => {
        this.setState({ board });
      })
      .catch(err => {
        throw err;
      });
  }

  clickTile(x, y) {
    console.log(x, y, this.state.color);
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
  }

  render() {
    return (
      <div className="App">
        <h1>Place</h1>

        <div className="board">
          {F.splitAt(this.state.board, this.rows).map((row, y) => {
            return (
              <section key={y} className="row">
                {row.split("").map((color, x) => {
                  return (
                    <article
                      key={x}
                      className="tile grow"
                      color={color}
                      onClick={() => this.clickTile(x, y, color)}
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
      </div>
    );
  }
}
