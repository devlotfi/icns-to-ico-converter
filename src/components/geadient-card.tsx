import { cn } from "@heroui/react";
import { useContext, type ComponentProps } from "react";
import { ThemeContext } from "../context/theme-context";
import { ThemeOptions } from "../types/theme-options";

export default function GradientCard({
  className,
  style,
  children,
  ...props
}: ComponentProps<"div">) {
  const { appliedTheme } = useContext(ThemeContext);

  return (
    <div
      className={cn("flex max-w-screen-md p-[1rem] rounded-3xl", className)}
      style={{
        boxShadow:
          appliedTheme === ThemeOptions.LIGHT
            ? "inset 0 0 10px hsl(var(--heroui-content1) / 1)"
            : "inset 0 0 10px hsl(var(--heroui-divider) / 1)",
        backgroundImage:
          "radial-gradient(at bottom, hsl(var(--heroui-primary) / 0.1), transparent 70%), linear-gradient(to top, hsl(var(--heroui-content1) / 1), hsl(var(--heroui-content2) / 1))",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
