import { Fragment } from 'react';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { comparison, comparisonCopy, plans, type CellValue } from '@/content/pricing';

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <>
        <Icon name="check" className="inline text-accent" />
        <span className="sr-only">{comparisonCopy.included}</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Icon name="minus" className="inline text-ink-muted/60" />
        <span className="sr-only">{comparisonCopy.notIncluded}</span>
      </>
    );
  }
  return <span>{value}</span>;
}

/**
 * ≥768px: a real data table — caption, column headers (scope="col"), group header rows
 * (scope="colgroup") and row headers (scope="row").
 * <768px: the same data as one stacked card per plan (description lists), so nothing scrolls
 * sideways on phones.
 */
export function ComparisonTable() {
  return (
    <Section labelledBy="compare-title" tone="muted">
      <Container>
        <SectionHeader
          id="compare-title"
          eyebrow={comparisonCopy.eyebrow}
          title={comparisonCopy.title}
        />

        <table className="mt-12 hidden w-full border-collapse text-left text-sm md:table">
          <caption className="sr-only">{comparisonCopy.caption}</caption>
          <thead>
            <tr className="border-b border-ink-muted/40">
              <td className="w-2/5 py-4" />
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className="py-4 text-center font-display text-xl font-normal"
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((group) => (
              <Fragment key={group.title}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={plans.length + 1}
                    className="pt-10 pb-3 text-xs font-semibold tracking-eyebrow text-brass uppercase"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-normal">
                      {row.feature}
                    </th>
                    {plans.map((plan) => (
                      <td key={plan.id} className="py-4 text-center">
                        <Cell value={row.values[plan.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>

        <ul className="mt-12 grid gap-4 md:hidden">
          {plans.map((plan) => (
            <li key={plan.id} className="rounded-lg bg-bg p-6">
              <Heading level={3} size="xl">
                {plan.name}
              </Heading>
              {comparison.map((group) => (
                <div key={group.title} className="mt-6">
                  <p className="eyebrow">{group.title}</p>
                  <dl className="mt-2 divide-y divide-line">
                    {group.rows.map((row) => (
                      <div
                        key={row.feature}
                        className="flex items-center justify-between gap-4 py-3 text-sm"
                      >
                        <dt>{row.feature}</dt>
                        <dd className="text-right">
                          <Cell value={row.values[plan.id]} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
