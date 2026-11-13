export interface NavItem {
  readonly label: string;
  readonly to: string;
}

export interface PageIntro {
  /** Small label above the title. */
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
}

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  /** Path relative to the site root, e.g. "/pricing". */
  readonly path: string;
  readonly noindex?: boolean;
}

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavItem[];
}

export interface SiteContent {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly nav: readonly NavItem[];
  readonly skipLinkLabel: string;
  readonly cta: { readonly demo: string; readonly pricing: string; readonly product: string };
  readonly footer: {
    readonly columns: readonly FooterColumn[];
    readonly legal: string;
    readonly fictionNotice: string;
    readonly backToTop: string;
  };
}

export interface DemoFormContent {
  readonly title: string;
  readonly description: string;
  readonly nameLabel: string;
  readonly emailLabel: string;
  readonly emailError: string;
  readonly doorsLabel: string;
  readonly doorsPlaceholder: string;
  readonly doorsOptions: readonly string[];
  readonly note: string;
  readonly submit: string;
  readonly submitting: string;
  readonly successTitle: string;
  readonly successBody: string;
}

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}
