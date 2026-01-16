<script lang="ts" setup>
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';
import Cross from '@/components/icons/CrossIcon.vue';
import CheckCircled from '@/components/icons/CheckCircled.vue';
import InfoCircled from '@/components/icons/InfoCircled.vue';
import { NotificationTypes } from '@/types/application.types';

// Notifications coming in
const appStore = useAppStore();
const notifications = computed(() => appStore.notifications);

function removeNotification(notificationId: number) {
  appStore.removeNotification(notificationId);
}

// Notification Icon
const getNotificationIcon = (type: NotificationTypes) => {
  if (type === 'success') return CheckCircled;
  return InfoCircled;
};
</script>

<template>
  <div class="notification-wrapper">
    <div
      v-for="(notification, notificationKey) of notifications"
      :key="`notification-${notificationKey}`"
      class="notification-card"
      :class="notification.type"
    >
      <component
        :is="getNotificationIcon(notification.type)"
        title=""
        class="notification-card-icon"
      />
      <span class="notification-card-text">
        {{ notification.message }}
      </span>
      <cross
        title="cancel"
        class="notification-card-close-icon"
        @click="removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  &-wrapper {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    background: transparent;
    z-index: 10;
  }

  &-card {
    position: relative;
    width: 38rem;
    background: var(--vt-c-bg);
    box-shadow: var(--vt-shadow-3);
    padding: 1.2rem 1.4rem;
    border-radius: 4px;
    display: flex;
    align-items: center;

    @media screen and (max-width: 400px) {
      width: 30rem;
    }

    &:not(:last-child) {
      margin-bottom: 2rem;
    }

    &.success {
      background-color: var(--vt-c-green-opacity-7);
    }

    &.error {
      background-color: var(--vt-c-red-dark-opacity-7);
    }

    &.info {
      background-color: var(--vt-c-blue-opacity-7);
    }

    &.warning {
      background-color: var(--vt-c-yellow-light);
    }

    &-text {
      font-size: 1.4rem;
      color: var(--color-text);
      flex: 0 0 84%;
      line-height: 2rem;
      margin-right: auto;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &-close-icon {
      width: 1.4rem;
      height: 1.4rem;

      &:hover {
        cursor: pointer;
      }
    }

    &-icon {
      width: 1.4rem;
      height: 1.4rem;
      margin-right: 1.2rem;
    }
  }
}
</style>
