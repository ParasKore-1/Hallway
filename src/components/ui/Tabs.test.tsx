import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const items = [
  { id: 'enq', label: 'Enquiries', content: 'Enquiries panel' },
  { id: 'view', label: 'Viewings', content: 'Viewings panel' },
  { id: 'maint', label: 'Maintenance', content: 'Maintenance panel' },
];

describe('Tabs', () => {
  it('exposes tablist / tab / tabpanel roles and relationships', () => {
    render(<Tabs label="Views" items={items} />);
    expect(screen.getByRole('tablist', { name: 'Views' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'Enquiries' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: 'Enquiries' });
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Enquiries panel');
    expect(screen.getByText('Viewings panel')).not.toBeVisible();
  });

  it('uses a roving tabindex: only the selected tab is in the tab order', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Views" items={items} />);
    const [first, second] = screen.getAllByRole('tab');
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('selects with arrow keys (wrapping) and Home/End', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs label="Views" items={items} onValueChange={onValueChange} />);
    const [first, second, third] = screen.getAllByRole('tab');
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Viewings panel')).toBeVisible();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(third).toHaveFocus();
    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
    await user.keyboard('{End}');
    expect(third).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith('maint');
  });

  it('selects on click', async () => {
    render(<Tabs label="Views" items={items} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Maintenance' }));
    expect(screen.getByText('Maintenance panel')).toBeVisible();
  });
});
