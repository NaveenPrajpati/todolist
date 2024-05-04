import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Container from '../components/Container';
import {colors} from '../utils/styles';
import VectorIcon from '../components/VectorIcon';
import SelectTag from '../components/Dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MyContext} from '../../App';
import {formatDateTime, selectData, toast} from '../utils/utilityFunctions';
import {addList, getList} from '../services/lists';
import moment from 'moment';

const CreateTodo = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [showCreateList, setShowCreateList] = useState(false);
  const [newList, setNewList] = useState('');
  const [list, setLIst] = useState('');
  const [descriptions, setDescriptions] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [dueDate, setDueData] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {deviceId, setDeviceId} = useContext(MyContext);
  const [listItem, setListItem] = useState(selectData);

  const handleDateChange = (date: Date) => {
    console.log(date);
    setDueData(data);
    setDueData(date);
    setDatePickerVisibility(false);
  };

  function resetData() {
    setDescriptionValue('');
    setDescriptions([]);
    setData('');
  }

  const addData = async () => {
    if (data == '') {
      toast('Add Task Please');
      return;
    }
    setLoading(true);
    try {
      await firestore().collection('Todos').add({
        text: data,
        descriptions: descriptions,
        completed: false,
        createdAt: firestore.Timestamp.now(),
        deviceId: deviceId,
        lists: list,
        dueData: dueDate,
      });
      toast('Todo added!');
      resetData();
      navigation.goBack();
    } catch (error) {
      toast('Failed to add Task. Try again.');
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList(deviceId, e => {
      // console.log(JSON.stringify(e, null, 2));
      setListItem(pre => [...pre, ...e]);
    });
  }, []);

  return (
    <Container>
      <View style={styles.inputContainer}>
        <View
          style={{
            backgroundColor: colors.cardbg,
            padding: 10,
            marginBottom: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TextInput
              placeholder="Add your Task"
              multiline
              onChangeText={setData}
              value={data}
              style={[styles.input, {width: '90%'}]}
              placeholderTextColor={'white'}
            />
            <VectorIcon
              iconName="close"
              size={20}
              color={data ? 'red' : 'white'}
              onPress={() => setData('')}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>
              Task Content
            </Text>
            {descriptions.length != 0 && (
              <VectorIcon
                iconName="close"
                size={20}
                color="white"
                onPress={() => {
                  setDescriptions([]);
                  setDescriptionValue('');
                }}
              />
            )}
          </View>
          <FlatList
            data={descriptions}
            renderItem={({item, index}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <Text style={{color: 'white', fontSize: 20}}>
                  {index + 1}
                  {')'} {item}
                </Text>
                <VectorIcon
                  iconName="delete"
                  iconPack="AntDesign"
                  size={18}
                  color="red"
                  onPress={() => {
                    const arr = descriptions.filter(it => it != item);
                    setDescriptions(arr);
                  }}
                />
              </View>
            )}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder="Add Content"
              multiline
              onChangeText={setDescriptionValue}
              value={descriptionValue}
              style={[styles.input, {width: '95%'}]}
              placeholderTextColor={'white'}
            />
            <VectorIcon
              iconName="check"
              size={20}
              color={descriptionValue ? 'green' : 'white'}
              onPress={() => {
                if (descriptionValue) {
                  setDescriptions(pre => [...pre, descriptionValue]);
                  setDescriptionValue('');
                }
              }}
            />
          </View>
        </View>

        <Text style={{color: 'white', fontSize: 22, fontWeight: '500'}}>
          Add To List
        </Text>
        <View
          style={{
            backgroundColor: colors.cardbg,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <VectorIcon
            iconName="plus"
            size={24}
            color="white"
            onPress={() => setShowCreateList(pre => !pre)}
          />

          <SelectTag
            data={listItem}
            onChange={({value}) => {
              setLIst(value);
            }}
            renderLeftIcon={() => null}
            value={list?.value}
          />
        </View>
        {showCreateList && (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TextInput
              placeholder="List name"
              multiline
              onChangeText={e => {
                let nd = {label: e, value: e};
                setNewList(nd);
              }}
              value={newList?.value}
              style={[styles.input, {width: '90%'}]}
              placeholderTextColor={'white'}
            />
            {newList?.value && (
              <View
                style={{
                  justifyContent: 'space-around',
                  marginLeft: 5,
                }}>
                <VectorIcon
                  iconName="close"
                  size={20}
                  color="red"
                  onPress={() => {
                    setNewList({});
                    setShowCreateList(false);
                  }}
                />
                <VectorIcon
                  iconName="check"
                  size={20}
                  color="green"
                  onPress={() => {
                    addList({data: newList, deviceId}, () => {
                      toast('list added');
                      getList(deviceId, e => {
                        setListItem(pre => [...pre, e]);
                      });
                    });
                    setNewList({});
                    setShowCreateList(false);
                  }}
                />
              </View>
            )}
          </View>
        )}

        <Text style={{color: 'white', fontSize: 20}}>Due Date</Text>
        <View style={{backgroundColor: colors.cardbg, padding: 20}}>
          <Text style={{color: colors.pirmary, fontSize: 20}}>
            {formatDateTime(dueDate)}
          </Text>
        </View>
        <DateTimePickerModal
          textColor="pink"
          isDarkModeEnabled={true}
          minimumDate={new Date()}
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleDateChange}
          onCancel={() => setDatePickerVisibility(false)}
          style={{backgroundColor: colors.pirmary}}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisibility(true)}>
          <VectorIcon
            iconName="date-range"
            iconPack="MaterialIcons"
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={addData}
          style={[
            styles.dateButton,
            {backgroundColor: data ? 'green' : '#6200ee'},
          ]}
          disabled={loading}>
          <VectorIcon iconName="check" size={24} color={'white'} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default CreateTodo;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6200ee',
    elevation: 2,
  },
  headerTitle: {
    fontWeight: '700',
    marginLeft: 20,
    fontSize: 20,
    color: 'white',
  },
  inputContainer: {
    margin: 10,
    flex: 1,
  },
  input: {
    color: 'white',
    fontSize: 18,
    padding: 20,
    marginVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors.pirmary,
  },
  addButton: {
    backgroundColor: 'purple',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    marginVertical: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#6200ee',
    borderRadius: 30,
    padding: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
