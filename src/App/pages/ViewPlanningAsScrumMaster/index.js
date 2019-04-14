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
import { ACTIVE, VOTED, NOT_VOTED } from '../../common/storyStatus';

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
      currentData: [],
      voteMapping: [],
      finalScore: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleFinalScore = this.handleFinalScore.bind(this);
    this.handleEndVote = this.handleEndVote.bind(this);
  }

  handleFinalScore(event) {
    const { value, name } = event.target;
    this.setState({ [name]: value });
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
                ? VOTED
                : NOT_VOTED}
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
      !!selected
    );
  }

  async componentDidMount() {
    const { data, sessionName } = this.props.location.state;
    const sessionURI = encodeURI(sessionName);
    try {
      fetch(`/poker-planning-view-as-developer/${sessionURI}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setInterval(async () => {
        const res = await fetch(
          `/poker-planning-view-as-scrum-master/${sessionURI}`
        );
        const currentData = await res.json();

        this.setState({ currentData });
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

  handleEndVote(event) {
    const { sessionName } = this.props.location.state;
    const { finalScore, currentData } = this.state;
    if (finalScore) {
      let nextActiveStoryIndex = null;
      const nextState = currentData.map((obj, i) => {
        if (obj.status === ACTIVE) {
          nextActiveStoryIndex = i + 1;
          return {
            story: obj.story,
            storyPoint: finalScore,
            status: VOTED
          };
        } else if (i === nextActiveStoryIndex) {
          return {
            story: obj.story,
            storyPoint: obj.storyPoint,
            status: ACTIVE
          };
        }
        return {
          story: obj.story,
          storyPoint: obj.storyPoint,
          status: obj.status
        };
      });
      const sessionURI = encodeURI(sessionName);
      try {
        fetch(`/poker-planning-view-as-scrum-master/${sessionURI}`, {
          method: 'POST',
          body: JSON.stringify(nextState),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.setState({
          currentData: nextState,
          votingFinished: false,
          selected: null,
          finalScore: ''
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleSelect(e) {
    const selected = e.currentTarget.textContent;
    this.setState({ selected });
  }

  getActiveStory(data) {
    return data.find(obj => obj.status === ACTIVE).story;
  }

  render() {
    const { data, sessionName } = this.props.location.state;
    const { currentData, selected, votingFinished, finalScore } = this.state;

    const activeStory = this.getActiveStory(
      currentData.length ? currentData : data
    );
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
            <Table data={currentData} columns={columns} />
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
                  <FinalScore
                    width='100px'
                    name='finalScore'
                    value={finalScore}
                    onChange={this.handleFinalScore}
                  />
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
