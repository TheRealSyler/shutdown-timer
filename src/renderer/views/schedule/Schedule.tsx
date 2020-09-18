import React, { Component, ReactNode } from 'react';

import { store } from '../../utility/utility.store';

class Schedule extends Component {
  constructor(props: {}) {
    super(props);

    this.state = {};
  }

  render(): ReactNode {
    // store.delete('shutdownTime');

    let shutdownTime = store.get('shutdownTime');
    if (!shutdownTime) {
      shutdownTime = '00:00';
    }

    return (
      <input
        type="time"
        className="inp"
        maxLength={3}
        defaultValue={shutdownTime}
        onChange={e => store.set('shutdownTime', e.target.value)}
      />
    );
  }
}

export default Schedule;
