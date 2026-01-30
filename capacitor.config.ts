import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.codgalgame.game',
  appName: 'Cod Game',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
