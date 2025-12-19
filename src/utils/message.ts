import type { MessageProps } from '@/types/Message';

let messageContainerInstance: any = null;

export function setMessageContainer(instance: any) {
  messageContainerInstance = instance;
}

export const Message = {
  success(content: string, duration?: number) {
    if (messageContainerInstance) {
      messageContainerInstance.addMessage({
        content,
        type: 'success',
        duration
      } as MessageProps);
    }
  },

  error(content: string, duration?: number) {
    if (messageContainerInstance) {
      messageContainerInstance.addMessage({
        content,
        type: 'error',
        duration
      } as MessageProps);
    }
  },

  info(content: string, duration?: number) {
    if (messageContainerInstance) {
      messageContainerInstance.addMessage({
        content,
        type: 'info',
        duration
      } as MessageProps);
    }
  },

  warning(content: string, duration?: number) {
    if (messageContainerInstance) {
      messageContainerInstance.addMessage({
        content,
        type: 'warning',
        duration
      } as MessageProps);
    }
  }
};
