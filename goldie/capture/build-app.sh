#!/bin/sh
set -e
cd "$(dirname "$0")/../.."

RELEASE_APP=ios/DerivedData/Build/Products/Release-iphonesimulator/App.app
CAPTURE_APP=goldie/out/capture-app/App.app

npm run build
npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' -derivedDataPath ios/DerivedData CODE_SIGNING_ALLOWED=NO -quiet build

NODE_ENV=development npx vite build --config goldie/capture/vite.config.ts
rm -rf "$CAPTURE_APP"
mkdir -p "$(dirname "$CAPTURE_APP")"
cp -R "$RELEASE_APP" "$CAPTURE_APP"
rm -rf "$CAPTURE_APP/public/assets"
cp -R goldie/out/capture-web/ "$CAPTURE_APP/public/"
