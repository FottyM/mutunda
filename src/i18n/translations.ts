import { DEFAULT_LOCALE, type Locale } from "./config";

export const translations = {
  en: {
    // Shared shell
    skip_link: "Skip to content",
    "wordmark.aria": "Fortunat Mutunda, home",
    "nav.primary": "Primary",
    "nav.language": "Language selection",
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.writing": "Writing",
    "nav.about": "About",
    "footer.note": "Built as a quiet place for work and writing.",
    "footer.copyright": "Fortunat Mutunda",
    "lang.switch_to": "Switch to {lang}",
    "lang.current": "Current language: {lang}",
    "common.tags": "Tags",
    "common.technologies": "Technologies",
    "common.language_notice": "Language notice",
    "theme.label": "Color theme",
    "theme.system": "System theme",
    "theme.light": "Light theme",
    "theme.dark": "Dark theme",
    "theme.toggle": "Toggle color theme",
    "theme.to_light": "Switch to light theme",
    "theme.to_dark": "Switch to dark theme",
    "lang.select": "Select language",
    "palette.trigger": "Search or jump to... (⌘K)",
    "palette.trigger_base": "Search or jump to...",
    "palette.dialog_label": "Command Palette",
    "palette.placeholder": "Search field notes, projects, actions...",
    "palette.empty": "No matching results found.",
    "palette.group_navigation": "Navigation",
    "palette.group_field_notes": "Field Notes",
    "palette.group_selected_work": "Selected Work",
    "palette.group_actions": "Actions",
    "palette.group_languages": "Languages",
    "palette.group_external": "External Profiles",
    "palette.lang_switch": "Switch language to {lang}",
    "palette.current": "Current",
    "palette.hint_navigate": "Navigate",
    "palette.hint_select": "Select",
    "palette.hint_close": "Close",
    "palette.close": "Close command palette",
    "palette.action_light": "Switch to light theme",
    "palette.action_dark": "Switch to dark theme",
    "palette.action_system": "Use system theme preference",
    "palette.item_ebola_title": "Ebola Tracker",
    "palette.item_ebola_description":
      "Real-time epidemiological dashboard and public health response platform.",
    "palette.item_static_sites_title": "Static sites are operational systems",
    "palette.item_static_sites_description":
      "Architecture note on predictable publishing and deterministic state.",
    "palette.item_github_title": "GitHub — @FottyM",
    "palette.item_github_description":
      "Open source repositories and software contributions",
    "palette.item_linkedin_title": "LinkedIn — Fortunat Mutunda",
    "palette.item_linkedin_description":
      "Professional background, career history, and connections",

    // Home
    "home.title": "Fortunat Mutunda — Software Engineer",
    "home.description":
      "Fortunat Mutunda is a software engineer working across web platforms, developer tools, and backend systems.",
    "home.eyebrow": "Software engineer · Tallinn, Estonia",
    "home.intro_p":
      "I build reliable web platforms, developer tools, and backend systems with JavaScript, TypeScript, and Rust.",
    "home.practice_label": "Areas of practice",
    "home.practice_title": "Practice",
    "home.practice_items":
      "Web platforms<br />Developer tooling<br />Backend systems",
    "home.selected_work_eyebrow": "Selected work",
    "home.selected_work_heading": "Systems built for real conditions.",
    "home.view_all_projects": "View all projects",
    "home.about_eyebrow": "About",
    "home.about_heading":
      "Software engineering with an operational point of view.",
    "home.about_text":
      "I work across web platforms, developer tooling, and backend systems, with an emphasis on dependable delivery and clear interfaces.",
    "home.more_about": "More about my work",
    "home.more": "More",

    // Projects
    "projects.title": "Projects — Fortunat Mutunda",
    "projects.description":
      "Selected software engineering projects by Fortunat Mutunda.",
    "projects.eyebrow": "Project archive",
    "projects.heading": "Selected work",
    "projects.lede":
      "Products and systems shaped around reliability, useful information, and the people operating them.",
    "projects.view_live": "View live project",
    "projects.view_repo": "View repository",
    "projects.role": "Role",
    "projects.year": "Year",
    "projects.tools": "Tools",
    "projects.case_study_eyebrow": "Case study",
    "projects.fallback_notice":
      "This case study is not yet translated into the selected language. Displaying the original English version.",
    "projects.in_english": "(In English)",
    "projects.back_to_index": "Back to selected work",

    // Writing
    "writing.title": "Writing — Fortunat Mutunda",
    "writing.description": "Technical notes by Fortunat Mutunda.",
    "writing.eyebrow": "Writing",
    "writing.heading": "Field notes",
    "writing.lede":
      "Practical notes about software systems, their operating constraints, and the work behind them.",
    "writing.meta_field_note": "Field note",
    "writing.published_date": "Published {date}",
    "writing.back_to_index": "Back to field notes",
    "writing.tag_eyebrow": "Writing tag",
    "writing.notes_count_single": "{count} note in this field.",
    "writing.notes_count_plural": "{count} notes in this field.",
    "writing.fallback_notice":
      "This field note is not yet translated into the selected language. Displaying the original English version.",
    "writing.in_english": "(In English)",

    // About
    "about.title": "About — Fortunat Mutunda",
    "about.description":
      "About Fortunat Mutunda, a software engineer based in Tallinn, Estonia.",
    "about.eyebrow": "About",
    "about.heading": "Engineering for the whole system.",
    "about.lede":
      "I'm a proud husband, dad, and Christian first, then a Senior Software Engineer who builds reliable software and helps teams solve complex problems with clarity.",
    "about.p1":
      "My work combines hands-on engineering with technical leadership: shaping systems, leading initiatives from idea to deployment, mentoring teammates, and improving how software is built and shipped.",
    "about.p2":
      "I enjoy simplifying complexity through thoughtful architecture, useful tooling, and strong engineering practice. My experience spans TypeScript, Node.js, PostgreSQL, Kafka, Docker, React, and CI/CD.",
    "about.p3":
      "I care about resilient systems, developer experience, and practical uses of AI in engineering teams. Outside work, you'll occasionally find me gaming—usually after family time.",
    "about.profiles_heading": "Profiles",
    "about.primary_profile": "(primary profile)",

    // 404
    "404.title": "Page not found — Fortunat Mutunda",
    "404.description": "The requested page could not be found.",
    "404.index": "404 / Missing",
    "404.eyebrow": "Archive error",
    "404.heading": "Page not found",
    "404.message": "The address may be outdated, or the page may have moved.",
    "404.return_home": "Return home",

    // Style guide
    "style_guide.title": "Style Guide — Fortunat Mutunda",
    "style_guide.description":
      "Visual language, design tokens, and components for mutunda.me.",
    "style_guide.eyebrow": "Design system",
    "style_guide.heading": "Visual language & tokens",
    "style_guide.lede":
      "Reusable components, editorial typography, and color tokens that define the technical field journal.",
  },
  fr: {
    // Shared shell
    skip_link: "Aller au contenu principal",
    "wordmark.aria": "Fortunat Mutunda, accueil",
    "nav.primary": "Navigation principale",
    "nav.language": "Sélection de la langue",
    "nav.home": "Accueil",
    "nav.projects": "Projets",
    "nav.writing": "Écrits",
    "nav.about": "À propos",
    "footer.note":
      "Conçu comme un espace sobre dédié au travail et à la réflexion.",
    "footer.copyright": "Fortunat Mutunda",
    "lang.switch_to": "Passer en {lang}",
    "lang.current": "Langue actuelle : {lang}",
    "common.tags": "Étiquettes",
    "common.technologies": "Technologies",
    "common.language_notice": "Information sur la langue",
    "theme.label": "Thème de couleur",
    "theme.system": "Thème du système",
    "theme.light": "Thème clair",
    "theme.dark": "Thème sombre",
    "theme.toggle": "Changer de thème",
    "theme.to_light": "Passer au thème clair",
    "theme.to_dark": "Passer au thème sombre",
    "lang.select": "Sélectionner la langue",
    "palette.trigger": "Rechercher ou accéder... (⌘K)",
    "palette.trigger_base": "Rechercher ou accéder...",
    "palette.dialog_label": "Palette de commandes",
    "palette.placeholder": "Rechercher notes, projets, actions...",
    "palette.empty": "Aucun résultat correspondant trouvé.",
    "palette.group_navigation": "Navigation",
    "palette.group_field_notes": "Notes de terrain",
    "palette.group_selected_work": "Projets sélectionnés",
    "palette.group_actions": "Actions",
    "palette.group_languages": "Langues",
    "palette.group_external": "Profils externes",
    "palette.lang_switch": "Passer en {lang}",
    "palette.current": "Actuelle",
    "palette.hint_navigate": "Naviguer",
    "palette.hint_select": "Sélectionner",
    "palette.hint_close": "Fermer",
    "palette.close": "Fermer la palette de commandes",
    "palette.action_light": "Passer au thème clair",
    "palette.action_dark": "Passer au thème sombre",
    "palette.action_system": "Utiliser le thème système",
    "palette.item_ebola_title": "Ebola Tracker",
    "palette.item_ebola_description":
      "Tableau de bord épidémiologique en temps réel et plateforme de réponse de santé publique.",
    "palette.item_static_sites_title":
      "Les sites statiques sont des systèmes opérationnels",
    "palette.item_static_sites_description":
      "Note d’architecture sur une publication prévisible et un état déterministe.",
    "palette.item_github_title": "GitHub — @FottyM",
    "palette.item_github_description":
      "Dépôts open source et contributions logicielles",
    "palette.item_linkedin_title": "LinkedIn — Fortunat Mutunda",
    "palette.item_linkedin_description":
      "Parcours professionnel, expérience et réseau",

    // Home
    "home.title": "Fortunat Mutunda — Ingénieur logiciel",
    "home.description":
      "Fortunat Mutunda est un ingénieur logiciel concevant des plateformes web, des outils pour développeurs et des systèmes backend.",
    "home.eyebrow": "Ingénieur logiciel · Tallinn, Estonie",
    "home.intro_p":
      "Je conçois des plateformes web fiables, des outils pour développeurs et des systèmes backend avec JavaScript, TypeScript et Rust.",
    "home.practice_label": "Domaines d'expertise",
    "home.practice_title": "Pratique",
    "home.practice_items":
      "Plateformes web<br />Outillage développeur<br />Systèmes backend",
    "home.selected_work_eyebrow": "Sélection de projets",
    "home.selected_work_heading":
      "Des systèmes conçus pour des conditions réelles.",
    "home.view_all_projects": "Voir tous les projets",
    "home.about_eyebrow": "À propos",
    "home.about_heading": "L'ingénierie logicielle sous un angle opérationnel.",
    "home.about_text":
      "J'interviens sur les plateformes web, l'outillage développeur et les architectures backend, avec une exigence constante de livraison fiable et d'interfaces claires.",
    "home.more_about": "En savoir plus sur mon travail",
    "home.more": "En savoir plus",

    // Projects
    "projects.title": "Projets — Fortunat Mutunda",
    "projects.description":
      "Sélection de projets d'ingénierie logicielle par Fortunat Mutunda.",
    "projects.eyebrow": "Archive des projets",
    "projects.heading": "Sélection de projets",
    "projects.lede":
      "Des produits et systèmes façonnés autour de la fiabilité, des informations utiles et des personnes qui les exploitent.",
    "projects.view_live": "Voir le projet en direct",
    "projects.view_repo": "Voir le dépôt",
    "projects.role": "Rôle",
    "projects.year": "Année",
    "projects.tools": "Outils",
    "projects.case_study_eyebrow": "Étude de cas",
    "projects.fallback_notice":
      "Cette étude de cas n'est pas encore traduite en français. Affichage de la version originale en anglais.",
    "projects.in_english": "(En anglais)",
    "projects.back_to_index": "Retour à la sélection de projets",

    // Writing
    "writing.title": "Écrits — Fortunat Mutunda",
    "writing.description": "Notes techniques rédigées par Fortunat Mutunda.",
    "writing.eyebrow": "Écrits",
    "writing.heading": "Notes de terrain",
    "writing.lede":
      "Observations concrètes sur les systèmes logiciels, leurs contraintes d'exploitation et le travail sous-jacent.",
    "writing.meta_field_note": "Note de terrain",
    "writing.published_date": "Publié le {date}",
    "writing.back_to_index": "Retour aux notes de terrain",
    "writing.tag_eyebrow": "Thématique d'écriture",
    "writing.notes_count_single": "{count} note dans cette thématique.",
    "writing.notes_count_plural": "{count} notes dans cette thématique.",
    "writing.fallback_notice":
      "Cette note de terrain n'est pas encore traduite en français. Affichage de la version originale en anglais.",
    "writing.in_english": "(En anglais)",

    // About
    "about.title": "À propos — Fortunat Mutunda",
    "about.description":
      "À propos de Fortunat Mutunda, ingénieur logiciel basé à Tallinn en Estonie.",
    "about.eyebrow": "À propos",
    "about.heading": "L'ingénierie à l'échelle du système tout entier.",
    "about.lede":
      "Je suis avant tout un mari, un père et un chrétien fier de l'être, puis un ingénieur logiciel senior qui construit des logiciels fiables et aide les équipes à résoudre des problèmes complexes avec clarté.",
    "about.p1":
      "Mon travail combine l'ingénierie pratique et le leadership technique : concevoir des systèmes, mener des initiatives de l'idée au déploiement, accompagner mes collègues et améliorer la façon dont les logiciels sont construits et livrés.",
    "about.p2":
      "J'aime simplifier la complexité grâce à une architecture réfléchie, des outils utiles et des pratiques d'ingénierie solides. Mon expérience couvre TypeScript, Node.js, PostgreSQL, Kafka, Docker, React et le CI/CD.",
    "about.p3":
      "Je m'intéresse aux systèmes résilients, à l'expérience développeur et aux usages concrets de l'IA dans les équipes d'ingénierie. En dehors du travail, il m'arrive de jouer, généralement après le temps en famille.",
    "about.profiles_heading": "Profils",
    "about.primary_profile": "(profil principal)",

    // 404
    "404.title": "Page introuvable — Fortunat Mutunda",
    "404.description": "La page demandée est introuvable.",
    "404.index": "404 / Manquant",
    "404.eyebrow": "Erreur d'archive",
    "404.heading": "Page introuvable",
    "404.message":
      "L'adresse est peut-être obsolète ou la page a été déplacée.",
    "404.return_home": "Retour à l'accueil",

    // Style guide
    "style_guide.title": "Guide de style — Fortunat Mutunda",
    "style_guide.description":
      "Langage visuel, jetons de design et composants de mutunda.me.",
    "style_guide.eyebrow": "Système de design",
    "style_guide.heading": "Langage visuel & jetons",
    "style_guide.lede":
      "Composants réutilisables, typographie éditoriale et jetons de couleur définissant le journal technique de terrain.",
  },
  et: {
    // Shared shell
    skip_link: "Hüppa sisu juurde",
    "wordmark.aria": "Fortunat Mutunda, avaleht",
    "nav.primary": "Peamenüü",
    "nav.language": "Keele valik",
    "nav.home": "Avaleht",
    "nav.projects": "Projektid",
    "nav.writing": "Kirjutised",
    "nav.about": "Minust",
    "footer.note": "Loodud rahulikuks paigaks töö ja kirjutiste jaoks.",
    "footer.copyright": "Fortunat Mutunda",
    "lang.switch_to": "Vali keeleks {lang}",
    "lang.current": "Aktiivne keel: {lang}",
    "common.tags": "Sildid",
    "common.technologies": "Tehnoloogiad",
    "common.language_notice": "Keeleteade",
    "theme.label": "Värviteema",
    "theme.system": "Süsteemi teema",
    "theme.light": "Hele teema",
    "theme.dark": "Tume teema",
    "theme.toggle": "Vaheta värviteemat",
    "theme.to_light": "Lülitu heledale teemale",
    "theme.to_dark": "Lülitu tumedale teemale",
    "lang.select": "Vali keel",
    "palette.trigger": "Otsi või liigu... (⌘K)",
    "palette.trigger_base": "Otsi või liigu...",
    "palette.dialog_label": "Käsualus",
    "palette.placeholder": "Otsi väljamärkmeid, projekte, tegevusi...",
    "palette.empty": "Vastavaid tulemusi ei leitud.",
    "palette.group_navigation": "Navigeerimine",
    "palette.group_field_notes": "Väljamärkmed",
    "palette.group_selected_work": "Valitud tööd",
    "palette.group_actions": "Tegevused",
    "palette.group_languages": "Keeled",
    "palette.group_external": "Välisprofiilid",
    "palette.lang_switch": "Vali keeleks {lang}",
    "palette.current": "Aktiivne",
    "palette.hint_navigate": "Liigu",
    "palette.hint_select": "Vali",
    "palette.hint_close": "Sulge",
    "palette.close": "Sulge käsualus",
    "palette.action_light": "Lülitu heledale teemale",
    "palette.action_dark": "Lülitu tumedale teemale",
    "palette.action_system": "Kasuta süsteemi teemat",
    "palette.item_ebola_title": "Ebola Tracker",
    "palette.item_ebola_description":
      "Reaalajas epidemioloogiline juhtpaneel ja rahvatervise reageerimisplatvorm.",
    "palette.item_static_sites_title":
      "Staatilised saidid on operatsioonisüsteemid",
    "palette.item_static_sites_description":
      "Arhitektuurimärkus ennustatavast avaldamisest ja deterministlikust olekust.",
    "palette.item_github_title": "GitHub — @FottyM",
    "palette.item_github_description":
      "Avatud lähtekoodiga hoidlad ja tarkvaraalased panused",
    "palette.item_linkedin_title": "LinkedIn — Fortunat Mutunda",
    "palette.item_linkedin_description":
      "Professionaalne taust, karjäär ja võrgustik",

    // Home
    "home.title": "Fortunat Mutunda — Tarkvarainsener",
    "home.description":
      "Fortunat Mutunda on tarkvarainsener, kes töötab veebiplatvormide, arendustööriistade ja taustasüsteemidega.",
    "home.eyebrow": "Tarkvarainsener · Tallinn, Eesti",
    "home.intro_p":
      "Ehitan töökindlaid veebiplatvorme, arendustööriistu ja taustasüsteeme JavaScripti, TypeScripti ja Rustiga.",
    "home.practice_label": "Tegevusvaldkonnad",
    "home.practice_title": "Valdkonnad",
    "home.practice_items":
      "Veebiplatvormid<br />Arendustööriistad<br />Taustasüsteemid",
    "home.selected_work_eyebrow": "Valitud tööd",
    "home.selected_work_heading":
      "Süsteemid, mis on ehitatud reaalseteks oludeks.",
    "home.view_all_projects": "Vaata kõiki projekte",
    "home.about_eyebrow": "Minust",
    "home.about_heading": "Tarkvaratehnika operatiivsest vaatenurgast.",
    "home.about_text":
      "Töötan veebiplatvormide, arendustööriistade ja taustasüsteemidega, keskendudes töökindlale tarnele ja selgetele liidestele.",
    "home.more_about": "Lähemalt minu tööst",
    "home.more": "Rohkem",

    // Projects
    "projects.title": "Projektid — Fortunat Mutunda",
    "projects.description": "Fortunat Mutunda valitud tarkvaraprojektid.",
    "projects.eyebrow": "Projektide arhiiv",
    "projects.heading": "Valitud tööd",
    "projects.lede":
      "Tooted ja süsteemid, mis on kujundatud töökindluse, kasuliku teabe ja neid käitavate inimeste ümber.",
    "projects.view_live": "Vaata reaalset projekti",
    "projects.view_repo": "Vaata koodivaramut",
    "projects.role": "Roll",
    "projects.year": "Aasta",
    "projects.tools": "Tööriistad",
    "projects.case_study_eyebrow": "Juhtumiuuring",
    "projects.fallback_notice":
      "See juhtumiuuring ei ole veel eesti keelde tõlgitud. Kuvatakse ingliskeelne algupärand.",
    "projects.in_english": "(Inglise keeles)",
    "projects.back_to_index": "Tagasi valitud tööde juurde",

    // Writing
    "writing.title": "Kirjutised — Fortunat Mutunda",
    "writing.description": "Fortunat Mutunda tehnilised märkmed.",
    "writing.eyebrow": "Kirjutised",
    "writing.heading": "Väljamärkmed",
    "writing.lede":
      "Praktilised tähelepanekud tarkvarasüsteemidest, nende töökitsendustest ja tehtud tööst.",
    "writing.meta_field_note": "Väljamärge",
    "writing.published_date": "Avaldatud {date}",
    "writing.back_to_index": "Tagasi väljamärkmete juurde",
    "writing.tag_eyebrow": "Teema",
    "writing.notes_count_single": "{count} märge selles valdkonnas.",
    "writing.notes_count_plural": "{count} märget selles valdkonnas.",
    "writing.fallback_notice":
      "See väljamärge ei ole veel eesti keelde tõlgitud. Kuvatakse ingliskeelne algupärand.",
    "writing.in_english": "(Inglise keeles)",

    // About
    "about.title": "Minust — Fortunat Mutunda",
    "about.description":
      "Fortunat Mutunda, Tallinnas tegutsev tarkvarainsener.",
    "about.eyebrow": "Minust",
    "about.heading": "Tarkvaraarendus terve süsteemi vaates.",
    "about.lede":
      "Olen ennekõike uhke abikaasa, isa ja kristlane ning seejärel vanemtarkvarainsener, kes ehitab töökindlat tarkvara ja aitab meeskondadel keerukaid probleeme selgelt lahendada.",
    "about.p1":
      "Minu töö ühendab praktilise tarkvaraarenduse ja tehnilise juhtimise: kujundan süsteeme, viin algatusi ideest juurutamiseni, toetan kolleege ning parandan seda, kuidas tarkvara luuakse ja välja antakse.",
    "about.p2":
      "Mulle meeldib keerukust lihtsustada läbimõeldud arhitektuuri, kasulike tööriistade ja tugevate inseneripraktikate abil. Minu kogemusse kuuluvad TypeScript, Node.js, PostgreSQL, Kafka, Docker, React ja CI/CD.",
    "about.p3":
      "Pean oluliseks töökindlaid süsteeme, arendajakogemust ja tehisintellekti praktilist kasutust insenerimeeskondades. Väljaspool tööd leiad mind aeg-ajalt mängimas, tavaliselt pärast aega perega.",
    "about.profiles_heading": "Profiilid",
    "about.primary_profile": "(peamine profiil)",

    // 404
    "404.title": "Lehte ei leitud — Fortunat Mutunda",
    "404.description": "Soovitud lehte ei leitud.",
    "404.index": "404 / Puudub",
    "404.eyebrow": "Arhiivi viga",
    "404.heading": "Lehte ei leitud",
    "404.message": "Aadress võib olla aegunud või leht on teisaldatud.",
    "404.return_home": "Tagasi avalehele",

    // Style guide
    "style_guide.title": "Stiilijuhend — Fortunat Mutunda",
    "style_guide.description":
      "mutunda.me visuaalne keel, disainitokenid ja komponendid.",
    "style_guide.eyebrow": "Disainisüsteem",
    "style_guide.heading": "Visuaalne keel ja tokenid",
    "style_guide.lede":
      "Korduvkasutatavad komponendid, toimetuslik tüpograafia ja värvitokenid, mis loovad tehnilise välipäeviku ilme.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)[typeof DEFAULT_LOCALE];

export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  return function t(
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string {
    const localeDict = translations[locale] as
      Record<string, string> | undefined;
    const defaultDict = translations[DEFAULT_LOCALE] as Record<string, string>;
    let text = localeDict?.[key] ?? defaultDict[key] ?? key;

    if (params) {
      for (const [placeholder, value] of Object.entries(params)) {
        text = text.replace(
          new RegExp(`\\{${placeholder}\\}`, "g"),
          String(value),
        );
      }
    }

    return text;
  };
}
