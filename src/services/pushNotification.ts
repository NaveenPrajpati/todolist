import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

async function createNotificationChannel() {
  const channelId = 'default';

  // Delete the existing channel if it exists to update settings
  await notifee.deleteChannel(channelId);

  // Create the channel with new settings
  await notifee.createChannel({
    id: channelId,
    name: 'Default Channel',
    sound: 'ring1', // This should match the filename in res/raw without extension
  });

  return channelId;
}

export async function onDisplayNotification(task) {
  const dueTime = new Date(task.dueDate);
  const now = new Date();

  if (dueTime <= now) {
    console.error('Attempted to set a notification for a past time.');
    return; // Exit the function if the due date is not in the future
  }

  const channelId = await createNotificationChannel();
  const date5MinsBefore = new Date(dueTime.getTime() - 5 * 60 * 1000);

  const trigger1: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date5MinsBefore.getTime(),
  };
  const trigger2: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: dueTime.getTime(),
  };

  if (date5MinsBefore > now) {
    // Check if the 5 minutes before is also in the future
    await notifee.createTriggerNotification(
      {
        title: 'Reminder',
        body: `Your task '${task.text}' is due soon!`,
        android: {
          channelId,
          sound: 'ring1', // Custom sound specified
        },
      },
      trigger1,
    );
  }

  await notifee.createTriggerNotification(
    {
      title: 'Due Now',
      body: `Your task '${task.text}' is due now!`,
      android: {
        channelId,
        sound: 'ring1', // Custom sound specified
      },
    },
    trigger2,
  );
  // await notifee.createTriggerNotification(
  //   {
  //     title: 'Due Now',
  //     body: `Your task '${task.text}' is due now!`,
  //     android: {
  //       channelId,
  //       sound: 'ring1', // Custom sound specified
  //     },
  //   },
  //   {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: dueTime.getTime(),
  //   },
  // );
}
