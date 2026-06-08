# Task Flow

Task Flow is a small, mobile-friendly React Native task manager. It lets users add tasks, mark tasks complete, delete tasks, and keeps the task list on the device with AsyncStorage.

## Features

- Add tasks quickly from the home screen.
- Complete and reopen tasks.
- Delete tasks.
- Local persistence with `@react-native-async-storage/async-storage`.
- Clean single-screen mobile UI.
- Android APK build prepared through Expo prebuild and Gradle.

## Local Development

```bash
npm install
npm start
```

## Build An APK

```bash
npm install
npm run prebuild -- --clean
cd android
./gradlew assembleRelease
```

The APK is produced at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

GitHub Actions also builds and publishes `taskflowlite-v1.0.0.apk` when a tag beginning with `v` is pushed.
