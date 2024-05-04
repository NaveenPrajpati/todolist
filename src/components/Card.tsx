import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Card = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.currentValue}>8 day</Text>
        <Text style={styles.target}>target: 24 days</Text>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.section}>
        <Text style={styles.currentValue}>89 kg</Text>
        <Text style={styles.target}>target: 78 kg</Text>
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
    height: 80, // specify the height
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
