import { Subscription } from "expo-modules-core/build/EventEmitter";
import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";

type Hooks = {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
  sendPushNotification: (expoPushToken: string | undefined) => Promise<void>;
};

const usePushNotifications = (): Hooks => {
  //Push notification states
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription | undefined>();
  const responseListener = useRef<Subscription | undefined>();

  //Push notification checks
  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | undefined) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current !== undefined) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current !== undefined) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    //Sets permissions access to granted = true
    await Notifications.requestPermissionsAsync();
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    //Allows push notifications on Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C"
      });
    }

    return token;
  };

  const sendPushNotification = async (expoPushToken: string | undefined) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Success!",
      body: "You have sent yourself a push notification!",
      data: { someData: "My Data" }
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });
  };

  return {
    expoPushToken,
    notification,
    sendPushNotification
  };
};

export default usePushNotifications;
