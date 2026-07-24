"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";

function ThemeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="svg-icon"
      style={{
        width: "1em",
        height: "1em",
        verticalAlign: "middle",
      }}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      overflow="hidden"
      {...props}
    >
      <path d="M924.8 337.6A449.344 449.344 0 1096.512 686.4 449.344 449.344 0 00924.8 337.6zM476.032 882.24a368.768 368.768 0 01-227.072-107.2 371.968 371.968 0 010-525.952 369.152 369.152 0 01226.944-107.264v740.48zm298.944-633.216a361.397 361.397 0 0128.416 31.808l-255.36 255.36v-79.104l217.344-217.344a263.737 263.737 0 019.6 9.344zM835.456 328c9.856 17.28 18.304 35.328 25.216 54.016L547.968 694.592v-79.168L835.456 328zm42.304 116.032c4.16 22.4 6.208 45.184 6.272 67.968l-.064 5.12-336 335.872v-79.168L877.76 444.032zM721.408 204.416l-173.44 173.44v-79.232l123.136-123.072c17.536 8.32 34.304 17.92 50.304 28.864zm-107.904-50.432l-65.536 65.536v-77.824c22.208 2.176 44.16 6.272 65.536 12.288zm161.472 620.992a369.664 369.664 0 01-166.08 96.256l262.4-262.336a369.728 369.728 0 01-96.32 166.08z" />
    </svg>
  );
}

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="icon-xs"
      variant="outline"
      className="rounded-full"
    >
      <ThemeIcon />
    </Button>
  );
};
