import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home/index';
import AddStoryList from './pages/AddStoryList/index';
import ViewPlanningAsScrumMaster from './pages/ViewPlanningAsScrumMaster/index';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route
            exact
            path='/poker-planning-add-story-list'
            component={AddStoryList}
          />
          <Route
            path='/poker-planning-view-as-scrum-master/:sessionName'
            component={ViewPlanningAsScrumMaster}
          />
        </Switch>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
