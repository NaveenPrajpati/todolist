import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import VectorIcon from './VectorIcon';
import moment from 'moment';
import {toggleCompletion} from '../services/todos';
import {colors, screenW} from '../utils/styles';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

interface FormatDateTimeProps {
  dateTimeString: string;
}

const Card = ({
  item,
  onCheckPress,
  onLongPress,
  onSelectPress,
  selectedItems,
  onEditPress,
}) => {
  function formatedDate(time) {
    // Initialize today's start and tomorrow's start
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'days').startOf('day');

    // Convert the UNIX timestamp to a Moment object  or Convert the ISO 8601 date string to a Moment object
    const date = time.seconds ? moment.unix(time.seconds) : moment(time);

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

  const computeItemStyle = (item: {dueDate?: {seconds: number} | null}) => {
    // Check if there's no due date
    if (!item.dueDate) {
      return {borderLeftColor: 'gray', marginLeft: 20};
    }

    // Check if the due date is past
    const isPastDue = item.dueDate.seconds < new Date().getTime() / 1000;

    // Apply appropriate styles based on conditions
    if (isPastDue) {
      return {
        borderLeftColor: 'red',
        marginLeft: 0,
      };
    } else {
      return {
        borderLeftColor: 'cyan',
        marginLeft: 40,
      };
    }
  };

  // Check if the item is past due (for opacity and background color)
  const isPastDue = item.dueDate?.seconds < new Date().getTime() / 1000;

  // Compute the item's specific styles
  const itemStyle = computeItemStyle(item);
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      style={[
        styles.container,
        itemStyle,
        {
          opacity: isPastDue ? 0.5 : 1,
          backgroundColor: isPastDue ? 'red' : colors.cardbg,
        },
        {width: item.completed ? '90%' : '70%'},
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <VectorIcon
            iconName={
              selectedItems.includes(item.id)
                ? 'radio-button-checked'
                : 'radio-button-unchecked'
            }
            iconPack="MaterialIcons"
            size={20}
            color="white"
            onPress={onSelectPress}
          />
          <Text style={[styles.target, {color: 'green'}]}>
            {formatedDate(item.createdAt)}
          </Text>
        </View>
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
      <Text style={styles.currentValue}>{item.text}</Text>

      {item?.descriptions.length != 0 && (
        <View style={{marginLeft: 20}}>
          {item?.descriptions?.map((it, index) => (
            <Text key={index} style={styles.target}>
              {index + 1}
              {')'} {it}
            </Text>
          ))}
        </View>
      )}
      {/* <View style={styles.divider}></View> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          borderRadius: 5,
        }}>
        <VectorIcon
          iconName={'pencil'}
          // iconPack="Ionicons"
          size={20}
          color="white"
          onPress={onEditPress}
        />
        {item.dueDate && (
          <Text style={[styles.target, {color: isPastDue ? 'red' : 'cyan'}]}>
            {formatedDate(item.dueDate)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222',
    borderRadius: 10,
    padding: 5,
    // alignItems: 'center',
    // justifyContent: 'space-evenly',
    width: screenW * 0.6,
    borderLeftWidth: 3,
    borderLeftColor: 'red',
    marginVertical: 5,
  },
  section: {
    // flex: 2,
    // alignItems: 'flex-start',
  },
  currentValue: {
    color: 'violet',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 10,
  },
  target: {
    color: '#999999', // lighter grey for the target
    fontSize: 16,
  },
  divider: {
    backgroundColor: '#999999', // grey divider
    width: 1, // make the divider thinner
    height: '80%', // adjust the height to match the design
  },
});

export default Card;
