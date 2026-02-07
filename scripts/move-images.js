const fs = require('fs');
const path = require('path');

const files = [
  { src: 'uploaded_media_0_1770441729116.png', dest: 'ordbomben.png' },
  { src: 'uploaded_media_1_1770441729116.png', dest: 'dump.png' },
  { src: 'uploaded_media_2_1770441729116.png', dest: 'lettus.png' }
];

const srcDir = 'C:\\Users\\lin4s\\.gemini\\antigravity\\brain\\5fcf31b8-a4c9-4133-a0bd-d5a876e7e97f';
const destDir = 'C:\\Users\\lin4s\\portfolio-app-NEXT-LEVEL\\public\\projects';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
  const srcPath = path.join(srcDir, file.src);
  const destPath = path.join(destDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file.src} to ${file.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
