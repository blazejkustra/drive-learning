import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blazejkustra.drivelearning',
  appName: 'Drive Practice',
  webDir: 'dist',
  backgroundColor: '#1b222b',
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
    backgroundColor: '#1b222b',
  },
};

export default config;
