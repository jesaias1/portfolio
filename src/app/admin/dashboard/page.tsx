'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { 
  HiFolder, 
  HiUser, 
  HiMail, 
  HiLogout,
  HiPencil,
  HiTrash,
  HiPlus,
  HiX
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  order: number;
}

interface AboutData {
  title: string;
  content: string;
  image: string;
  skills: string[];
}

interface ContactData {
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

type Tab = 'projects' | 'about' | 'contact';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setAktivTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [projectsRes, aboutRes, contactRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/about'),
        fetch('/api/contact'),
      ]);
      
      setProjects(await projectsRes.json());
      setAbout(await aboutRes.json());
      setContact(await contactRes.json());
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Er du sikker på, at du vil slette dette projekt?')) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('Projekt slettet');
        fetchData();
      } else {
        toast.error('Kunne ikke slette projekt');
      }
    } catch (error) {
      toast.error('Der opstod en fejl');
    } finally {
      setIsDeleting(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-2 border-[#4ddbff]/10 border-t-[#4ddbff] rounded-full"
        />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-6 relative">
      {/* Animated background - Cyan scanlines */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(77,219,255,0.03)_0%,transparent_100%)]" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-20 bg-gradient-to-b from-transparent via-[#4ddbff]/10 to-transparent"
            style={{
              left: `${(i / 20) * 100}%`,
              top: '-80px',
            }}
            animate={{
              y: ['0vh', '110vh'],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12 pb-6 border-b border-[#4ddbff]/10"
        >
          <div>
            <div className="inline-block border border-[#4ddbff]/20 bg-[#0c0c0c] px-3 py-0.5 mb-4">
              <span className="font-mono text-[10px] text-[#4ddbff]">SESSION_AUTH: ACTIVE</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
              Control Panel
            </h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
              Welcome back, <span className="text-[#4ddbff]">{session.user?.email}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <motion.a
              href="/"
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(77, 219, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-[#4ddbff]/30 text-[#4ddbff] hover:bg-[#4ddbff]/5 transition-all font-mono text-xs uppercase tracking-widest"
            >
              View Site
            </motion.a>
            <motion.button
              onClick={() => signOut({ callbackUrl: '/' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-mono text-xs uppercase tracking-widest"
            >
              <HiLogout />
              Terminate
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/5">
          {[
            { id: 'projects', label: 'Projects', icon: HiFolder },
            { id: 'about', label: 'System Bio', icon: HiUser },
            { id: 'contact', label: 'Comm Link', icon: HiMail },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setAktivTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#4ddbff]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ddbff]"
                  style={{ boxShadow: '0 0 10px rgba(77, 219, 255, 0.5)' }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Indhold */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onEdit={(project) => {
                setEditingProject(project);
                setShowProjectModal(true);
              }}
              onCreate={() => {
                setEditingProject(null);
                setShowProjectModal(true);
              }}
              onDelete={handleDeleteProject}
              isDeleting={isDeleting}
            />
          )}
          
          {activeTab === 'about' && about && (
            <AboutTab
              data={about}
              onUpdate={() => fetchData()}
            />
          )}
          
          {activeTab === 'contact' && contact && (
            <ContactTab
              data={contact}
              onUpdate={() => fetchData()}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <ProjectModal
            project={editingProject}
            onClose={() => {
              setShowProjectModal(false);
              setEditingProject(null);
            }}
            onSave={() => {
              setShowProjectModal(false);
              setEditingProject(null);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Projects Tab Component
function ProjectsTab({ 
  projects, 
  onEdit, 
  onCreate, 
  onDelete, 
  isDeleting 
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  isDeleting: string | null;
}) {
  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-light">Administrer Projekter</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all"
        >
          <HiPlus /> TILFØJ PROJEKT
        </motion.button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-4 bg-black/30 border border-white/10 hover:border-indigo-500/30 transition-all group"
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={project.image}
                alt={project.title}
                className="w-20 h-20 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1">{project.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {project.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-indigo-400 border border-indigo-500/30 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(project)}
                className="p-3 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400 transition-all"
              >
                <HiPencil />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(project.id)}
                disabled={isDeleting === project.id}
                className="p-3 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-all disabled:opacity-50"
              >
                {isDeleting === project.id ? '⟳' : <HiTrash />}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// About Tab Component
function AboutTab({ data, onUpdate }: { data: AboutData; onUpdate: () => void }) {
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/about/update', {
        method: 'PUT',
        headers: { 'Indhold-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Om sektion opdateret!');
        onUpdate();
      } else {
        toast.error('Kunne ikke opdatere');
      }
    } catch (error) {
      toast.error('Der opstod en fejl');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8"
    >
      <h2 className="text-2xl font-display font-light mb-8">Rediger Om Sektion</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm mb-2 text-gray-400">Titel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-400">Indhold</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-400">Billede URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-400">Færdigheder (kommasepareret)</label>
          <textarea
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData({ 
              ...formData, 
              skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            rows={3}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors resize-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? 'GEMMER...' : 'GEM ÆNDRINGER'}
        </motion.button>
      </form>
    </motion.div>
  );
}

// Contact Tab Component
function ContactTab({ data, onUpdate }: { data: ContactData; onUpdate: () => void }) {
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/contact/update', {
        method: 'PUT',
        headers: { 'Indhold-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Kontaktinfo opdateret!');
        onUpdate();
      } else {
        toast.error('Kunne ikke opdatere');
      }
    } catch (error) {
      toast.error('Der opstod en fejl');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8"
    >
      <h2 className="text-2xl font-display font-light mb-8">Rediger Kontaktinformation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm mb-2 text-gray-400">E-mail</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 text-gray-400">GitHub</label>
            <input
              type="url"
              value={formData.github || ''}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-400">Twitter</label>
          <input
            type="url"
            value={formData.twitter || ''}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? 'GEMMER...' : 'GEM ÆNDRINGER'}
        </motion.button>
      </form>
    </motion.div>
  );
}

// Project Modal Component (same as before but with gradient buttons)
function ProjectModal({ 
  project, 
  onClose, 
  onSave 
}: { 
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    tags: project?.tags.join(', ') || '',
    link: project?.link || '',
    github: project?.github || '',
    featured: project?.featured || false,
    order: project?.order || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = project 
        ? `/api/projects/${project.id}`
        : '/api/projects/create';
      
      const method = project ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Indhold-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(project ? 'Projekt opdateret!' : 'Projekt oprettet!');
        onSave();
      } else {
        toast.error('Kunne ikke gemme projekt');
      }
    } catch (error) {
      toast.error('Der opstod en fejl');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-display font-light">
            {project ? 'Rediger Projekt' : 'Nyt Projekt'}
          </h3>
          <button onClick={onClose} className="text-2xl hover:text-gray-400 transition-colors">
            <HiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gray-400">Titel</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">Beskrivelse</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">Billede URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">Tags (kommasepareret)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-400">Projekt Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-400">GitHub Link</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-sm text-gray-400">Fremhævet Projekt</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSaving ? 'GEMMER...' : 'GEM PROJEKT'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 border border-white/20 hover:bg-white/5 transition-all"
            >
              ANNULLER
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
