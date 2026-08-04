import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const publicDirectory = path.join(process.cwd(), 'public');
const MB = 1024 * 1024;

const budgets = [
  {
    label: 'background video',
    matches: (relativePath) => relativePath.startsWith('video/'),
    maxBytes: 2 * MB,
  },
  {
    label: 'project preview video',
    matches: (relativePath) => relativePath.startsWith('projects/videos/'),
    maxBytes: 22 * MB,
  },
  {
    label: 'audio product video',
    matches: (relativePath) => relativePath.startsWith('audio/products/') && /\.(mp4|webm)$/i.test(relativePath),
    maxBytes: 5 * MB,
  },
  {
    label: 'audio file',
    matches: (relativePath) => /\.(mp3|wav|ogg|m4a)$/i.test(relativePath),
    maxBytes: 10 * MB,
  },
  {
    label: 'image',
    matches: (relativePath) => /\.(avif|gif|jpe?g|png|webp)$/i.test(relativePath),
    maxBytes: 2 * MB,
  },
  {
    label: '3D asset',
    matches: (relativePath) => /\.(glb|gltf|obj|mtl)$/i.test(relativePath),
    maxBytes: 1 * MB,
  },
];

const totalPublicBudget = 105 * MB;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
    })
  );
  return nested.flat();
}

const files = await collectFiles(publicDirectory);
const measured = await Promise.all(
  files.map(async (absolutePath) => {
    const details = await stat(absolutePath);
    return {
      absolutePath,
      relativePath: path.relative(publicDirectory, absolutePath).replaceAll('\\', '/'),
      size: details.size,
    };
  })
);

const failures = [];
for (const file of measured) {
  const budget = budgets.find((candidate) => candidate.matches(file.relativePath));
  if (budget && file.size > budget.maxBytes) {
    failures.push(
      `${file.relativePath} is ${(file.size / MB).toFixed(2)} MB; ${budget.label} budget is ${(budget.maxBytes / MB).toFixed(0)} MB.`
    );
  }
}

const totalSize = measured.reduce((sum, file) => sum + file.size, 0);
if (totalSize > totalPublicBudget) {
  failures.push(
    `public/ totals ${(totalSize / MB).toFixed(2)} MB; repository asset budget is ${(totalPublicBudget / MB).toFixed(0)} MB.`
  );
}

if (failures.length > 0) {
  console.error('Performance budget failed:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Performance budget passed: ${measured.length} assets, ${(totalSize / MB).toFixed(2)} MB total.`);
}
