# App Icon Setup

Your app icon has been successfully configured using `assets/logo.png` at 100% zoom (nearest neighbor scaling, no interpolation).

## Generated Icons

### Android
Icons generated in all required densities:
- `mipmap-mdpi`: 48x48px
- `mipmap-hdpi`: 72x72px
- `mipmap-xhdpi`: 96x96px
- `mipmap-xxhdpi`: 144x144px
- `mipmap-xxxhdpi`: 192x192px

Both square (`ic_launcher.png`) and round (`ic_launcher_round.png`) variants created.

### iOS
Icons generated for all required sizes:
- iPhone notification icons (20pt @2x, @3x)
- iPhone settings icons (29pt @2x, @3x)
- iPhone spotlight icons (40pt @2x, @3x)
- iPhone app icons (60pt @2x, @3x)
- App Store icon (1024x1024px)

## Regenerating Icons

If you update `assets/logo.png`, regenerate all icons with:

```bash
npm run generate-icons
```

Then rebuild your app:

```bash
# Android
npm run android

# iOS
npm run ios
```

## Technical Details

- Scaling method: Nearest neighbor (no interpolation/smoothing)
- Source: `assets/logo.png`
- Android config: `android/app/src/main/AndroidManifest.xml`
- iOS config: `ios/Taqwim/Images.xcassets/AppIcon.appiconset/Contents.json`
