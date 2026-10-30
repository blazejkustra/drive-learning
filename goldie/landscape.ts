import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const globalModules = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
const goldieRoot = join(globalModules, 'goldie');
const { DEVICES, FRAMES, loadConfig, renderPreview, renderScreenshots, verify } = await import(pathToFileURL(join(goldieRoot, 'dist/index.js')).href);

type Size = { width: number; height: number };
type DeviceKey = 'iphone-6.9' | 'ipad-13';

const COPY_SCALE: Record<DeviceKey, number> = { 'iphone-6.9': 2.3, 'ipad-13': 2 };
const BEZEL: Record<DeviceKey, string> = { 'iphone-6.9': '17-pro-silver.png', 'ipad-13': 'ipad-pro-13-silver.png' };

const landscape = ({ width, height }: Size): Size => ({ width: height, height: width });

function isSideways(file: string): boolean {
  const size = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  const [width, height] = size.trim().split(',').map(Number);
  return height > width;
}

function rotateInPlace(file: string): void {
  if (!isSideways(file)) return;
  const temp = file.replace(/(\.\w+)$/, '.rotating$1');
  const quality = file.endsWith('.mp4') ? ['-c:v', 'libx264', '-crf', '12', '-preset', 'veryfast'] : [];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-vf', 'transpose=2', ...quality, temp]);
  renameSync(temp, file);
}

function rotateCaptures(rawDir: string): void {
  const manifest = JSON.parse(readFileSync(join(rawDir, 'manifest.json'), 'utf8'));
  for (const { file } of manifest.screenshots) rotateInPlace(file);
  for (const { file } of manifest.preview.clips) rotateInPlace(file);
}

function rotateBezel(device: DeviceKey, outDir: string): string {
  mkdirSync(outDir, { recursive: true });
  const rotated = join(outDir, BEZEL[device]);
  if (!existsSync(rotated)) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(goldieRoot, 'assets', BEZEL[device]), '-vf', 'transpose=2', '-pix_fmt', 'rgba', rotated]);
  }
  return rotated;
}

function useLandscape(device: DeviceKey): void {
  const spec = DEVICES[device];
  spec.native = landscape(spec.native);
  spec.screenshot = landscape(spec.screenshot);
  spec.preview = landscape(spec.preview);
  spec.copyScale = COPY_SCALE[device];
  const frame = FRAMES[device];
  FRAMES[device] = {
    width: frame.height,
    height: frame.width,
    screen: {
      x: frame.screen.y,
      y: frame.width - frame.screen.x - frame.screen.width,
      width: frame.screen.height,
      height: frame.screen.width,
    },
    screenRadius: frame.screenRadius,
  };
}

const cfg = await loadConfig(resolve(import.meta.dirname, 'goldie.config.ts'));
const devices = cfg.devices as DeviceKey[];
let allPassed = true;

for (const device of devices) {
  useLandscape(device);
  cfg.frame = { image: rotateBezel(device, join(cfg.outDir, 'bezels')) };
  for (const locale of cfg.locales) {
    rotateCaptures(join(cfg.outDir, 'raw', device, locale));
    await renderScreenshots(cfg, device, locale);
    await renderPreview(cfg, device, locale);
    allPassed = (await verify(cfg, device, locale)) && allPassed;
  }
}

rmSync(join(cfg.outDir, 'bezels'), { recursive: true });
process.exit(allPassed ? 0 : 1);
