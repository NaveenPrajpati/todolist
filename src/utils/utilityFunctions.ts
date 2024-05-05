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

export const formatDateTime = (dateTimeString: moment.MomentInput): string => {
  const dateTime = moment(dateTimeString);
  const today = moment().startOf('day');

  if (dateTime.isSame(today, 'day')) {
    // It's today, return only the time
    return dateTime.format('hh:mm A');
  } else {
    // It's not today, return date and time
    return dateTime.format('ddd DD/MMM/YY  hh:mm A');
  }
};

export function formatedDate(time) {
  // Initialize today's start and tomorrow's start
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'days').startOf('day');

  // Convert the UNIX timestamp to a Moment object
  const date = moment.unix(time);

  // Check if the date is today
  if (date.isSame(today, 'day')) {
    return date.format('hh:mm A');
  }
  // Check if the date is tomorrow
  else if (date.isSame(tomorrow, 'day')) {
    return 'tom'; // Return "tom" for tomorrow
  }
  // Return a full date and time format otherwise
  else {
    return date.format('ddd, DD MMM hh:mm A'); // Example: "Sun, 05 May 04:30 PM"
  }
}
