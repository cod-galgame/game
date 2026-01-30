# Android CI (GitHub Actions)

This repository includes a GitHub Actions workflow `.github/workflows/android-build.yml` that builds an Android APK from the Vite web build using Capacitor.

## What it does
- Builds the web app (`pnpm run build:web`).
- Verifies `public/assets` were copied into `dist/assets`.
- Initializes Capacitor (if `android/` is absent) and adds Android.
- Copies web assets into the Android project and runs `./gradlew assembleRelease`.
- If you provide a keystore (base64-encoded), it will zipalign & sign the APK and upload the artifact.

## Required repository secrets (for signing)
- `ANDROID_KEYSTORE` - base64-encoded `.jks` file content (use `base64 release-keystore.jks | tr -d '\n'`)
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

If you don't supply keystore secrets, the workflow will still build the unsigned release APK and upload it.

## Usage
- Trigger via Actions tab, or push to `master`.
- Download `app-release.apk` from the workflow artifacts.

## Notes
- CI uses `npx cap init` the first time (if `android/` is not committed). If you prefer to commit `android/` into repo, you can run `npx cap init com.yourcompany.game "Your App" --web-dir dist` locally and commit the folder.
- Ensure `public/assets` contains all photos/videos so they are packaged into the app.
