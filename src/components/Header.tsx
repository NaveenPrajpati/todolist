import {useNavigation, useNavigationState} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import VectorIcon from './VectorIcon';

const Header = ({title}) => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);

  // Function to handle back press
  const onBackPress = () => {
    navigation.goBack();
  };

  // Determine if the back button should be shown
  const showBackButton = state.index > 0;
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <VectorIcon
              iconName="arrowleft"
              iconPack="AntDesign"
              size={24}
              style={styles.backText}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <VectorIcon iconName="search" size={20} color="white" />
        <VectorIcon iconName="file" size={20} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222', // dark background as in the card
    height: 60, // height of the header
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    justifyContent: 'center',
    // Full height of the header
  },
  backText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
