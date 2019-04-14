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
import { ACTIVE, NOT_VOTED } from '../../common/storyStatus';

import BodyWrapper from './BodyWrapper';
import LabelWrapper from './LabelWrapper';
import DayList from './DayList';

class ViewPlanningAsDeveloper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    const { id, storyList } = this.props.location.state;
    const selected = e.currentTarget.textContent;
    this.setState({ selected });
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
    return data.find(obj => obj.status === ACTIVE).story;
  }

  initializeData(splittedStoryList) {
    return splittedStoryList.map((story, i) => {
      return {
        story: story,
        storyPoint: '',
        status: i === 0 ? ACTIVE : NOT_VOTED
      };
    });
  }

  render() {
    const { storyList } = this.props.location.state;
    const activeStory = this.getActiveStory(storyList);
    const { selected } = this.state;
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
        <Rectangle>Scrum Poker</Rectangle>
        <BodyWrapper>
          <LabelWrapper>
            <Label>Story List</Label>
            <Table data={storyList} columns={columns} />
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
