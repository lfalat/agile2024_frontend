import React, { createContext, useContext, useState, ReactNode } from "react";
import NotificationResponse from "../types/responses/NotificationResponse";

export enum NotificationType {
  General,
  GoalCreated,
  GoalUpdated,
  FeedbackUnsent,
  ReviewUnset,
  GoalUnsent,
  NewSuccession,
}

interface NotificationContextType {
  notifications: NotificationResponse[];
  addNotification: (notification: NotificationResponse) => void;
  setNotifications: (notifications: NotificationResponse[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotificationList] = useState<any[]>([]);

  const addNotification = (notification: any) => {
    setNotificationList((prevNotifications) => 
      [notification, ...prevNotifications].slice(0, 10)
    );
  };

  const setNotifications = (newNotifications: NotificationResponse[] | ((prev: NotificationResponse[]) => NotificationResponse[])) => {
    setNotificationList((prev) => {
      const updatedNotifications = typeof newNotifications === "function" ? newNotifications(prev) : newNotifications;
      return updatedNotifications.slice(0, 10);
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
