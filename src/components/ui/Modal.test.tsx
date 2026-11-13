import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { isScrollLocked } from '@/lib/scrollLock';
import { Modal } from './Modal';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <div id="root">
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </button>
      <button type="button">Background</button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title="Reassign enquiry"
        description="Pick a negotiator."
      >
        <button type="button">First action</button>
        <button type="button">Last action</button>
      </Modal>
    </div>
  );
}

async function openModal() {
  const user = userEvent.setup();
  render(<Harness />);
  const trigger = screen.getByRole('button', { name: 'Open' });
  await user.click(trigger);
  const dialog = await screen.findByRole('dialog', { name: 'Reassign enquiry' });
  return { user, trigger, dialog };
}

describe('Modal', () => {
  it('is a labelled, described modal dialog', async () => {
    const { dialog } = await openModal();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Pick a negotiator.');
  });

  it('moves focus inside on open and traps Tab / Shift+Tab', async () => {
    const { user } = await openModal();
    const close = screen.getByRole('button', { name: 'Close dialog' });
    const last = screen.getByRole('button', { name: 'Last action' });
    expect(close).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('locks scroll and makes the background inert while open', async () => {
    await openModal();
    expect(isScrollLocked()).toBe(true);
    expect(document.getElementById('root')?.inert).toBe(true);
  });

  it('closes on Escape, unlocks scroll and returns focus to the trigger', async () => {
    const { user, trigger } = await openModal();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(isScrollLocked()).toBe(false);
    expect(document.getElementById('root')?.inert).toBe(false);
  });

  it('closes from the close button', async () => {
    const { user, trigger } = await openModal();
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
