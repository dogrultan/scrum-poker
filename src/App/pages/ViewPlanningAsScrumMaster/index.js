import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PageLayout from '../../components/PageLayout';
import Rectangle from '../../components/Rectangle';
import { SmallRectangle } from '../../components/Rectangle';
import FieldSet from '../../components/FieldSet';
import Legend from '../../components/Legend';
import Label from '../../components/Label';
import Table from '../../components/Table';
import P from '../../components/P';
import Button from '../../components/Button';
import dayList from '../../common/dayList';
import { ACTIVE, NOT_VOTED } from '../../common/storyStatus';

import BodyWrapper from './BodyWrapper';
import BottomWrapper from './BottomWrapper';
import LabelWrapper from './LabelWrapper';
import VoterWrapper from './VoterWrapper';
import Voters from './Voters';
import DayList from './DayList';
import Header from './Header';
import FinalScore from './FinalScore';

class ViewPlanningAsScrumMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      votingFinished: false,
      data: [],
      voteMapping: []
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  isVotesEqual() {
    const uniqueVotes = [
      ...new Set(
        new Set(this.state.voteMapping.map(vote => vote.selected)).add(
          this.state.selected
        )
      )
    ];
    return uniqueVotes.length === 1;
  }

  renderVoters() {
    const { numberOfVoters } = this.props.location.state;
    const voters = [];
    if (this.state.votingFinished) {
      for (let i = 1; i <= numberOfVoters; i++) {
        voters.push(
          <VoterWrapper key={i}>
            <P>Voter {i}:</P>
            <P>
              {
                this.state.voteMapping.find(obj => parseInt(obj.id) === i)
                  .selected
              }
            </P>
          </VoterWrapper>
        );
      }
    } else {
      for (let i = 1; i <= numberOfVoters; i++) {
        voters.push(
          <VoterWrapper key={i}>
            <P>Voter {i}:</P>
            <P>
              {this.state.voteMapping.find(obj => parseInt(obj.id) === i)
                ? 'Voted'
                : 'Not Voted'}
            </P>
          </VoterWrapper>
        );
      }
    }
    return voters;
  }

  isVotingFinished() {
    const { numberOfVoters } = this.props.location.state;
    const { voteMapping, selected } = this.state;
    return (
      voteMapping.every(obj => obj.id >= 1 && obj.id <= numberOfVoters) &&
      voteMapping.length === parseInt(numberOfVoters) &&
      selected
    );
  }

  async componentDidMount() {
    const { data, sessionName } = this.props.location.state;
    const sessionURI = encodeURI(sessionName);
    try {
      fetch(`/poker-planning-view-as-developer/${sessionURI}`, {
        method: 'POST',
        body: JSON.stringify({
          data
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setInterval(async () => {
        const res = await fetch(
          `/poker-planning-view-as-scrum-master/${sessionURI}`
        );
        const data = await res.json();

        this.setState({ data });
      }, 2000);
      setInterval(async () => {
        const res = await fetch(`/vote-mapping`);
        const voteMapping = await res.json();

        this.setState({ voteMapping, votingFinished: this.isVotingFinished() });
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  }

  handleEndVote(e) {}

  handleSelect(e) {
    const selected = e.currentTarget.textContent;
    this.setState({ selected });
  }

  getActiveStory(data) {
    return data.find(obj => obj.status === ACTIVE).story;
  }

  initializeData(splittedStoryList) {
    const initialData = splittedStoryList.map((story, i) => {
      return {
        story: story,
        storyPoint: '',
        status: i === 0 ? ACTIVE : NOT_VOTED
      };
    });
    this.setState({ data: initialData });
    return initialData;
  }

  render() {
    const { data, sessionName } = this.props.location.state;
    const { selected, votingFinished } = this.state;

    const activeStory = this.getActiveStory(data);
    const columns = [
      {
        Header: 'Story',
        accessor: 'story'
      },
      {
        Header: 'Story Point',
        accessor: 'storyPoint'
      },
      {
        Header: 'Status',
        accessor: 'status'
      }
    ];
    this.isVotesEqual();
    return (
      <PageLayout>
        <Header>
          <Rectangle>Scrum Poker</Rectangle>
          <P small>
            Please share link of developers panel to the teammates:
            http://localhost:3000/poker-planning-view-as-developer/
            {encodeURI(sessionName)}
          </P>
        </Header>
        <BodyWrapper>
          <LabelWrapper>
            <Label>Story List</Label>
            <Table data={data} columns={columns} />
          </LabelWrapper>
          <LabelWrapper>
            <Label>Active Story</Label>
            <FieldSet>
              <Legend>{activeStory}</Legend>
              <DayList>
                {dayList.map(day => (
                  <SmallRectangle
                    key={day}
                    onClick={this.handleSelect}
                    selected={parseInt(selected) === day}
                  >
                    {day}
                  </SmallRectangle>
                ))}
                <P>{selected ? `${selected} Voted` : 'Please Vote!'}</P>
              </DayList>
            </FieldSet>
          </LabelWrapper>
          <FieldSet>
            <Legend>Scrum Master Panel</Legend>
            <P>{activeStory} is active</P>
            <Voters>{this.renderVoters()}</Voters>
            {selected ? (
              <VoterWrapper>
                <P>Scrum Master:</P>
                <P>{votingFinished ? selected : 'Voted'}</P>
              </VoterWrapper>
            ) : (
              <VoterWrapper>
                <P>Scrum Master:</P>
                <P>Not Voted</P>
              </VoterWrapper>
            )}
            <BottomWrapper>
              {votingFinished && !this.isVotesEqual() && (
                <P small>
                  Seems team has different votes. Please discuss and finalize
                  the score below textbox
                </P>
              )}
              {votingFinished && selected && (
                <React.Fragment>
                  <P>Final Score</P>
                  <FinalScore width='100px' />
                </React.Fragment>
              )}
              <Button disabled={!votingFinished} onClick={this.handleEndVote}>
                End Voting For {activeStory}
              </Button>
              {!votingFinished && (
                <P small>You can not end voting till each teammate voted</P>
              )}
            </BottomWrapper>
          </FieldSet>
        </BodyWrapper>
      </PageLayout>
    );
  }
}
export default withRouter(ViewPlanningAsScrumMaster);
