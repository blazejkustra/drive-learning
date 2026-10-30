import { defineConfig } from 'vite';

const injectStage = {
  name: 'inject-capture-stage',
  transformIndexHtml: {
    order: 'pre' as const,
    handler: (html: string) => html.replace('<script type="module" src="/src/main.ts">', '<script type="module" src="/goldie/capture/stage.ts"></script>\n    <script type="module" src="/src/main.ts">'),
  },
};

export default defineConfig({
  base: './',
  plugins: [injectStage],
  build: { outDir: 'goldie/out/capture-web', emptyOutDir: true },
});
