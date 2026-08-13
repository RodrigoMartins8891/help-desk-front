import type {
  SystemSettings,
  ThemeMode,
} from "../types/settings";

function darkenHexColor(
  hex: string,
  amount = 25,
) {
  const normalized = hex.replace("#", "");
  const number = Number.parseInt(normalized, 16);

  const red = Math.max(
    0,
    (number >> 16) - amount,
  );

  const green = Math.max(
    0,
    ((number >> 8) & 0x00ff) - amount,
  );

  const blue = Math.max(
    0,
    (number & 0x0000ff) - amount,
  );

  return `#${[red, green, blue]
    .map((value) =>
      value.toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

function resolveTheme(theme: ThemeMode) {
  if (theme !== "system") {
    return theme;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

export function applyAppTheme(
  settings: Pick<
    SystemSettings,
    "theme" | "primaryColor"
  >,
) {
  const root = document.documentElement;

  root.style.setProperty(
    "--primary-color",
    settings.primaryColor,
  );

  root.style.setProperty(
    "--primary-color-hover",
    darkenHexColor(settings.primaryColor),
  );

  const theme = resolveTheme(settings.theme);

  root.classList.toggle(
    "dark",
    theme === "dark",
  );
}