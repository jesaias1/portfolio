'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiArrowRight, HiArrowLeft, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const projectTypes = [
  { id: 'website', label: 'Hjemmeside', icon: '🌐' },
  { id: 'app', label: 'Web App', icon: '💻' },
  { id: 'game', label: 'Spil', icon: '🎮' },
  { id: 'other', label: 'Andet', icon: '✨' },
];

const timelines = [
  { id: 'asap', label: 'Så hurtigt som muligt', weeks: '1-2 uger' },
  { id: 'flexible', label: 'Fleksibel', weeks: '2-4 uger' },
  { id: 'planning', label: 'Kun planlægning', weeks: '4+ uger' },
];

export default function Contact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    budget: 50000,
    timeline: '',
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.projectType !== '';
      case 2:
        return formData.budget > 0;
      case 3:
        return formData.timeline !== '';
      case 4:
        return formData.name && formData.email;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `
Projekt Type: ${formData.projectType}
Budget: ${formData.budget.toLocaleString('da-DK')} kr
Tidslinje: ${formData.timeline}

Besked:
${formData.message}
          `.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Besked sendt! 🎉');
        setFormData({
          projectType: '',
          budget: 50000,
          timeline: '',
          name: '',
          email: '',
          message: '',
        });
        setStep(1);
      } else {
        toast.error('Der skete en fejl. Prøv igen.');
      }
    } catch (error) {
      toast.error('Der skete en fejl. Prøv igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-display font-light mb-6">
            Lad Os Skabe Noget Fedt
          </h2>
          <p className="text-xl text-gray-400">
            Fortæl mig om dit projekt - det tager kun 2 minutter
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((num) => (
              <motion.div
                key={num}
                className="flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: num * 0.1 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                    num < step
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent'
                      : num === step
                      ? 'border-purple-500 text-purple-400'
                      : 'border-white/20 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {num < step ? <HiCheck /> : num}
                </motion.div>
                {num < 4 && (
                  <motion.div
                    className="w-16 md:w-24 h-1 mx-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: num < step ? 1 : 0 }}
                    style={{
                      background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119))',
                      transformOrigin: 'left',
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Trin {step} af {totalSteps}
          </div>
        </div>

        {/* Form steps */}
        <motion.div className="glass-card p-8 md:p-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div>
                  <h3 className="text-3xl font-display font-light mb-8">
                    Hvad vil du bygge?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {projectTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, projectType: type.label })}
                        className={`p-6 border-2 transition-all text-left ${
                          formData.projectType === type.label
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className="text-4xl mb-3 block">{type.icon}</span>
                        <span className="text-lg font-medium">{type.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-3xl font-display font-light mb-4">
                    Hvad er dit budget?
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Dette hjælper mig med at skræddersy løsningen til dig
                  </p>
                  
                  <div className="space-y-8">
                    <div className="text-center">
                      <motion.div
                        className="text-5xl font-display font-light text-purple-400 mb-2"
                        key={formData.budget}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {formData.budget.toLocaleString('da-DK')} kr
                      </motion.div>
                      <p className="text-sm text-gray-500">
                        {formData.budget < 25000 && 'Landing page eller simpel hjemmeside'}
                        {formData.budget >= 25000 && formData.budget < 75000 && 'Professionel hjemmeside med flere sider'}
                        {formData.budget >= 75000 && formData.budget < 150000 && 'Avanceret web app med custom funktioner'}
                        {formData.budget >= 150000 && 'Enterprise løsning med kompleks backend'}
                      </p>
                    </div>

                    <input
                      type="range"
                      min="10000"
                      max="200000"
                      step="5000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(219, 39, 119) ${((formData.budget - 10000) / 190000) * 100}%, rgba(255,255,255,0.1) ${((formData.budget - 10000) / 190000) * 100}%)`,
                      }}
                    />

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>10.000 kr</span>
                      <span>200.000+ kr</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-3xl font-display font-light mb-8">
                    Hvornår skal det være klar?
                  </h3>
                  <div className="space-y-4">
                    {timelines.map((timeline) => (
                      <motion.button
                        key={timeline.id}
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, timeline: timeline.label })}
                        className={`w-full p-6 border-2 transition-all text-left ${
                          formData.timeline === timeline.label
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-lg font-medium mb-1">{timeline.label}</div>
                            <div className="text-sm text-gray-400">{timeline.weeks}</div>
                          </div>
                          {formData.timeline === timeline.label && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
                            >
                              <HiCheck />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-3xl font-display font-light mb-8">
                    Sidste trin - lad os komme i kontakt
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Dit navn</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-500 transition-all outline-none"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Din email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-500 transition-all outline-none"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Yderligere detaljer (valgfrit)</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-500 transition-all outline-none resize-none"
                        rows={4}
                        placeholder="Fortæl lidt mere om dit projekt..."
                      />
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-12">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/40 transition-all"
            >
              <HiArrowLeft /> Tilbage
            </motion.button>

            {step < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  boxShadow: canProceed() ? '0 0 30px rgba(168, 85, 247, 0.5)' : 'none',
                }}
              >
                Næste <HiArrowRight />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  boxShadow: canProceed() ? '0 0 30px rgba(168, 85, 247, 0.5)' : 'none',
                }}
              >
                {isSubmitting ? 'Sender...' : 'Send Besked'} <HiCheck />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
