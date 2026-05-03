import { useEffect, useState, type FormEvent } from 'react';

type Step = 1 | 2 | 3 | 4 | 'done';

type Selections = {
  service?: string;
  scope?: string;
  budget?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const STEPS: {
  step: 1 | 2 | 3;
  label: string;
  question: string;
  key: keyof Selections;
  options: { value: string; label: string }[];
}[] = [
  {
    step: 1,
    label: '01 / 04',
    question: 'What do you need?',
    key: 'service',
    options: [
      { value: 'design', label: 'UI/UX Design' },
      { value: 'frontend', label: 'Front-End Development' },
      { value: 'redesign', label: 'Website Redesign / Polish' },
      { value: 'audit', label: 'UX Audit & Consultation' },
      { value: 'branding', label: 'Branding' },
    ],
  },
  {
    step: 2,
    label: '02 / 04',
    question: 'What best describes your project?',
    key: 'scope',
    options: [
      { value: 'new', label: 'Building something new from scratch' },
      { value: 'existing', label: 'Improving an existing website' },
      { value: 'unsure', label: 'Not sure yet — need guidance' },
    ],
  },
  {
    step: 3,
    label: '03 / 04',
    question: "What's your estimated budget?",
    key: 'budget',
    options: [
      { value: 'under500', label: 'Under $500' },
      { value: '500-1500', label: '$500 – $1,500' },
      { value: '1500-3000', label: '$1,500 – $3,000' },
      { value: '3000+', label: '$3,000+' },
      { value: 'flexible', label: "Flexible / Let's discuss" },
    ],
  },
];

export default function InquiryModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [sel, setSel] = useState<Selections>({});

  useEffect(() => {
    if (open) {
      setStep(1);
      setSel({});
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const progressFill = (() => {
    if (step === 'done') return 100;
    return (step / 4) * 100;
  })();

  const select = (key: keyof Selections, value: string) => {
    setSel((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (step === 1 || step === 2 || step === 3) {
      const nextStep = (step + 1) as 2 | 3 | 4;
      setStep(nextStep);
    }
  };

  const back = () => {
    if (step === 2 || step === 3 || step === 4) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('done');
  };

  const currentSelected = (() => {
    if (step === 1) return sel.service;
    if (step === 2) return sel.scope;
    if (step === 3) return sel.budget;
    return undefined;
  })();

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={onClose}
    >
      <div
        className={`relative w-[90%] max-w-[500px] bg-white/95 border border-black/[0.06] rounded-[20px] p-9 sm:p-11 shadow-[0_24px_80px_rgba(0,0,0,0.12),0_2px_12px_rgba(0,0,0,0.04)] transition-transform duration-500 ${
          open ? 'translate-y-0 scale-100' : 'translate-y-5 scale-95'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 w-[30px] h-[30px] bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-[18px] text-muted hover:text-ink transition-colors"
          aria-label="close"
        >
          ×
        </button>

        {STEPS.map(({ step: s, label, question, key, options }) =>
          step === s ? (
            <div key={s}>
              <p className="font-body text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
                {label}
              </p>
              <h3 className="font-display text-[18px] font-medium text-ink mb-7 leading-snug">
                {question}
              </h3>
              <div className="flex flex-col gap-2.5">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => select(key, opt.value)}
                    className={`text-left font-body text-[14px] rounded-[12px] py-3.5 px-4 border-[1.5px] transition-all duration-200 ${
                      sel[key] === opt.value
                        ? 'bg-ink text-white border-ink'
                        : 'bg-black/[0.03] hover:bg-black/[0.06] text-ink border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null,
        )}

        {step === 4 && (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
              04 / 04
            </p>
            <h3 className="font-display text-[18px] font-medium text-ink mb-7 leading-snug">
              Almost there — how can I reach you?
            </h3>
            <form onSubmit={submit} className="flex flex-col gap-3.5">
              <input
                required
                type="text"
                name="name"
                placeholder="Your name"
                className="font-body text-[14px] rounded-[12px] py-3.5 px-4 bg-black/[0.03] border-[1.5px] border-transparent focus:border-black/10 focus:bg-black/[0.05] outline-none transition-all"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                className="font-body text-[14px] rounded-[12px] py-3.5 px-4 bg-black/[0.03] border-[1.5px] border-transparent focus:border-black/10 focus:bg-black/[0.05] outline-none transition-all"
              />
              <textarea
                name="details"
                rows={3}
                placeholder="Brief description of your project (optional)"
                className="font-body text-[14px] rounded-[12px] py-3.5 px-4 bg-black/[0.03] border-[1.5px] border-transparent focus:border-black/10 focus:bg-black/[0.05] outline-none transition-all resize-none"
              />
              <button
                type="submit"
                className="font-display text-[13px] font-medium tracking-[0.05em] bg-ink hover:bg-coral text-white rounded-[12px] py-4 mt-1 transition-all hover:scale-[1.01]"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-6">
            <h3 className="font-display text-[20px] font-medium text-ink mb-3">
              Thank you!
            </h3>
            <p className="font-body text-[14px] text-muted leading-relaxed">
              I&rsquo;ll review your inquiry and get back to you within 24–48 hours.
            </p>
          </div>
        )}

        {step !== 'done' && (
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={back}
              disabled={step === 1}
              className="font-body text-[13px] bg-black/[0.04] disabled:opacity-25 hover:enabled:bg-black/[0.08] rounded-[10px] py-2.5 px-5 transition-colors"
            >
              Back
            </button>
            <div className="flex-1 h-[3px] bg-black/[0.06] rounded overflow-hidden">
              <div
                className="h-full bg-ink rounded transition-all duration-500"
                style={{ width: `${progressFill}%` }}
              />
            </div>
            <button
              onClick={next}
              disabled={step !== 4 ? !currentSelected : true}
              className="font-body text-[13px] bg-black/[0.04] disabled:opacity-25 hover:enabled:bg-black/[0.08] rounded-[10px] py-2.5 px-5 transition-colors"
            >
              {step === 4 ? '—' : 'Next'}
            </button>
          </div>
        )}

        <div className="mt-7 p-4 bg-black/[0.025] rounded-[12px]">
          <p className="font-body text-[11px] text-muted leading-relaxed">
            Pricing depends on project scope &amp; complexity. UI/UX, front-end (HTML/CSS/JS, Webflow), website redesigns, branding, and UX audits.
          </p>
        </div>
      </div>
    </div>
  );
}
