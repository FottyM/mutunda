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
  await page.goto("/writing/static-sites-are-operational-systems");

  await page.locator("#language-selector-trigger").click();
  await page.getByRole("menuitem", { name: /switch to Français/i }).click();

  await expect(page).toHaveURL(/\/fr\/writing\/static-sites-are-operational-systems\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { name: "Les sites statiques sont des systèmes opérationnels" })).toBeVisible();
});

test("not-found page returns visitors home", async ({ page }) => {
  await page.goto("/not-a-real-route");

  await expect(page.getByRole("link", { name: "Return home", exact: true })).toBeVisible();
});

test("localized writing renders only the selected language", async ({ page }) => {
  const listings = [
    {
      path: "/writing",
      lang: "en",
      title: "Static sites are operational systems",
      absent: "Les sites statiques sont des systèmes opérationnels",
    },
    {
      path: "/fr/writing",
      lang: "fr",
      title: "Les sites statiques sont des systèmes opérationnels",
      absent: "Staatilised veebisaidid on operatiivsed süsteemid",
    },
    {
      path: "/et/writing",
      lang: "et",
      title: "Staatilised veebisaidid on operatiivsed süsteemid",
      absent: "Static sites are operational systems",
    },
  ];

  for (const listing of listings) {
    await page.goto(listing.path);
    await expect(page.locator("html")).toHaveAttribute("lang", listing.lang);
    const content = page.locator("main");
    await expect(content.getByText(listing.title, { exact: true }).first()).toBeVisible();
    await expect(content.getByText(listing.absent, { exact: true })).toHaveCount(0);
  }
});

test("published work exposes its public routes and metadata", async ({ page }) => {
  await page.goto("/projects/ebola-tracker");
  await expect(page.getByRole("heading", { name: "Ebola Tracker" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://mutunda.me/projects/ebola-tracker/",
  );

  await page.goto("/about");
  const content = page.locator("main");
  await expect(content.getByText(/proud husband, dad, and Christian first/i)).toBeVisible();
  await expect(content.getByRole("link", { name: /LinkedIn/i })).toBeVisible();
});
