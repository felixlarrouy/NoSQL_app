import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Dev from './Dev';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from "react-router-dom";


const MainApp = () => (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/dev" component={Dev} />
    </div>
  </Router>
);
ReactDOM.render(<MainApp />, document.getElementById('root'));
registerServiceWorker();
