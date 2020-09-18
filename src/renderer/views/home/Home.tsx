import React, { Component } from 'react';

import './Home.sass';
import { store } from '../../utility/utility.store';
import { getTimeInMs, shutdownCheck } from '../../utility/utility.shutdown';

interface HomeProps {}

interface HomeState {
  now: Date;
  hasSentNotification: boolean;
  interval?: NodeJS.Timeout;
  changeTimeout: Date;
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      hasSentNotification: false,
      changeTimeout: this.getNewChangeTimeout(),
      now: new Date()
    };
  }

  private getNewChangeTimeout() {
    return new Date(Date.now() + getTimeInMs({ seconds: 30 }));
  }

  componentDidMount() {
    store.onDidChange('shutdownTime', () => {
      this.UpdateState(this.getNewChangeTimeout());
    });
    this.setState({
      interval: setInterval(() => {
        this.UpdateState();
      }, 1000)
    });
  }

  private UpdateState(changeTimeout?: Date) {
    this.setState({
      now: new Date(),
      changeTimeout: changeTimeout || this.state.changeTimeout,
      hasSentNotification: shutdownCheck(
        this.canShutdown(changeTimeout),
        this.getCurrentShutdownDate(),
        !changeTimeout && this.state.hasSentNotification
      )
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval!);
  }

  render() {
    const { disabledClass, homeTimeClass } = this.getClasses();

    const SHUTDOWN_DATE = this.getCurrentShutdownDate();

    if (SHUTDOWN_DATE.getTime() < Date.now()) {
      SHUTDOWN_DATE.setDate(SHUTDOWN_DATE.getDate() + 1);
    }

    const ENABLED = this.canShutdown();

    return (
      <div className="home">
        <span className={disabledClass}>Shutting Down in</span>
        <span className="home-countdown">
          <span className={ENABLED ? '' : disabledClass}>
            {this.GetTimeDifference(SHUTDOWN_DATE)}
          </span>
          <span className={homeTimeClass}>({SHUTDOWN_DATE.toLocaleTimeString()})</span>
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

  private getCurrentShutdownDate() {
    return this.getDate(store.get('shutdownTime') || '00:00');
  }

  protected canShutdown(changeTimeout?: Date) {
    if (changeTimeout) {
      return changeTimeout.getTime() < Date.now();
    }
    return this.state.changeTimeout.getTime() < Date.now();
  }

  private getClasses() {
    const disabledClass = 'disabled';
    const homeTimeClass = `home-time ${disabledClass}`;
    return { disabledClass, homeTimeClass };
  }

  private disabledLineTrough(enabled: boolean) {
    return enabled ? null : (
      <div
        className="disabled-line"
        style={{
          position: 'absolute',
          width: '100%',
          height: 2
        }}
      />
    );
  }

  private getDate(time: string) {
    const currentTime = time.split(':');
    const date = new Date();
    date.setHours(+currentTime[0]);
    date.setMinutes(+currentTime[1]);
    date.setSeconds(0);
    date.setMilliseconds(0);

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
