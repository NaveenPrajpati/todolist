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
import {removeTodo} from '../services/todos';
import notifee from '@notifee/react-native';

const Header = ({title}) => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);
  const [showSearch, setShowSearch] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    selectedItems,
    setSelectedItems,
    todos,
    setTodos,
  } = useContext(MyContext);

  // Function to handle back press
  const onBackPress = () => {
    navigation.goBack();
  };

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

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
        {selectedItems.length != 0 && (
          <>
            <VectorIcon
              iconName="delete"
              iconPack="AntDesign"
              size={20}
              color="red"
              onPress={() => {
                removeTodo(selectedItems, () => {
                  console.log('todo deleted');
                  setSelectedItems([]);
                });
              }}
            />
            {selectedItems.length > 1 && (
              <VectorIcon
                iconName="playlist-add-check"
                iconPack="MaterialIcons"
                size={24}
                color="white"
                onPress={() => {
                  if (todos.length == selectedItems.length) {
                    setSelectedItems([]);
                  } else {
                    const arr = todos.map(({id}) => {
                      return id;
                    });
                    setSelectedItems(arr);
                  }
                }}
              />
            )}
          </>
        )}

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
