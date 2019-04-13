import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PageLayout from '../../components/PageLayout';

class ViewPlanningAsScrumMaster extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <PageLayout />;
  }
}
export default withRouter(ViewPlanningAsScrumMaster);
