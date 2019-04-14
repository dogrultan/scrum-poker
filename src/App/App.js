import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home/index';
import AddStoryList from './pages/AddStoryList/index';
import ViewPlanningAsDeveloper from './pages/ViewPlanningAsDeveloper/index';
import ViewPlanningAsScrumMaster from './pages/ViewPlanningAsScrumMaster/index';
import SubmitDeveloperId from './pages/SubmitDeveloperId/index';

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
          <Route
            path='/poker-planning-view-as-developer/:sessionName/developers/:id'
            component={ViewPlanningAsDeveloper}
          />
          <Route
            path='/poker-planning-view-as-developer/:sessionName'
            component={SubmitDeveloperId}
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
