import Home, { Dates } from '../views/home/Home';
import { exec } from 'child_process';
import { IScheduleDay } from './utility.store';

export function shutdownCheck(
  this: Home,
  { shutdownDate }: Dates,
  currentDay: IScheduleDay,
  changeTimeout?: Date
) {
  const shutdownDateMs = shutdownDate.getTime();
  let hasSentNotification = this.state.hasSentNotification;
  /** when the schedule is changed this will be true
   * so to prevent a shutdown we need to check if the changeTimeout var is undefined. */
  const canShutdown = this.canShutdown() && !changeTimeout;
  if (
    currentDay.enabled &&
    canShutdown &&
    !hasSentNotification &&
    Date.now() + getTimeInMs({ minutes: 5 }) > shutdownDateMs &&
    shutdownDateMs > Date.now()
  ) {
    hasSentNotification = true;

    new Notification('Shutdown Timer', {
      body: `PC will be shutdown at ${shutdownDate.toLocaleTimeString()}`
    });
  } else if (
    currentDay.enabled &&
    shutdownDateMs < Date.now() &&
    shutdownDateMs + getTimeInMs({ minutes: 5 }) > Date.now() &&
    canShutdown
  ) {
    console.log('EXEC:', getShutdownCmd());
    exec(getShutdownCmd());
  } else if (changeTimeout) {
    return false;
  }

  return hasSentNotification;
}

function getShutdownCmd() {
  let cmd = 'shutdown';
  switch (process.platform) {
    case 'linux':
      cmd += ' now';
      break;
    case 'win32':
      cmd += ' -s';
      break;
    case 'darwin':
      cmd = 'halt';
      break;
    default:
      cmd = '';
      break;
  }
  return cmd;
}

export function getTimeInMs(options: { seconds?: number; hours?: number; minutes?: number }) {
  if (!options.hours && !options.minutes && !options.seconds) {
    return 0;
  }
  const seconds = options.seconds ? 1000 * options.seconds : 0;
  const minutes = options.minutes ? 1000 * 60 * options.minutes : 0;
  const hours = options.hours ? 100 * 60 * 60 * options.hours : 0;
  return seconds + minutes + hours;
}
