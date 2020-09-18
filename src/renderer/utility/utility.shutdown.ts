import { exec } from 'child_process';

export function shutdownCheck(
  canShutdown: boolean,
  shutdownDate: Date,
  hasSentNotification: boolean
) {
  const shutdownDateMs = shutdownDate.getTime();

  if (canShutdown) {
    if (
      !hasSentNotification &&
      Date.now() + getTimeInMs({ minutes: 5 }) > shutdownDateMs &&
      shutdownDateMs > Date.now()
    ) {
      new Notification('Shutdown Timer', {
        body: `PC will be shutdown at ${shutdownDate.toLocaleTimeString()}`
      });
      return true;
    }
    if (shutdownDateMs < Date.now() && shutdownDateMs + getTimeInMs({ minutes: 5 }) > Date.now()) {
      // console.log('EXEC:', getShutdownCmd());
      exec(getShutdownCmd());
    }
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
