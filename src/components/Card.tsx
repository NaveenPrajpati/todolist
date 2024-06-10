import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import VectorIcon from './VectorIcon';
import moment from 'moment';
import {toggleCompletion} from '../services/todos';
import {colors, screenW} from '../utils/styles';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {formatedDate} from '../utils/utilityFunctions';

interface CardProps {
  item: any; // Use a more specific type if possible
  onCheckPress: () => void;
  onPress: () => void;
  isSelected: boolean;
  onLongPress: () => void;
  onSelectPress: () => void;
}

const Card = ({
  item,
  onCheckPress,
  onPress,
  isSelected,
  onLongPress,
  onSelectPress,
}: CardProps) => {
  const computeItemStyle = item => {
    if (!item.dueDate || item.dueDate === '') {
      return {borderLeftColor: 'gray', marginLeft: 20};
    }

    const isPastDue = item.dueDate < new Date().getTime() / 1000;

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
  const isPastDue =
    item.dueDate &&
    item.dueDate !== '' &&
    item.dueDate < new Date().getTime() / 1000;

  // Compute the item's specific styles
  const itemStyle = computeItemStyle(item);
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      style={[
        styles.container,
        itemStyle,
        {
          opacity: isPastDue ? 0.5 : 1,
          backgroundColor: isPastDue ? 'red' : colors.cardbg,
        },
        {width: item.completed ? '88%' : '70%'},
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
              isSelected ? 'radio-button-checked' : 'radio-button-unchecked'
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
          onPress={onCheckPress}
        />
      </View>
      <Text style={styles.currentValue}>{item.name}</Text>

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
          justifyContent: 'flex-end',
          marginTop: 20,
          borderRadius: 5,
        }}>
        {/* <VectorIcon
          iconName={'pencil'}
          size={20}
          color="white"
          onPress={onEditPress}
        /> */}
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
