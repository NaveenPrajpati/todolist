import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  FlatList,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Container from '../components/Container';
import {colors} from '../utils/styles';
import VectorIcon from '../components/VectorIcon';
import SelectTag from '../components/Dropdown';
import {MyContext} from '../../App';
import {
  formatDateTime,
  formatedDate,
  selectData,
  toast,
} from '../utils/utilityFunctions';
import {addList, getList} from '../services/lists';
import moment from 'moment';
import {addData, editTodo} from '../services/todos';
import DatePicker from 'react-native-date-picker';
import {createTask, updateTask} from '../services/CRUD';
import {useQuery, useRealm} from '@realm/react';
import {Task} from '../models/task';

const CreateTodo = ({navigation, route}) => {
  const {isEdit = false, item} = route.params;
  const [data, setData] = useState(isEdit ? item.name : '');
  const [loading, setLoading] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [category, setCategory] = useState('');
  const [newList, setNewList] = useState('');
  const [list, setLIst] = useState(
    isEdit ? {label: item.lists, value: item.lists} : '',
  );
  const [descriptions, setDescriptions] = useState(
    isEdit ? item.descriptions : [],
  );
  const [descriptionValue, setDescriptionValue] = useState('');
  const [dueDate, setDueDate] = useState(
    isEdit ? moment.unix(item.dueDate).toISOString() : '',
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {deviceId, setDeviceId} = useContext(MyContext);
  const [listItem, setListItem] = useState(selectData);
  const taskRef = useRef(null);

  const realm = useRealm();
  const taskList = useQuery(Task);

  const handleDateChange = (date: Date) => {
    const da = new Date(date);
    const timestamp = da.getTime() / 1000;
    console.log(timestamp);
    setDueDate(timestamp);

    setDatePickerVisibility(false);
  };

  function resetData() {
    setDescriptionValue('');
    setDescriptions([]);
    setData('');
    setDueDate('');
    setCategory('');
    setDatePickerVisibility(false);
  }

  const addDataTodo = async () => {
    createTask(
      realm,
      {
        name: data,
        descriptions,
        deviceId,
        category,
        dueDate,
        completed: false,
      },
      () => {
        navigation.goBack();

        resetData();
      },
    );
  };

  // useEffect(() => {
  //   taskRef.current.focus();
  //   getList(deviceId, e => {
  //     // console.log(JSON.stringify(e, null, 2));
  //     setListItem(pre => [...selectData, ...e]);
  //   });
  //   return () => resetData();
  // }, []);

  function updateData(id) {
    updateTask(
      realm,
      item._id,
      {
        name: data,
        descriptions,
        deviceId,
        category,
        dueDate,
        completed: false,
      },
      () => {
        resetData();
        navigation.goBack();
      },
    );
  }

  return (
    <Container>
      <View style={styles.inputContainer}>
        <View
          style={{
            backgroundColor: colors.cardbg,
            padding: 10,
            marginBottom: 5,
            borderRadius: 5,
            borderWidth: 0.2,
            borderColor: 'gray',
            elevation: 2,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TextInput
              ref={taskRef}
              placeholder="Add Your Task"
              multiline
              onChangeText={setData}
              value={data}
              style={[styles.input, {width: '90%'}]}
              placeholderTextColor={'white'}
            />
            {data && (
              <VectorIcon
                iconName="close"
                size={20}
                color={data ? 'red' : 'white'}
                onPress={() => setData('')}
              />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: 'gray', fontSize: 14, fontWeight: '500'}}>
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

          {descriptions.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <Text style={{color: 'white', fontSize: 14}}>
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
          ))}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}>
            <TextInput
              placeholder="Add Content"
              multiline
              onChangeText={setDescriptionValue}
              value={descriptionValue}
              style={[styles.input, {width: '95%'}]}
              placeholderTextColor={'white'}
            />

            {descriptionValue && (
              <VectorIcon
                iconName="check"
                size={20}
                color={'green'}
                onPress={() => {
                  if (descriptionValue) {
                    setDescriptions(pre => [...pre, descriptionValue]);
                    setDescriptionValue('');
                  }
                }}
              />
            )}
          </View>
        </View>

        {/* list section */}

        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
            marginTop: 5,
          }}>
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
              // console.log(value);
              setCategory(value);
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
              autoFocus
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

        {/* date section */}
        {dueDate && (
          <>
            <Text style={{color: 'white', fontSize: 16}}>Due Date</Text>
            <View
              style={{
                backgroundColor: colors.cardbg,
                padding: 20,
                alignItems: 'center',
                borderRadius: 5,
                borderWidth: 0.2,
                borderColor: 'gray',
                elevation: 2,
              }}>
              <Text
                style={{
                  color: colors.cardbg,
                  fontSize: 24,
                  fontWeight: '800',
                  backgroundColor: 'orange',
                  padding: 2,
                }}>
                {formatedDate(dueDate)}
              </Text>
            </View>
          </>
        )}
        {/* <DateTimePickerModal
          textColor="pink"
          isDarkModeEnabled={true}
          minimumDate={new Date()}
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleDateChange}
          onCancel={() => setDatePickerVisibility(false)}
          style={{backgroundColor: colors.pirmary}}
        /> */}

        <DatePicker
          modal
          mode="datetime"
          open={isDatePickerVisible}
          date={new Date()}
          onConfirm={handleDateChange}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            Keyboard.dismiss();
            setDatePickerVisibility(true);
          }}>
          <VectorIcon
            iconName="date-range"
            iconPack="MaterialIcons"
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (isEdit) updateData(item.id);
            else addDataTodo();
          }}
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
    padding: 10,
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
