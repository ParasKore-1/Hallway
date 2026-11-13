import { useId } from 'react';
import type { Billing } from '@/content/pricing';
import { pricingIntro } from '@/content/pricing';
import { cn } from '@/lib/cn';

export interface BillingToggleProps {
  value: Billing;
  onChange: (value: Billing) => void;
}

/**
 * Monthly/annual switch built from native radio inputs (arrow keys, labels and form semantics
 * come for free), styled as a segmented control.
 */
export function BillingToggle({ value, onChange }: BillingToggleProps) {
  const name = useId();
  const options: { value: Billing; label: string }[] = [
    { value: 'monthly', label: pricingIntro.monthly },
    { value: 'annual', label: pricingIntro.annual },
  ];
  return (
    <fieldset className="mt-10">
      <legend className="sr-only">{pricingIntro.billingLabel}</legend>
      <div className="inline-flex rounded-pill bg-surface-2 p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill px-5 text-sm font-semibold transition-colors duration-(--hw-dur-fast)',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus',
              value === option.value
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => {
                onChange(option.value);
              }}
              className="sr-only"
            />
            {option.label}
            {option.value === 'annual' && (
              <span className="rounded-pill bg-brass-soft px-2 py-0.5 text-[0.6875rem] text-ink">
                {pricingIntro.annualSaving}
              </span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
