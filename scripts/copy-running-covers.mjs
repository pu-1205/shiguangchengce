/**
 * 将 dist/covers 中抖音导出的 *_cover.jpg 同步为 public/covers 下
 * 与 store 中一致的短文件名。开发时静态资源须放在 public 才会被 Vite 正确加载。
 * 用法：将 5 张新图放入 dist/covers 后执行：npm run copy-covers
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distCovers = join(root, 'dist', 'covers');
const pubCovers = join(root, 'public', 'covers');

/** 唯一匹配规则：同一条只应命中 dist/covers 中一个 jpg 文件名 */
const RULES = [
  { to: 'running-r1-beginner.jpg', test: (n) => n.startsWith('2022-06-16_') && n.includes('初跑者') && n.endsWith('.jpg') },
  { to: 'running-r2-hip-5min.jpg', test: (n) => n.includes('5分钟教会你跑步送髋') && n.endsWith('.jpg') },
  { to: 'running-r3-form-matters.jpg', test: (n) => n.startsWith('2020-08-18_') && n.includes('健身指南') && n.endsWith('.jpg') },
  { to: 'running-r4-jog-hip.jpg', test: (n) => n.startsWith('2026-03-14_') && n.includes('免费学送髋') && n.endsWith('.jpg') },
  { to: 'running-r6-posture-fix.jpg', test: (n) => n.startsWith('2026-01-30_') && n.includes('跑姿解码室') && n.endsWith('.jpg') },
];

if (!existsSync(distCovers)) {
  console.error('缺少 dist/covers。');
  process.exit(1);
}
mkdirSync(pubCovers, { recursive: true });

const files = readdirSync(distCovers);
let ok = 0;

for (const { to, test } of RULES) {
  const hits = files.filter(test);
  if (hits.length !== 1) {
    console.warn('规则未唯一定位文件，跳过 →', to, '命中:', hits);
    continue;
  }
  const src = join(distCovers, hits[0]);
  const dest = join(pubCovers, to);
  copyFileSync(src, dest);
  console.log('已同步:', to, '←', hits[0]);
  ok++;
}

if (ok < RULES.length) {
  console.warn(`仅完成 ${ok}/${RULES.length} 个。请核对面图是否在 dist/covers 且与预期抖音导出一致。`);
}
if (ok === 0) {
  process.exit(1);
}

console.log('完成。');
