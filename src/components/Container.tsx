import {KeyboardAvoidingView, StyleSheet, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';

interface ContainerProps {
  children: ReactNode; // Defines that children can be any valid React element
}

const Container: React.FC<ContainerProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
});
