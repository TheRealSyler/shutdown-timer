import React, { Component } from 'react';
import { AppTheme } from '../../App';

interface ScheduleDayProps {
  name: string;
  shutdownTime: string;
  enabled: boolean;

  onChangeTime: (value: string) => void;
  onChangeEnabled: (value: boolean) => void;
}

class ScheduleDay extends Component<ScheduleDayProps> {
  render() {
    const inpClasses = `inp ${AppTheme.Class.colors('primary', 'background')}`;
    const labelClasses = `schedule-day-label ${AppTheme.Class.colors('disabled', 'color')}`;
    return (
      <div className="schedule-day-wrapper">
        <span className="schedule-day-name">
          {this.props.name}
          <input
            type="checkbox"
            defaultChecked={this.props.enabled}
            onChange={e => this.props.onChangeEnabled(e.target.checked)}
          />
        </span>
        <span className={labelClasses}>Shutdown</span>
        <input
          type="time"
          className={inpClasses}
          maxLength={3}
          defaultValue={this.props.shutdownTime}
          onChange={e => this.props.onChangeTime(e.target.value)}
        />
      </div>
    );
  }
}

export default ScheduleDay;
