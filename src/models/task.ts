import {Realm} from '@realm/react';
import {BSON, ObjectSchema} from 'realm';
export class Task extends Realm.Object<Task> {
  _id!: BSON.ObjectId;
  name!: string;
  completed?: boolean;
  deviceId?: string;
  descriptions?: string[];
  createdAt: number = Math.round(new Date().getTime() / 1000);
  category?: string;
  dueDate?: Date;

  static schema: ObjectSchema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      deviceId: {type: 'string', optional: true, indexed: 'full-text'},
      name: {type: 'string', indexed: 'full-text'},
      category: {type: 'string', optional: true},
      completed: {type: 'bool', optional: true},
      dueDate: {type: 'date', optional: true},
      descriptions: {type: 'list', objectType: 'string', optional: true},
      createdAt: {
        type: 'int',
        default: () => Math.round(new Date().getTime() / 1000),
      },
    },
    primaryKey: '_id',
  };
}
