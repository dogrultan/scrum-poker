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
import dayList from '../../common/dayList';
import columns from '../../common/columns';
import { ACTIVE } from '../../common/storyStatus';

import BodyWrapper from './BodyWrapper';
import LabelWrapper from './LabelWrapper';
import DayList from './DayList';

class ViewPlanningAsDeveloper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      currentStoryList: []
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentDidMount() {
    try {
      // Get current story list every 2 seconds
      setInterval(async () => {
        const res = await fetch(`${encodeURI(this.props.match.url)}`);
        const currentStoryList = await res.json();

        this.setState({ currentStoryList });
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  }

  handleSelect(e) {
    const { id } = this.props.location.state;
    const selected = e.currentTarget.textContent;
    this.setState({ selected });
    // Post voter id and selected day on selection
    try {
      fetch(`${encodeURI(this.props.match.url)}`, {
        method: 'POST',
        body: JSON.stringify({
          id,
          selected
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  getActiveStory(data) {
    const active = data.find(obj => obj.status === ACTIVE);
    return active ? active.story : data[data.length - 1].story;
  }

  render() {
    const { storyList } = this.props.location.state;
    const { currentStoryList } = this.state;
    const data = currentStoryList.length ? currentStoryList : storyList;
    const activeStory = this.getActiveStory(data);
    const { selected } = this.state;
    return (
      <PageLayout>
        <Rectangle>Scrum Poker</Rectangle>
        <BodyWrapper>
          <LabelWrapper>
            <Label>Story List</Label>
            <Table
              style={{ width: '900px' }}
              data={currentStoryList}
              resolveData={data => data.map(row => row)}
              columns={columns}
              loading={!currentStoryList.length}
              NoDataComponent={() => null}
            />
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
        </BodyWrapper>
      </PageLayout>
    );
  }
}
export default withRouter(ViewPlanningAsDeveloper);
