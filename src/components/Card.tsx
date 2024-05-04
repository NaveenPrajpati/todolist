import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VectorIcon from './VectorIcon';
import moment from 'moment';
import {toggleCompletion} from '../services/todos';

interface FormatDateTimeProps {
  dateTimeString: string;
}

const Card = ({item, onCheckPress}) => {
  function formatedDate(time) {
    const today = moment();
    const date = moment.unix(time);
    const formattedDate = date.format('DD MM YYYY HH:mm');
    return formattedDate;
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderLeftColor: item.dueData ? 'green' : 'gray',
          marginLeft: item.dueData ? 25 : 5,
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
          <Text style={styles.target}>{formatedDate(item.dueData)}</Text>
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
    </View>
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
    width: 280, // specify the width
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
    fontSize: 14,
  },
  divider: {
    backgroundColor: '#999999', // grey divider
    width: 1, // make the divider thinner
    height: '60%', // adjust the height to match the design
  },
});

export default Card;
