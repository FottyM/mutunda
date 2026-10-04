import { expect, test } from "@playwright/test";

test("primary navigation uses client-side routing", async ({ page }) => {
  await page.goto("/");

  for (const destination of [
    { name: "Projects", path: "/projects" },
    { name: "Writing", path: "/writing" },
    { name: "About", path: "/about" },
  ]) {
    await page.getByRole("link", { name: destination.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${destination.path}/?$`));
    await expect(page.getByRole("link", { name: destination.name, exact: true })).toHaveAttribute("aria-current", "page");
  }
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

test("localized not-found pages retain their language and recovery route", async ({ page }) => {
  for (const pageInfo of [
    { path: "/fr/404", lang: "fr", heading: "Page introuvable" },
    { path: "/et/404", lang: "et", heading: "Lehte ei leitud" },
  ]) {
    await page.goto(pageInfo.path);
    await expect(page.locator("html")).toHaveAttribute("lang", pageInfo.lang);
    await expect(page.getByRole("heading", { name: pageInfo.heading })).toBeVisible();
    await expect(page.locator("main").getByRole("link")).toHaveAttribute("href", pageInfo.lang === "fr" ? "/fr" : "/et");
  }
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

test("writing, tags, and the style guide are navigable public pages", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.getByRole("heading", { name: "Field notes" })).toBeVisible();
  await page.getByRole("link", { name: "Static sites are operational systems", exact: true }).first().click();
  await expect(page).toHaveURL(/\/writing\/static-sites-are-operational-systems\/?$/);
  await expect(page.getByRole("article")).toContainText("Content is an interface");

  await page.goto("/writing/tags/architecture");
  await expect(page.getByRole("main")).toContainText("Static sites are operational systems");

  await page.goto("/style-guide");
  await expect(page.getByText("Technical field journal", { exact: true })).toBeVisible();
  await expect(page.locator("main .button--primary")).toBeVisible();
});

test("public pages expose canonical and social metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mutunda.me/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Fortunat Mutunda — Software Engineer");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/site.webmanifest");

  await page.goto("/writing/static-sites-are-operational-systems");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
});

test("project cards and technology tags navigate seamlessly", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();

  const techTag = page.locator(".project-list .card .tag").first();
  await expect(techTag).toBeVisible();

  // Clicking on the tag passes pointer events through to the underlying card link
  await techTag.click({ force: true });
  await expect(page).toHaveURL(/\/projects\/ebola-tracker\/?$/);
  await expect(page.getByRole("heading", { name: "Ebola Tracker" })).toBeVisible();
});

test("case studies provide top and footer back buttons returning to selected work", async ({ page }) => {
  await page.goto("/projects/ebola-tracker");

  const topBackLink = page.locator(".case-study__header .back-link");
  await expect(topBackLink).toBeVisible();
  await expect(topBackLink).toHaveText(/Back to selected work/);

  const footerBackButton = page.locator(".case-study__footer a");
  await expect(footerBackButton).toBeVisible();
  await expect(footerBackButton).toHaveText(/Back to selected work/);

  await footerBackButton.click();
  await expect(page).toHaveURL(/\/projects\/?$/);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();

  await page.goto("/fr/projects/ebola-tracker");
  const frenchBackLink = page.locator(".case-study__header .back-link");
  await expect(frenchBackLink).toHaveText(/Retour à la sélection de projets/);
  await frenchBackLink.click();
  await expect(page).toHaveURL(/\/fr\/projects\/?$/);
  await expect(page.getByRole("heading", { name: "Sélection de projets" })).toBeVisible();
});

test("GraphQL field note renders in English, French, and Estonian with footnotes and back links", async ({ page }) => {
  await page.goto("/writing/graphql-over-the-cliff");
  await expect(page.getByRole("heading", { name: "I loved GraphQL until I had to debug it" })).toBeVisible();
  await expect(page.locator(".back-link")).toHaveText(/Back to field notes/);
  await expect(page.locator("[data-footnote-ref]").first()).toBeVisible();

  await page.goto("/fr/writing/graphql-over-the-cliff");
  await expect(page.getByRole("heading", { name: "J'aimais GraphQL, jusqu'au jour où j'ai dû le déboguer" })).toBeVisible();
  await expect(page.locator(".back-link")).toHaveText(/Retour aux notes de terrain/);

  await page.goto("/et/writing/graphql-over-the-cliff");
  await expect(page.getByRole("heading", { name: "Mulle meeldis GraphQL, kuni pidin seda siluma" })).toBeVisible();
  await expect(page.locator(".back-link")).toHaveText(/Tagasi väljamärkmete juurde/);
});
