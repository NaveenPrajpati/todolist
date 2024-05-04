import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import VectorIcon from './VectorIcon';
import moment from 'moment';
import {toggleCompletion} from '../services/todos';
import {colors, screenW} from '../utils/styles';

interface FormatDateTimeProps {
  dateTimeString: string;
}

const Card = ({item, onCheckPress, onPress}) => {
  function formatedDate(time) {
    const today = moment();
    const tomorrow = moment().add(1, 'days');
    const date = moment.unix(time);

    // Check if the date is today
    if (date.isSame(today, 'day')) {
      return date.format('hh:mm A'); // Return only the time
    } else if (date.isSame(tomorrow, 'day')) {
      return 'tom'; // Return "tom" for tomorrow
    } else {
      return date.format('ddd, DD MMM hh:mm A'); // Return the full date and time
    }
  }

  const computeItemStyle = item => {
    if (!item.dueData) {
      return {borderLeftColor: 'gray', marginLeft: 10};
    }

    const isPastDue = item.dueData.seconds < new Date().getTime() / 1000;
    return {
      borderLeftColor: isPastDue ? 'red' : 'green',
      marginLeft: isPastDue ? 5 : 35,
    };
  };
  const isPastDue = item.dueData.seconds < new Date().getTime() / 1000;

  const itemStyle = computeItemStyle(item);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        itemStyle,
        {
          opacity: isPastDue ? 0.5 : 1,
          backgroundColor: isPastDue ? 'red' : colors.cardbg,
        },
      ]}>
      <View style={styles.section}>
        <Text style={styles.currentValue}>{item.text}</Text>
        {item?.descriptions?.map((it, index) => (
          <Text key={index} style={styles.target}>
            {index + 1}
            {')'} {it}
          </Text>
        ))}
        <Text style={[styles.target, {color: 'green'}]}>
          {formatedDate(item.createdAt.seconds)}
        </Text>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.section}>
        <Text style={styles.currentValue}>89 kg</Text>
        {item.dueData && (
          <Text style={[styles.target, {color: isPastDue ? 'red' : 'cyan'}]}>
            {formatedDate(item.dueData)}
          </Text>
        )}
        <VectorIcon
          iconName={item.completed ? 'checkbox' : 'checkbox-outline'}
          iconPack="Ionicons"
          size={20}
          color="white"
          onPress={() => {
            toggleCompletion(
              {id: item.id, completed: item.completed},
              onCheckPress,
            );
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222', // dark background
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: screenW * 0.8,
    borderLeftWidth: 3,
    borderLeftColor: 'red',
    marginVertical: 5,
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
  currentValue: {
    color: 'violet',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4, // spacing between the current value and target
  },
  target: {
    color: '#999999', // lighter grey for the target
    fontSize: 12,
  },
  divider: {
    backgroundColor: '#999999', // grey divider
    width: 1, // make the divider thinner
    height: '60%', // adjust the height to match the design
  },
});

export default Card;
