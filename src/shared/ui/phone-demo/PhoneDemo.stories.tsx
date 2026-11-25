import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef } from "react";
import { createSceneScope } from "@/shared/lib/scene-scope";
import { MainFeedDemo } from "./feed";
function PhonePreview({ firstPhoto }: { firstPhoto: "dog" | "birthday" }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const scope = createSceneScope();
    MainFeedDemo.mount(host.current, scope, { firstPhoto });
    return () => scope.dispose();
  }, [firstPhoto]);
  return (
    <div ref={host} className="rv-canvas" style={{ position: "relative" }} />
  );
}
const meta = {
  title: "Shared/Phone demo",
  component: PhonePreview,
  args: { firstPhoto: "dog" },
} satisfies Meta<typeof PhonePreview>;
export default meta;
export const Opening: StoryObj<typeof meta> = {};
export const Finale: StoryObj<typeof meta> = {
  args: { firstPhoto: "birthday" },
};
