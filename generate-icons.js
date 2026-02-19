const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceLogo = path.join(__dirname, 'assets', 'logo.png');

// Android icon sizes (mipmap folders)
const androidSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

// iOS icon sizes
const iosSizes = [
  { name: 'Icon-20@2x.png', size: 40 },
  { name: 'Icon-20@3x.png', size: 60 },
  { name: 'Icon-29@2x.png', size: 58 },
  { name: 'Icon-29@3x.png', size: 87 },
  { name: 'Icon-40@2x.png', size: 80 },
  { name: 'Icon-40@3x.png', size: 120 },
  { name: 'Icon-60@2x.png', size: 120 },
  { name: 'Icon-60@3x.png', size: 180 },
  { name: 'Icon-1024.png', size: 1024 }
];

async function generateIcons() {
  console.log('🎨 Generating app icons from logo.png at 100% zoom...\n');

  // Generate Android icons
  console.log('📱 Generating Android icons...');
  for (const { folder, size } of androidSizes) {
    const outputDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', folder);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'ic_launcher.png');
    const outputRoundFile = path.join(outputDir, 'ic_launcher_round.png');
    
    // Generate square icon with nearest neighbor (no interpolation)
    await sharp(sourceLogo)
      .resize(size, size, { kernel: 'nearest' })
      .png()
      .toFile(outputFile);
    
    // Generate round icon
    const roundedCorners = Buffer.from(
      `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}"/></svg>`
    );
    
    await sharp(sourceLogo)
      .resize(size, size, { kernel: 'nearest' })
      .composite([{
        input: roundedCorners,
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputRoundFile);
    
    console.log(`  ✓ ${folder}: ${size}x${size}px`);
  }

  // Generate iOS icons
  console.log('\n🍎 Generating iOS icons...');
  const iosIconDir = path.join(__dirname, 'ios', 'Taqwim', 'Images.xcassets', 'AppIcon.appiconset');

  if (!fs.existsSync(iosIconDir)) {
    fs.mkdirSync(iosIconDir, { recursive: true });
  }

  for (const { name, size } of iosSizes) {
    const outputFile = path.join(iosIconDir, name);
    await sharp(sourceLogo)
      .resize(size, size, { kernel: 'nearest' })
      .png()
      .toFile(outputFile);
    console.log(`  ✓ ${name}: ${size}x${size}px`);
  }

  return iosIconDir;
}

generateIcons().then((iosIconDir) => {
  // Create iOS Contents.json
  const contentsJson = {
    "images": [
      { "size": "20x20", "idiom": "iphone", "filename": "Icon-20@2x.png", "scale": "2x" },
      { "size": "20x20", "idiom": "iphone", "filename": "Icon-20@3x.png", "scale": "3x" },
      { "size": "29x29", "idiom": "iphone", "filename": "Icon-29@2x.png", "scale": "2x" },
      { "size": "29x29", "idiom": "iphone", "filename": "Icon-29@3x.png", "scale": "3x" },
      { "size": "40x40", "idiom": "iphone", "filename": "Icon-40@2x.png", "scale": "2x" },
      { "size": "40x40", "idiom": "iphone", "filename": "Icon-40@3x.png", "scale": "3x" },
      { "size": "60x60", "idiom": "iphone", "filename": "Icon-60@2x.png", "scale": "2x" },
      { "size": "60x60", "idiom": "iphone", "filename": "Icon-60@3x.png", "scale": "3x" },
      { "size": "1024x1024", "idiom": "ios-marketing", "filename": "Icon-1024.png", "scale": "1x" }
    ],
    "info": { "version": 1, "author": "xcode" }
  };

  fs.writeFileSync(
    path.join(iosIconDir, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );

  console.log('\n✅ All icons generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('  1. For Android: Icons are ready in android/app/src/main/res/mipmap-* folders');
  console.log('  2. For iOS: Icons are ready in ios/Taqwim/Images.xcassets/AppIcon.appiconset/');
  console.log('  3. Rebuild your app to see the new icon');
  console.log('\nCommands to rebuild:');
  console.log('  Android: npm run android');
  console.log('  iOS: npm run ios');
}).catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
