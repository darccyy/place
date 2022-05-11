import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import App from "./App.js";

// Router
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root"),
);
