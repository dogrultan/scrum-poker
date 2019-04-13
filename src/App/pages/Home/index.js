import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button';
import Wrapper from './Wrapper';

class Home extends Component {
  render() {
    return (
      <Wrapper>
        <h1>Scrum Poker Planning</h1>
        <Link to={'./poker-planning-add-story-list'}>
          <Button>Add Story List</Button>
        </Link>
      </Wrapper>
    );
  }
}
export default Home;
