import * as TaskManager from "expo-task-manager";

import { LocationAccuracy, LocationObject } from "expo-location";

import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

const TRACKING_BACKGROUND_TASK = "tracking-background-task";

const initTrackingBackgroundTask = () => {
  if (TaskManager.isTaskDefined(TRACKING_BACKGROUND_TASK)) {
    return;
  }

  TaskManager.defineTask(
    TRACKING_BACKGROUND_TASK,
    (body: TaskManager.TaskManagerTaskBody<object>) => {
      if (body.error) {
        console.error(body.error.message);
        return;
      }

      const data = body.data as unknown as { locations: LocationObject[] };

      const locations = data?.locations;

      if (!locations) {
        return;
      }

      for (const location of locations) {
        for (const callback of Object.values(locationCallbacks)) {
          callback(location);
        }
      }
    }
  );
};

initTrackingBackgroundTask();

const locationCallbacks: {
  [key: string]: React.Dispatch<
    React.SetStateAction<Location.LocationObject | null>
  >;
} = {};

function addLocationCallback(
  callback: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>
) {
  const id = v4() as string;

  locationCallbacks[id] = callback;

  return {
    remove: () => {
      delete locationCallbacks[id];
    },
  };
}


enableScreens(); 
const App = () => {
      return (
          <SafeAreaProvider>
          <NativeBaseProvider>
            <RootNavigator />
          </NativeBaseProvider>
          </SafeAreaProvider>
      )
  
};
export default App