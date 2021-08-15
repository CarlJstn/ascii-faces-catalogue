import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <HomePage />} />
          <Route render={() => <div>Wrong Page ಥ_ಥ</div>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
