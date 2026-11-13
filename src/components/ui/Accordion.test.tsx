import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'First question', content: 'First answer' },
  { id: 'b', title: 'Second question', content: 'Second answer' },
  { id: 'c', title: 'Third question', content: 'Third answer' },
];

describe('Accordion', () => {
  it('wires triggers to regions with aria-expanded / aria-controls', () => {
    render(<Accordion items={items} defaultOpen={['a']} />);
    const first = screen.getByRole('button', { name: 'First question' });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    const region = screen.getByRole('region', { name: 'First question' });
    expect(first).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveTextContent('First answer');
    expect(screen.getByRole('button', { name: 'Second question' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByText('Second answer')).not.toBeVisible();
  });

  it('wraps triggers in headings at the requested level', () => {
    render(<Accordion items={items} headingLevel={4} />);
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
  });

  it('toggles with Enter and Space, one panel open at a time', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('First answer')).toBeVisible();

    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');
    expect(screen.getByText('Second answer')).toBeVisible();
    expect(screen.getByText('First answer')).not.toBeVisible();
  });

  it('moves focus with arrows, wrapping, and Home/End', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const [first, second, third] = screen.getAllByRole('button');
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();
    await user.keyboard('{End}');
    expect(third).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(third).toHaveFocus();
    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
  });

  it('allows several open panels in multiple mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} multiple />);
    await user.click(screen.getByRole('button', { name: 'First question' }));
    await user.click(screen.getByRole('button', { name: 'Third question' }));
    expect(screen.getByText('First answer')).toBeVisible();
    expect(screen.getByText('Third answer')).toBeVisible();
  });
});
