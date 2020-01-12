import React, { Component } from 'react';

import './Home.sass';
import { AppTheme } from '../../App';
import { store, IScheduleDay } from '../../utility/utility.store';
import { shutdownCheck, getTimeInMs } from '../../utility/utility.shutdown';

interface HomeProps {}

interface HomeState {
  now: Date;
  hasSentNotification: boolean;
  interval?: NodeJS.Timeout;
  dates: Dates;
  changeTimeout: Date;
}

export type Dates = {
  shutdownDate: Date;

  isNextShutdownDate: boolean;

  nextShutdownDate: Date;
};

class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    const { currentDay, nextDay } = this.getDays();
    this.state = {
      hasSentNotification: false,
      changeTimeout: new Date(Date.now() + getTimeInMs({ minutes: 1 })),
      now: new Date(),
      dates: this.getDates(currentDay, nextDay)
    };
  }

  componentDidMount() {
    store.onDidChange('schedule', () => {
      this.UpdateState(new Date(Date.now() + getTimeInMs({ minutes: 1 })));
      this.forceUpdate();
    });
    this.setState({
      interval: setInterval(() => {
        this.UpdateState();
      }, 1000)
    });
  }

  private UpdateState(changeTimeout?: Date) {
    const { currentDay, nextDay } = this.getDays();
    const dates = this.getDates(currentDay, nextDay);

    this.setState({
      dates,
      now: new Date(),
      changeTimeout: changeTimeout ? changeTimeout : this.state.changeTimeout,
      hasSentNotification: shutdownCheck.bind(this, { ...dates }, currentDay, changeTimeout)()
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval!);
  }

  render() {
    const { disabledClass, homeTimeClass } = this.getClasses();

    const { currentDay, nextDay } = this.getDays();

    const {
      shutdownDate,

      isNextShutdownDate,

      nextShutdownDate
    } = this.state.dates;

    const SHUTDOWN_DATE = isNextShutdownDate ? nextShutdownDate : shutdownDate;

    const ENABLED = isNextShutdownDate ? nextDay.enabled : currentDay.enabled;

    return (
      <div className="home">
        <span className={disabledClass}>Shutting Down in</span>
        <span className="home-countdown">
          <span className={ENABLED ? '' : disabledClass}>
            {this.GetTimeDifference(SHUTDOWN_DATE)}
          </span>
          <span className={homeTimeClass}>
            ({SHUTDOWN_DATE.toLocaleTimeString()}
            {isNextShutdownDate ? ' '.concat(nextDay.name) : ''})
          </span>
          {this.disabledLineTrough(ENABLED)}
        </span>

        <span className="home-shutdown-disabled">
          <span className={this.canShutdown() ? disabledClass : ''}>
            shutdown disabled for{' '}
            {this.canShutdown() ? '00:00:00' : this.GetTimeDifference(this.state.changeTimeout)}
          </span>
          {this.disabledLineTrough(!this.canShutdown())}
        </span>
      </div>
    );
  }

  protected canShutdown() {
    return this.state.changeTimeout.getTime() < Date.now();
  }

  private getDays() {
    const now = new Date();
    const schedule = store.get('schedule');
    const currentDay = schedule[now.getDay()];
    const nextDay = schedule[(now.getDay() + 1) % 7];
    return { currentDay, nextDay };
  }

  private getClasses() {
    const disabledClass = AppTheme.Class.colors('disabled', 'color');
    const homeTimeClass = `home-time ${disabledClass}`;
    return { disabledClass, homeTimeClass };
  }

  private disabledLineTrough(enabled: boolean) {
    const disabledBgClass = AppTheme.Class.colors('disabled', 'background');
    return enabled ? null : (
      <div
        className={disabledBgClass}
        style={{
          position: 'absolute',
          width: '100%',
          height: 2
        }}
      />
    );
  }

  private getDates(currentDay: IScheduleDay, nextDay: IScheduleDay) {
    const shutdownDate = this.getDate(currentDay);

    const nextShutdownDate = this.getDate(nextDay, true);

    const isNextShutdownDate = shutdownDate.getTime() + getTimeInMs({ minutes: 5 }) < Date.now();

    return {
      isNextShutdownDate,
      shutdownDate,
      nextShutdownDate
    };
  }

  private getDate(day: IScheduleDay, isNext?: boolean) {
    const time = day.shutdownTime.split(':');
    const date = new Date();
    date.setHours(+time[0]);
    date.setMinutes(+time[1]);
    date.setSeconds(0);
    date.setMilliseconds(0);
    if (isNext) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  private GetTimeDifference(date: Date): string {
    const dif = Math.abs(this.state.now.getTime() - date.getTime());
    const Hours = Math.floor(dif / 1000 / 60 / 60);
    const Minutes = Math.floor((dif / 1000 / 60) % 60);
    const Seconds = Math.floor((dif / 1000) % 60);
    return `${this.getFixedNum(Hours.toString())}:${this.getFixedNum(
      Minutes.toString()
    )}:${this.getFixedNum(Seconds.toString())}`;
  }
  private getFixedNum(num: string) {
    return num.length === 1 ? `0${num}` : num;
  }
}

export default Home;
