import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import VectorIcon from './VectorIcon';
import {MyContext} from '../../App';

const FilterMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const {setFilterQuery} = useContext(MyContext);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const selectFilter = item => {
    setFilterQuery(item);
    setSelectedFilter(item);
    setMenuVisible(false); // Automatically closes the menu when an item is selected
  };

  const filterData = [
    'all',
    'completed',
    'upcoming',
    'overdue',
    'today',
    'No limit',
    'pending',
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.button}>
        <VectorIcon iconName="filter" size={20} color="white" />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu} // This will handle the hardware back button on Android
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={toggleMenu}>
          <View style={styles.menu}>
            {filterData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectFilter(item)}
                style={[
                  styles.menuItem,
                  selectedFilter === item && styles.selectedMenuItem,
                ]}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Additional styles
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,

    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedMenuItem: {
    backgroundColor: 'lightgray', // Adjust color as needed
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});

export default FilterMenu;
