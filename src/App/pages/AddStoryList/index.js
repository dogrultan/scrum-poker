import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Rectangle from '../../components/Rectangle';
import PageLayout from '../../components/PageLayout';
import TextField from '../../components/TextField';
import P from '../../components/P';
import Button from '../../components/Button';
import TextFieldWrapper from './TextFieldWrapper';
import ButtonWrapper from './ButtonWrapper';

class AddStoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionName: '',
      numberOfVoters: '',
      storyList: ''
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.routeChange = this.routeChange.bind(this);
  }

  routeChange() {
    const { sessionName, numberOfVoters, storyList } = this.state;
    const path = `poker-planning-view-as-scrum-master/${sessionName}`;
    this.props.history.push({
      pathname: path,
      state: {
        storyList,
        numberOfVoters
      }
    });
  }

  onTextChange(event) {
    const { value, name, maxLength } = event.target;
    if (maxLength !== -1) {
      this.setState({ [name]: value.slice(0, maxLength) });
    } else {
      this.setState({ [name]: value });
    }
  }

  render() {
    const { sessionName, numberOfVoters } = this.state;
    const voters = parseInt(numberOfVoters);
    return (
      <PageLayout>
        <Rectangle>Scrum Poker</Rectangle>
        <TextFieldWrapper>
          <TextField
            name='sessionName'
            width='600px'
            label='Session Name'
            value={sessionName}
            onChange={this.onTextChange}
            maxLength='200'
          />
          <TextField
            name='numberOfVoters'
            width='600px'
            label='Number of voters'
            value={numberOfVoters}
            onChange={this.onTextChange}
          />
        </TextFieldWrapper>
        <P>Paste your story list (Each line will be converted as a story)</P>
        <TextField textarea name='storyList' onChange={this.onTextChange} />
        <ButtonWrapper>
          <Button
            disabled={isNaN(voters) || voters === 0}
            onClick={this.routeChange}
          >
            Start Session
          </Button>
        </ButtonWrapper>
      </PageLayout>
    );
  }
}
export default withRouter(AddStoryList);
