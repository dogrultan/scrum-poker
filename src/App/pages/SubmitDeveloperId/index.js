import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Rectangle from '../../components/Rectangle';
import PageLayout from '../../components/PageLayout';
import TextField from '../../components/TextField';
import Button from '../../components/Button';

import Wrapper from './Wrapper';

class SubmitDeveloperId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      storyList: []
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.routeChange = this.routeChange.bind(this);
  }

  componentDidMount() {
    // Get current story list
    fetch(`${encodeURI(this.props.match.url)}`)
      .then(res => res.json())
      .then(list => {
        this.setState({ storyList: list });
      });
  }

  routeChange() {
    const { id, storyList } = this.state;
    const base = encodeURI(this.props.match.url);
    const path = `${base}/developers/${id}`;
    // Propagate current story list to developer voting page
    this.props.history.push({
      pathname: path,
      state: {
        id,
        storyList
      }
    });
  }

  onTextChange(event) {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { id } = this.state;
    const voterId = parseInt(id);
    return (
      <PageLayout>
        <Rectangle>Scrum Poker</Rectangle>
        <Wrapper>
          <TextField
            name='id'
            width='600px'
            margin='0 18px 0 0'
            label='Enter developer (voter) ID'
            value={id}
            onChange={this.onTextChange}
          />
          <Button
            disabled={isNaN(voterId) || voterId === 0}
            onClick={this.routeChange}
          >
            View Planning
          </Button>
        </Wrapper>
      </PageLayout>
    );
  }
}
export default withRouter(SubmitDeveloperId);
