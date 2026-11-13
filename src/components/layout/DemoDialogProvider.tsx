import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { demoForm } from '@/content/site';
import { useToast } from '@/hooks/useToast';
import { DemoDialogContext } from './demoDialogContext';

export interface DemoDialogProviderProps {
  children: ReactNode;
}

const fieldClass =
  'mt-2 block min-h-11 w-full rounded-sm border border-ink-muted bg-surface px-3 text-base text-ink placeholder:text-ink-muted/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-invalid:border-danger';

/**
 * "Book a demo" dialog available from any CTA. Hallway is fictional, so submission is
 * simulated (short delay → success toast); nothing leaves the browser.
 */
export function DemoDialogProvider({ children }: DemoDialogProviderProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const ids = { name: useId(), email: useId(), doors: useId(), emailError: useId() };

  const openDemo = useCallback(() => {
    setEmailError(null);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  const value = useMemo(() => ({ openDemo }), [openDemo]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(demoForm.emailError);
      return;
    }
    setEmailError(null);
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast({ title: demoForm.successTitle, description: demoForm.successBody, tone: 'success' });
    }, 900);
  };

  return (
    <DemoDialogContext.Provider value={value}>
      {children}
      <Modal
        open={open}
        onClose={close}
        title={demoForm.title}
        description={demoForm.description}
        initialFocusRef={nameRef}
      >
        <form noValidate onSubmit={onSubmit} className="grid gap-5">
          <div>
            <label htmlFor={ids.name} className="text-sm font-semibold">
              {demoForm.nameLabel}
            </label>
            <input
              ref={nameRef}
              id={ids.name}
              name="name"
              autoComplete="name"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={ids.email} className="text-sm font-semibold">
              {demoForm.emailLabel}
            </label>
            <input
              id={ids.email}
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? ids.emailError : undefined}
              className={fieldClass}
            />
            {emailError && (
              <p id={ids.emailError} className="mt-2 text-sm text-danger">
                {emailError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={ids.doors} className="text-sm font-semibold">
              {demoForm.doorsLabel}
            </label>
            <select id={ids.doors} name="doors" className={fieldClass} defaultValue="">
              <option value="" disabled>
                {demoForm.doorsPlaceholder}
              </option>
              {demoForm.doorsOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-ink-muted">{demoForm.note}</p>
          <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
            {submitting ? demoForm.submitting : demoForm.submit}
          </Button>
        </form>
      </Modal>
    </DemoDialogContext.Provider>
  );
}
