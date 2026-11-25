import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StoreButtons } from "./StoreButtons";
const meta = {
  title: "Shared/Store buttons",
  component: StoreButtons,
} satisfies Meta<typeof StoreButtons>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Narrow: StoryObj<typeof meta> = {
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};
