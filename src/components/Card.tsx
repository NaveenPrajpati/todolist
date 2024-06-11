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
        borderLeftColor: 'deepskyblue',
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
          opacity: isPastDue ? 0.8 : 1,
          // backgroundColor: isPastDue ? 'red' : colors.cardbg,
        },
        {width: item.completed ? '88%' : '70%'},
      ]}>
      <View style={styles.header}>
        <View style={styles.iconTextContainer}>
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
      <View style={{marginLeft: 5}}>
        <Text style={styles.currentValue}>{item.name}</Text>

        {item?.descriptions.length != 0 && (
          <>
            {item?.descriptions?.map((it: string, index: number) => (
              <Text key={index} style={styles.target}>
                {/* {index + 1} */}
                {'-'} {it}
              </Text>
            ))}
          </>
        )}
      </View>
      <View style={styles.footer}>
        {item?.category && (
          <Text style={{color: 'white', fontSize: 18}}>{item.category}</Text>
        )}
        {item.dueDate && (
          <Text
            style={[styles.target, {color: isPastDue ? 'red' : 'deepskyblue'}]}>
            <VectorIcon
              iconName="bell"
              color="white"
              style={{marginRight: 2}}
            />
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

    elevation: 4,
    shadowColor: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  currentValue: {
    color: 'violet',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
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
  descriptions: {
    marginLeft: 20,
  },
  footer: {
    alignItems: 'flex-end',
    borderRadius: 5,
  },
});

export default Card;
