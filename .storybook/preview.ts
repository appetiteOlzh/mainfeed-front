import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";
const preview: Preview = {
  parameters: { layout: "centered", nextjs: { appDirectory: true } },
};
export default preview;
