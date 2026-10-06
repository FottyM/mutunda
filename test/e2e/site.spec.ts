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
  await expect(page.locator("#command-palette-trigger")).toBeVisible();

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

test("header search trigger displays search icon, shortcut tip badge, and collapses on mobile", async ({ page, isMobile }) => {
  await page.goto("/");
  const trigger = page.locator("#command-palette-trigger");
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute("title", /Search.*\(.*K\)/i);
  await expect(trigger.locator("svg")).toHaveClass(/lucide-search/);

  const kbdBadge = trigger.locator(".command-palette-trigger__kbd");
  if (isMobile) {
    await expect(kbdBadge).toBeHidden();
  } else {
    await expect(kbdBadge).toBeVisible();
    await expect(kbdBadge).toContainText("K");

    // Mobile viewport: shortcut tip collapses quietly to square button
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(kbdBadge).toBeHidden();

    // Reset viewport for desktop
    await page.setViewportSize({ width: 1280, height: 800 });
  }

  await trigger.click();
  const dialog = page.locator("#command-palette-dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("#command-palette-input")).toBeFocused();
});

test("command palette orders groups with field notes and selected work below navigation, actions, languages", async ({ page }) => {
  await page.goto("/");
  await page.locator("#command-palette-trigger").click();
  const dialog = page.locator("#command-palette-dialog");
  await expect(dialog).toBeVisible();

  const groups = page.locator("#command-palette-list > .command-palette__group");
  const groupNames = await groups.evaluateAll((list) =>
    list.map((el) => el.getAttribute("data-group"))
  );
  expect(groupNames).toEqual(["nav", "actions", "languages", "writing", "projects", "external"]);
});

test("command palette highlights items on cursor hover and synchronizes active selection", async ({ page, isMobile }) => {
  if (isMobile) return;
  await page.goto("/");
  await page.locator("#command-palette-trigger").click();
  const dialog = page.locator("#command-palette-dialog");
  await expect(dialog).toBeVisible();

  const secondItem = page.locator(".command-palette__item").nth(1);
  await expect(secondItem).not.toHaveClass(/is-active/);

  await secondItem.hover();
  await expect(secondItem).toHaveClass(/is-active/);
  await expect(secondItem).toHaveAttribute("aria-selected", "true");
  const secondItemId = await secondItem.getAttribute("id");
  await expect(page.locator("#command-palette-input")).toHaveAttribute("aria-activedescendant", secondItemId || "");
});

test("command palette searches and navigates field notes with query highlighting", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  const input = page.locator("#command-palette-input");
  await input.fill("GraphQL");

  const groupHeader = page.locator('.command-palette__group-title:has-text("Field Notes")');
  await expect(groupHeader).toBeVisible();

  const noteItem = page.locator('[data-palette-item^="writing-graphql-over-the-cliff"]');
  await expect(noteItem).toBeVisible();
  await expect(noteItem.locator("mark").first()).toContainText(/graphql/i);

  await noteItem.click();
  await expect(page).toHaveURL(/\/writing\/graphql-over-the-cliff\/?$/);
});

test("command palette searches full article body (e.g. Wolff) and displays matching excerpt", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  const input = page.locator("#command-palette-input");
  await input.fill("Wolff");

  const noteItem = page.locator('[data-palette-item^="writing-graphql-over-the-cliff"]');
  await expect(noteItem).toBeVisible();
  await expect(noteItem.locator(".command-palette__item-desc")).toContainText(/Wolff/i);
  await expect(noteItem.locator("mark")).toContainText(/Wolff/i);

  await noteItem.click();
  await expect(page).toHaveURL(/\/writing\/graphql-over-the-cliff\/?$/);
});

test("command palette initially shows only the latest 2 field notes and 1 project, expanding on search", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");

  const writingItems = page.locator('[data-group="writing"] .command-palette__item:visible');
  await expect(writingItems).toHaveCount(2);

  const projectItems = page.locator('[data-group="projects"] .command-palette__item:visible');
  await expect(projectItems).toHaveCount(1);

  // Older note is hidden initially
  const olderNote = page.locator('[data-palette-item="writing-static-sites-are-operational-systems"]');
  await expect(olderNote).toBeHidden();

  // Searching reveals the older note
  const input = page.locator("#command-palette-input");
  await input.fill("operational");
  await expect(olderNote).toBeVisible();

  // Clearing the query restores the 2-item limit
  await input.fill("");
  await expect(writingItems).toHaveCount(2);
  await expect(olderNote).toBeHidden();
});

test("command palette searches and navigates selected work case studies", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  const input = page.locator("#command-palette-input");
  await input.fill("Ebola");

  const groupHeader = page.locator('.command-palette__group-title:has-text("Selected Work")');
  await expect(groupHeader).toBeVisible();

  const projectItem = page.locator('[data-palette-item^="project-ebola-tracker"]');
  await expect(projectItem).toBeVisible();

  await projectItem.click();
  await expect(page).toHaveURL(/\/projects\/ebola-tracker\/?$/);
});

test("command palette preserves active locale and searches localized content", async ({ page }) => {
  await page.goto("/fr");
  const frTrigger = page.locator("#command-palette-trigger");
  await expect(frTrigger).toHaveAttribute("title", /Rechercher.*\(.*K\)/i);

  await frTrigger.click();
  const input = page.locator("#command-palette-input");
  await input.fill("GraphQL");

  const frNoteItem = page.locator('[data-palette-item^="writing-graphql-over-the-cliff"]');
  await expect(frNoteItem).toBeVisible();
  await expect(frNoteItem).toContainText("Comment mon amour pour GraphQL");

  await frNoteItem.click();
  await expect(page).toHaveURL(/\/fr\/writing\/graphql-over-the-cliff\/?$/);
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

test("GraphQL field note renders in English, French, and Estonian with back links", async ({ page }) => {
  await page.goto("/writing/graphql-over-the-cliff");
  await expect(page.getByRole("heading", { name: "How my love for GraphQL fell off a cliff" })).toBeVisible();
  await expect(page.locator(".back-link")).toHaveText(/Back to field notes/);
  await expect(page.locator(".prose")).toContainText(/I do not fancy that a single moment/);
  await expect(page.locator(".prose")).toContainText("strong-remoting");

  await page.goto("/fr/writing/graphql-over-the-cliff");
  await expect(page.getByRole("heading", { name: "Comment mon amour pour GraphQL est tombé de la falaise" })).toBeVisible();
  await expect(page.locator(".back-link")).toHaveText(/Retour aux notes de terrain/);

  await page.goto("/et/writing/graphql-over-the-cliff");
  await expect(page.getByRole("heading", { name: "Kuidas mu armastus GraphQL-i vastu kaljult alla kukkus" })).toBeVisible();
  await expect(page.locator(".back-link")).toHaveText(/Tagasi väljamärkmete juurde/);
});

test("site header is isolated from body route transitions to prevent navigation flicker", async ({ page }) => {
  await page.goto("/");

  const headerTransitionName = await page.locator(".site-header").evaluate((el) => {
    return window.getComputedStyle(el).viewTransitionName;
  });
  expect(headerTransitionName).toBe("site-header");

  const mainTransitionName = await page.locator("main").evaluate((el) => {
    return window.getComputedStyle(el).viewTransitionName;
  });
  expect(mainTransitionName).toBe("main-content");

  const headerZIndex = await page.locator(".site-header").evaluate((el) => {
    return window.getComputedStyle(el).zIndex;
  });
  expect(headerZIndex).toBe("20");

  // Verify smooth client-side navigation with stable header
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/?$/);
  await expect(page.locator(".site-header nav a[aria-current='page']")).toHaveText("Projects");

  await page.getByRole("link", { name: "Writing", exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/?$/);
  await expect(page.locator(".site-header nav a[aria-current='page']")).toHaveText("Writing");
});

test("editorial images render with progressive blur-up and gradual resolution", async ({ page }) => {
  // 1. About page portrait
  await page.goto("/about");
  const portraitContainer = page.locator(".profile-portrait .progressive-image");
  await expect(portraitContainer).toBeVisible();
  const portraitPlaceholder = portraitContainer.locator(".progressive-image__placeholder");
  await expect(portraitPlaceholder).toHaveAttribute("src", /(_image\?.*f=webp|\/_astro\/.*\.webp)/);
  const portraitPicture = portraitContainer.locator("picture");
  await expect(portraitPicture.locator('source[type="image/avif"]')).toHaveCount(1);
  await expect(portraitPicture.locator('source[type="image/webp"]')).toHaveCount(1);
  const portraitTarget = portraitContainer.locator(".progressive-image__target");
  await expect(portraitTarget).toHaveClass(/is-loaded/);

  // 2. Case study cover
  await page.goto("/projects/ebola-tracker");
  const caseStudyContainer = page.locator(".case-study__cover .progressive-image");
  await expect(caseStudyContainer).toBeVisible();
  const caseStudyPlaceholder = caseStudyContainer.locator(".progressive-image__placeholder");
  await expect(caseStudyPlaceholder).toHaveAttribute("src", /(_image\?.*f=webp|\/_astro\/.*\.webp)/);
  const caseStudyPicture = caseStudyContainer.locator("picture");
  await expect(caseStudyPicture.locator('source[type="image/avif"]')).toHaveCount(1);
  await expect(caseStudyPicture.locator('source[type="image/webp"]')).toHaveCount(1);
  const caseStudyTarget = caseStudyContainer.locator(".progressive-image__target");
  await expect(caseStudyTarget).toHaveClass(/is-loaded/);

  // 3. Writing article cover
  await page.goto("/writing/graphql-over-the-cliff");
  const articleContainer = page.locator(".article-cover .progressive-image");
  await expect(articleContainer).toBeVisible();
  const articlePlaceholder = articleContainer.locator(".progressive-image__placeholder");
  await expect(articlePlaceholder).toHaveAttribute("src", /(_image\?.*f=webp|\/_astro\/.*\.webp)/);
  const articlePicture = articleContainer.locator("picture");
  await expect(articlePicture.locator('source[type="image/avif"]')).toHaveCount(1);
  await expect(articlePicture.locator('source[type="image/webp"]')).toHaveCount(1);
  const articleTarget = articleContainer.locator(".progressive-image__target");
  await expect(articleTarget).toHaveClass(/is-loaded/);
});

test("editorial links, listing titles, and card titles define visited link styling", async ({ page }) => {
  await page.goto("/");

  const visitedTokenLight = await page.evaluate(() =>
    window.getComputedStyle(document.documentElement).getPropertyValue("--color-visited").trim()
  );
  expect(visitedTokenLight).toBe("#6b3f63");

  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  const visitedTokenDark = await page.evaluate(() =>
    window.getComputedStyle(document.documentElement).getPropertyValue("--color-visited").trim()
  );
  expect(visitedTokenDark).toBe("#d49ec2");

  const visitedSelectors = await page.evaluate(() => {
    const selectors: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule && rule.selectorText.includes(":visited")) {
            selectors.push(rule.selectorText);
          }
        }
      } catch {}
    }
    return selectors;
  });

  expect(visitedSelectors.some((s) => s.includes(".text-link:visited"))).toBe(true);
  expect(visitedSelectors.some((s) => s.includes(".writing-entry h2 a:visited"))).toBe(true);
  expect(visitedSelectors.some((s) => s.includes(".card__title a:visited"))).toBe(true);
  expect(visitedSelectors.some((s) => s.includes(".prose a:visited"))).toBe(true);
});


