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
  updatedData: {[x: string]: any; completed?: boolean},
) => {
  realm.write(() => {
    let task = realm.objectForPrimaryKey('Task', taskId);
    if (task) {
      Object.keys(updatedData).forEach(key => {
        task[key] = updatedData[key];
      });
    }
  });
};

const deleteTask = (realm: Realm, taskId: any) => {
  realm.write(() => {
    let task = realm.objectForPrimaryKey('Task', taskId);
    if (task) {
      realm.delete(task);
    }
  });
};

export {createTask, readTasks, updateTask, deleteTask};
