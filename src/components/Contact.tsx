'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Alle felter skal udfyldes');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('[✓] Besked sendt!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('[✗] Fejl. Prøv igen.');
      }
    } catch (error) {
      toast.error('[✗] Netværksfejl. Prøv igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-sm text-[#00ff41]" style={{ textShadow: '0 0 8px rgba(0, 255, 65, 0.3)' }}>
              ~/kontakt
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ff41]/20 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            Lad Os Snakke
          </h2>
          <p className="text-gray-500 font-mono text-sm">
            {'>'} init --new-project --collaborate
          </p>
        </motion.div>

        {/* Terminal-style form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Terminal window */}
          <div className="border border-white/5">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-[10px] text-gray-600 ml-2">
                kontakt@jesaias.dev
              </span>
            </div>

            {/* Terminal body */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-[#0c0c0c] space-y-6">
              {/* Name */}
              <TerminalInput
                label="name"
                type="text"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="Dit navn"
                focused={focusedField === 'name'}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />

              {/* Email */}
              <TerminalInput
                label="email"
                type="email"
                value={formData.email}
                onChange={(val) => setFormData({ ...formData, email: val })}
                placeholder="din@email.dk"
                focused={focusedField === 'email'}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />

              {/* Message */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-gray-500">
                  <span className="text-[#00ff41]">{'>'}</span> message:
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  placeholder="Fortæl mig om dit projekt..."
                  className={`w-full px-4 py-3 bg-white/[0.02] font-mono text-sm text-gray-200 placeholder-gray-700 outline-none resize-none transition-all border ${
                    focusedField === 'message'
                      ? 'border-[#00ff41]/40 shadow-[0_0_10px_rgba(0,255,65,0.05)]'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] text-gray-700">
                  {formData.name && formData.email && formData.message 
                    ? '[ready to send]' 
                    : '[fill all fields]'
                  }
                </span>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className="font-mono text-sm px-6 py-3 bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/20 hover:border-[#00ff41]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 255, 65, 0.1)',
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⟳
                      </motion.span>
                      sending...
                    </span>
                  ) : (
                    './send_besked'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Alternative contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="font-mono text-xs text-gray-600">
            eller skriv direkte til{' '}
            <a 
              href="mailto:jesaias@jesaias.dev" 
              className="text-[#00ff41]/70 hover:text-[#00ff41] transition-colors"
            >
              jesaias@jesaias.dev
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TerminalInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  focused,
  onFocus,
  onBlur,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-xs text-gray-500">
        <span className="text-[#00ff41]">{'>'}</span> {label}:
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/[0.02] font-mono text-sm text-gray-200 placeholder-gray-700 outline-none transition-all border ${
          focused
            ? 'border-[#00ff41]/40 shadow-[0_0_10px_rgba(0,255,65,0.05)]'
            : 'border-white/5 hover:border-white/10'
        }`}
      />
    </div>
  );
}
