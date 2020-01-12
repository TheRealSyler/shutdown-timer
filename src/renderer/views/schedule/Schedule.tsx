import React, { Component, ReactNode } from 'react';
import ScheduleDay from './Schedule.day';

import './Schedule.sass';
import { store } from '../../utility/utility.store';
import { AppTheme } from '../../App';

interface Props {}
interface State {}

class Schedule extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render(): ReactNode {
    // store.delete('schedule');

    let schedule = store.get('schedule');
    if (!schedule) {
      store.set('schedule', [
        getDefaultScheduleDay('Sunday'),
        getDefaultScheduleDay('Monday'),
        getDefaultScheduleDay('Tuesday'),
        getDefaultScheduleDay('Wednesday'),
        getDefaultScheduleDay('Thursday'),
        getDefaultScheduleDay('Friday'),
        getDefaultScheduleDay('Saturday')
      ]);
      schedule = store.get('schedule');
    }
    const scheduleHtml: JSX.Element[] = [];
    for (let i = 0; i < schedule.length; i++) {
      const day = schedule[i];
      scheduleHtml.push(
        <ScheduleDay
          name={day.name}
          shutdownTime={day.shutdownTime}
          enabled={day.enabled}
          onChangeEnabled={v => this.setSchedule(i, 'enabled', v)}
          onChangeTime={v => this.setSchedule(i, 'shutdownTime', v)}
          key={day.name}
        />
      );
    }

    return (
      <div className={`schedule ${AppTheme.Class.colors('secondary', 'background')}`}>
        {scheduleHtml}
      </div>
    );
  }

  private setSchedule(i: number, t: string, v: any): void {
    // @ts-ignore
    store.set(`schedule.${i}.${t}`, v);
  }
}

export default Schedule;
function getDefaultScheduleDay(name: string) {
  return {
    name,
    enabled: true,
    shutdownTime: '00:00'
  };
}
