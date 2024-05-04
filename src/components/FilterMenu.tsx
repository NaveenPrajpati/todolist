import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import VectorIcon from './VectorIcon';
import {colors} from '../utils/styles';
import {MyContext} from '../../App';

const FilterMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const {setFilterQuery} = useContext(MyContext);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const filterData = [
    'all',
    'completed',
    'upcomming',
    'overdue',
    'No limit',
    'pending',
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.button}>
        <VectorIcon iconName="filter" size={20} color="white" />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          {filterData.map((item, index) => (
            <TouchableOpacity
              onPress={() => setFilterQuery(item)}
              style={styles.menuItem}>
              <Text style={styles.menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    width: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '',
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});

export default FilterMenu;
