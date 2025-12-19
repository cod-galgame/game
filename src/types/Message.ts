export interface MessageProps {
  content: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
