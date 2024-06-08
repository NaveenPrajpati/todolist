import {Realm, useRealm, useQuery} from '@realm/react';
import {ObjectId} from 'bson';
import {BSON} from 'realm';

type taskdata = {
  name: any;
  descriptions?: any;
  deviceId: any;
  category?: any;
  dueDate?: any;
  completed?: any;
  cb?: () => void;
};

const createTask = (realm: Realm, taskData: taskdata, cb: () => void) => {
  //   const {
  //     name,
  //     descriptions = [],
  //     deviceId = '',
  //     category = '',
  //     dueDate = '',
  //     completed = false,
  //   } = taskData;
  try {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        name: taskData.name,
        deviceId: taskData.deviceId || '',
        category: taskData.category || '',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        completed: taskData.completed || false,
        descriptions: taskData.descriptions || [],
        createdAt: Math.round(new Date().getTime() / 1000),
      });
    });
    cb();
  } catch (error) {
    console.log('error occur in adding data');
    cb();
  }
};

const readTasks = (realm: {objects: (arg0: string) => any}) => {
  return realm.objects('Task');
};

const updateTask = (
  realm: Realm,
  taskId: ObjectId,
  updatedData: taskdata,
  cb: () => void,
) => {
  try {
    realm.write(() => {
      let task = realm.objectForPrimaryKey('Task', taskId);
      if (task) {
        Object.keys(updatedData).forEach(key => {
          task[key] = updatedData[key];
        });
      }
    });
    cb();
  } catch (error) {
    console.log('error in updating data');
    cb();
  }
};

const deleteTask = (realm: Realm, taskIds) => {
  const idsArray = Array.from(taskIds);
  realm.write(() => {
    idsArray.forEach(id => {
      const objId = new Realm.BSON.ObjectId(id);
      console.log(objId);
      const itemToDelete = realm.objectForPrimaryKey('Task', objId);
      if (itemToDelete) {
        realm.delete(itemToDelete);
      }
    });
  });

  console.log('Items deleted from Realm');
};

export {createTask, readTasks, updateTask, deleteTask};
