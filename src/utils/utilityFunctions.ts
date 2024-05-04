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
  const today = moment();
  if (dateTime.isSame(today, 'day')) {
    // It's today, return only the time
    return dateTime.format('HH:mm');
  } else {
    // It's not today, return date and time
    return dateTime.format('DD MM YYYY HH:mm');
  }
};
