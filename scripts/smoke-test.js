const fs = require('fs');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
const appSource = fs.readFileSync('App.js', 'utf8');

assert(packageJson.dependencies.expo, 'Expo dependency is missing.');
assert(
  packageJson.dependencies['@react-native-async-storage/async-storage'],
  'AsyncStorage dependency is missing.',
);
assert(appJson.expo.name === 'Task Flow', 'Expo app name should be Task Flow.');
assert(
  appJson.expo.android.package === 'com.fusionlearninghub.taskflowlite',
  'Android package name is not configured.',
);
assert(fs.existsSync('assets/icon.png'), 'Launcher icon is missing.');
assert(fs.existsSync('assets/adaptive-icon.png'), 'Adaptive icon is missing.');
assert(fs.existsSync('assets/splash.png'), 'Splash image is missing.');
assert(appSource.includes('AsyncStorage.getItem'), 'Task loading is missing.');
assert(appSource.includes('AsyncStorage.setItem'), 'Task saving is missing.');
assert(appSource.includes('function addTask'), 'Task creation is missing.');
assert(appSource.includes('function toggleTask'), 'Task completion toggle is missing.');
assert(appSource.includes('function deleteTask'), 'Task deletion is missing.');

console.log('Task Flow smoke test passed.');
