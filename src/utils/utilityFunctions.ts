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
