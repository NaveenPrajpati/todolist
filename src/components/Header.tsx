import {useNavigation, useNavigationState} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import VectorIcon from './VectorIcon';
import {MyContext} from '../../App';
import {colors} from '../utils/styles';
import FilterMenu from './FilterMenu';

const Header = ({title}) => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);
  const [showSearch, setShowSearch] = useState(false);
  const {searchQuery, setSearchQuery} = useContext(MyContext);

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
        {showSearch && (
          <TextInput
            placeholder="Search here"
            multiline
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.input, {width: '50%'}]}
            placeholderTextColor={'white'}
          />
        )}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
        <VectorIcon
          iconName="search"
          size={20}
          color="white"
          onPress={() => setShowSearch(pre => !pre)}
        />
        <FilterMenu />
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
  input: {
    color: 'white',
    fontSize: 14,
    padding: 5,

    borderBottomWidth: 2,
    borderBottomColor: colors.pirmary,
  },
});

export default Header;
