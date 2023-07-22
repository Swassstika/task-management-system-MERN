
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './dashboard/Dashboard';
import './App.css'; // Import your custom styles here, if any
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const App = () => {
  // Replace 'https://random-string.ngrok.io' with your ngrok URL
  const BASE_API_URL = 'https://7e2e-115-240-194-54.ngrok.io';

  return (
    <Router>  
      <Switch>
        {/* Pass the BASE_API_URL as a prop to the Login component */}
        <Route exact path="/login">
          <Login apiUrl={BASE_API_URL} />
        </Route>
        {/* Pass the BASE_API_URL as a prop to the Dashboard component */}
        <Route exact path="/dashboard">
          <Dashboard apiUrl={BASE_API_URL} />
        </Route>
        {/* Add other routes for other components */}
      </Switch>
    </Router>
  );
};

export default App;
