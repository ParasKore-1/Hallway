import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link as RouterLink, NavLink, type NavLinkProps } from 'react-router';
import { isExternalHref, opensNewTab } from '@/lib/url';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  /** inline = underlined body link, draw = underline draws on hover, plain = no decoration. */
  variant?: 'inline' | 'draw' | 'plain';
  /** Force external treatment; otherwise inferred from the href. */
  external?: boolean;
  children: ReactNode;
}

const variants = {
  inline:
    'text-accent underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] hover:decoration-2',
  draw: 'link-draw',
  plain: '',
} as const;

/**
 * Internal hrefs use the router (client navigation, aria-current on the active route).
 * External hrefs open in a new tab with safe rel and an announced hint.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, variant = 'inline', external, className, children, ...props },
  ref,
) {
  const classes = cn('rounded-xs', variants[variant], className);
  const isExternal = external ?? isExternalHref(href);

  if (isExternal) {
    const opensTab = opensNewTab(href);
    return (
      <a
        ref={ref}
        href={href}
        className={cn(classes, 'inline-flex items-baseline gap-1')}
        {...(opensTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
        {opensTab && (
          <>
            <Icon name="arrow-up-right" className="size-[0.85em] self-center" />
            <span className="sr-only"> (opens in a new tab)</span>
          </>
        )}
      </a>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  // "/#section" points into a page; it is never "the current page", so no aria-current.
  if (href.includes('#')) {
    return (
      <RouterLink ref={ref} to={href} className={classes} {...props}>
        {children}
      </RouterLink>
    );
  }

  return (
    <NavLink
      ref={ref}
      to={href}
      end
      className={classes}
      {...(props as Omit<NavLinkProps, 'to' | 'className' | 'children' | 'style'>)}
    >
      {children}
    </NavLink>
  );
});
