'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSound } from '@/hooks/use-sound';

type ContactInfo = {
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
};

const fallbackContact: ContactInfo = {
  email: 'linasjesaias@gmail.com',
  github: 'https://github.com/jesaias1',
  linkedin: 'https://www.linkedin.com/in/jesaias/',
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [contactInfo, setContactInfo] = useState<ContactInfo>(fallbackContact);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    fetch('/api/contact')
      .then((response) => {
        if (!response.ok) throw new Error('Contact details unavailable');
        return response.json();
      })
      .then((data) => setContactInfo({ ...fallbackContact, ...data }))
      .catch(() => undefined);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    play('click');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, startedAt: formStartedAt }),
      });

      if (!response.ok) throw new Error('Message could not be sent');
      toast.success('Message sent.');
      play('success');
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '', website: '' });
      setFormStartedAt(Date.now());
    } catch {
      toast.error(`Message unavailable — email ${contactInfo.email} instead.`);
      play('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { label: 'GitHub', href: contactInfo.github },
    { label: 'LinkedIn', href: contactInfo.linkedin },
    { label: 'Twitter', href: contactInfo.twitter },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <section id="contact" className="content-section relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10 border-b border-white/10 pb-8 md:mb-14"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#4ddbff]">
            Contact / Start a conversation
          </p>
          <h2 className="max-w-4xl text-4xl font-bold tracking-[-0.045em] text-white md:text-6xl">
            Have something worth building?
          </h2>
        </motion.header>

        <div className="grid overflow-hidden border border-white/[0.09] bg-[#08090a]/80 md:grid-cols-[0.78fr_1.22fr]">
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between border-b border-white/[0.09] p-6 md:min-h-[520px] md:border-b-0 md:border-r md:p-8"
          >
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-gray-600">
                Direct contact
              </span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="mt-4 inline-flex min-h-11 items-center break-all font-mono text-sm tracking-[0.04em] text-gray-300 hover:text-[#4ddbff] md:text-base"
              >
                {contactInfo.email}
              </a>
              <p className="mt-6 max-w-sm text-sm leading-6 text-gray-500">
                Tell me what you are making, what is difficult, and where you want it to go. A rough idea is enough to begin.
              </p>
            </div>

            <div className="mt-10">
              <div className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-gray-600">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ddbff] shadow-[0_0_8px_rgba(77,219,255,.7)]" />
                Based in Copenhagen / working remotely
              </div>
              <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.12em] text-gray-500 hover:text-[#4ddbff]"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </nav>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            viewport={{ once: true }}
            className="p-6 md:p-8"
          >
            {isSuccess ? (
              <div className="flex min-h-[410px] flex-col items-start justify-center" role="status" aria-live="polite">
                <span className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-[#4ddbff]">
                  Message received
                </span>
                <h3 className="max-w-md text-3xl font-semibold tracking-[-0.035em] text-white">
                  Thank you. I will get back to you as soon as I can.
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 border border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-500 hover:border-[#4ddbff]/40 hover:text-[#4ddbff]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))}
                  />
                </div>
                <FormField
                  id="contact-name"
                  label="Your name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(value) => setFormData((current) => ({ ...current, name: value }))}
                />
                <FormField
                  id="contact-email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(value) => setFormData((current) => ({ ...current, email: value }))}
                />
                <div>
                  <label htmlFor="contact-message" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-gray-500">
                    Project or idea
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    maxLength={5000}
                    rows={6}
                    value={formData.message}
                    onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                    placeholder="A few lines about what you want to make..."
                    className="w-full resize-none border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-gray-200 outline-none placeholder:text-gray-700 focus:border-[#4ddbff]/45"
                  />
                </div>
                <div className="flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
                  <span className="font-mono text-[9px] uppercase tracking-[0.11em] text-gray-700">
                    Usually answered by email
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => play('hover')}
                    className="border border-[#4ddbff]/40 bg-[#4ddbff]/10 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#4ddbff] hover:bg-[#4ddbff]/20 disabled:cursor-wait disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: 'text' | 'email';
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-gray-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required
        maxLength={type === 'email' ? 254 : 100}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-700 focus:border-[#4ddbff]/45"
      />
    </div>
  );
}
