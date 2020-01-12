import Store from 'electron-store';
export interface IScheduleDay {
  name: string;
  enabled: boolean;
  shutdownTime: string;
}
type ISchedule = [
  IScheduleDay,
  IScheduleDay,
  IScheduleDay,
  IScheduleDay,
  IScheduleDay,
  IScheduleDay,
  IScheduleDay
];
export const store = new Store<{
  schedule: ISchedule;
}>();
