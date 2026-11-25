import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef } from "react";
import { createSceneScope } from "@/shared/lib/scene-scope";
import { CameraRoll } from "./roll-view";
function ActionPreview({
  mode,
  progress,
}: {
  mode: "order" | "share" | "delete" | "album";
  progress: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const scope = createSceneScope();
    const demo = CameraRoll.mount(host.current, scope);
    demo.begin(mode);
    demo.seek(progress, mode);
    return () => scope.dispose();
  }, [mode, progress]);
  return (
    <div ref={host} style={{ width: 390, height: 844, position: "relative" }} />
  );
}
const meta = {
  title: "Widgets/Hero/Phone actions",
  component: ActionPreview,
  args: { mode: "order", progress: 0.55 },
  argTypes: {
    progress: { control: { type: "range", min: 0, max: 1.08, step: 0.01 } },
  },
} satisfies Meta<typeof ActionPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Shuffle: Story = {};
export const Share: Story = { args: { mode: "share", progress: 0.72 } };
export const Delete: Story = { args: { mode: "delete", progress: 0.72 } };
export const Albums: Story = { args: { mode: "album", progress: 0.78 } };
