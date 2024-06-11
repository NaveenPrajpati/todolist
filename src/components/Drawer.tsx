import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

const Drawer = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>Dreawe</Text>
      <TouchableOpacity onPress={() => {}}>
        <Text style={{color: 'white'}}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: 'black',
    borderRightWidth: 1,
    borderRightColor: 'gray',
    // justifyContent: 'space-between',
  },
});
