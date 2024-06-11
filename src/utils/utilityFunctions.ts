import moment from 'moment';
import {ToastAndroid} from 'react-native';

export function toast(text: string) {
  ToastAndroid.show(text, ToastAndroid.SHORT);
}

export const selectData = [
  {label: 'Personal', value: 'personal'},
  {label: 'Shopping', value: 'shopping'},
  {label: 'Wishlist', value: 'wishlist'},
  {label: 'Work', value: 'work'},
];
export const filterData = [
  {label: 'OverDue', value: 'overDue'},
  {label: 'Completed', value: 'completed'},
  {label: 'Latest', value: 'latest'},
  {label: 'Oldest', value: 'oldest'},
];

export function formatedDate(time: string | number) {
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'days').startOf('day');

  // Convert the seconds time to a Moment object
  const date = moment(time * 1000);

  if (date.isSame(today, 'day')) {
    return date.format('hh:mm A');
  } else if (date.isSame(tomorrow, 'day')) {
    return 'Tom, ' + date.format('hh:mm A');
  } else {
    return date.format('ddd, DD MMM hh:mm A');
  }
}
