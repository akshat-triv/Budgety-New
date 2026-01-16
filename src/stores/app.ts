import { NotificationTypes } from '@/types/application.types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const notifications = ref<
    Array<{ id: number; message: string; type: NotificationTypes }>
  >([]);

  function addNotification(message: string, type: NotificationTypes) {
    const id = Date.now();
    notifications.value.push({ id, message, type });

    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(
      (notification) => notification.id !== id
    );
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  };
});
