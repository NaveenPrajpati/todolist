import {StyleSheet, Text, View} from 'react-native';
import React, {Children} from 'react';

const Container = ({children}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-between',
      }}>
      {children}
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({});
