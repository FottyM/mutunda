import { expect, test } from "@playwright/test";

test("primary navigation uses client-side routing", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Projects" }).click();

  await expect(page).toHaveURL(/\/projects\/?$/);
  await expect(page.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
});

test("command palette supports its keyboard shortcut and selection", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Control+Shift+P");
  const dialog = page.getByRole("dialog");
  const input = page.locator("#command-palette-input");

  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(input).not.toHaveAttribute("aria-activedescendant", "");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("theme preference survives client-side navigation", async ({ page }) => {
  await page.goto("/");

  await page.locator("#theme-toggle").click();
  await page.locator('[data-theme-set="light"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects\/?$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("language selection retains the equivalent route", async ({ page }) => {
  await page.goto("/about");

  await page.locator("#language-selector-trigger").click();
  await page.getByRole("menuitem", { name: /switch to Français/i }).click();

  await expect(page).toHaveURL(/\/fr\/about\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("not-found page returns visitors home", async ({ page }) => {
  await page.goto("/not-a-real-route");

  await expect(page.getByRole("link", { name: "Return home", exact: true })).toBeVisible();
});
