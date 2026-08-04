'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
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
  HiX,
  HiMenu
} from 'react-icons/hi';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { projectStatuses, type ProjectStatus } from '@/lib/project-metadata';
import { isSafeMediaReference } from '@/lib/media-reference';

interface Project {
  id: string;
  title: string;
  description: string;
  longDesc?: string;
  image: string;
  video?: string;
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  order: number;
  status?: ProjectStatus | 'Project';
  visible?: boolean;
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
  resume?: string;
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
        fetch('/api/projects?admin=1'),
        fetch('/api/about'),
        fetch('/api/contact'),
      ]);
      
      setProjects(await projectsRes.json());
      setAbout(await aboutRes.json());
      setContact(await contactRes.json());
    } catch {
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
    } catch {
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
            <motion.a
              href="/?portfolioPreview=1#projects"
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(77, 219, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-amber-400/30 text-amber-300 hover:bg-amber-400/5 transition-all font-mono text-xs uppercase tracking-widest"
            >
              Preview Hidden
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
  projects: initialProjects, 
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
  const [projects, setProjects] = useState(initialProjects);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProjects(items);

    const payload = items.map((item, index) => ({ id: item.id, order: index }));
    setIsUpdatingOrder(true);

    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      if (res.ok) {
        toast.success('Rækkefølge gemt!');
      } else {
        toast.error('Kunne ikke gemme rækkefølgen');
        setProjects(initialProjects);
      }
    } catch {
      toast.error('Netværksfejl ved gemning af rækkefølge');
      setProjects(initialProjects);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

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

      <div className="mb-6 grid gap-3 border border-[#4ddbff]/15 bg-[#4ddbff]/[0.035] p-4 md:grid-cols-[auto_1fr] md:items-start md:gap-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#4ddbff]">
          Media workflow
        </span>
        <p className="font-mono text-[10px] leading-5 text-gray-500">
          Add a poster image first, then an optional silent MP4 or WebM preview. Videos only load
          on desktop hover; touch devices, reduced-motion users and data-saver mode keep the poster.
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 mt-4 relative">
              {isUpdatingOrder && (
                <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px] rounded-lg"></div>
              )}
              {projects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between p-4 bg-black/30 border ${
                        snapshot.isDragging ? 'border-[#4ddbff] shadow-[0_0_15px_rgba(77,219,255,0.2)] z-20' : 'border-white/10 hover:border-indigo-500/30'
                      } transition-colors group`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          {...provided.dragHandleProps} 
                          className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing p-2"
                        >
                          <HiMenu className="text-xl" />
                        </div>
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all"
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{project.title}</h3>
                            <span className="border border-[#4ddbff]/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#4ddbff]/70">
                              {project.status || 'Project'}
                            </span>
                            <span className="border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                              {project.video ? 'Video ready' : 'Poster only'}
                            </span>
                            {project.visible === false ? (
                              <span className="border border-amber-400/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300/70">
                                Hidden
                              </span>
                            ) : null}
                          </div>
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
                      <div className="flex gap-2 pl-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(project)}
                          aria-label={`Edit ${project.title}`}
                          className="p-3 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400 transition-all"
                        >
                          <HiPencil />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(project.id)}
                          aria-label={`Delete ${project.title}`}
                          disabled={isDeleting === project.id}
                          className="p-3 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-all disabled:opacity-50"
                        >
                          {isDeleting === project.id ? '⟳' : <HiTrash />}
                        </motion.button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Om sektion opdateret!');
        onUpdate();
      } else {
        toast.error('Kunne ikke opdatere');
      }
    } catch {
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
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/headshot.jpg"
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Kontaktinfo opdateret!');
        onUpdate();
      } else {
        toast.error('Kunne ikke opdatere');
      }
    } catch {
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

        <div>
          <label className="block text-sm mb-2 text-gray-400">CV / Resume URL</label>
          <input
            type="text"
            value={formData.resume || ''}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
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
    longDesc: project?.longDesc || '',
    image: project?.image || '',
    video: project?.video || '',
    tags: project?.tags.join(', ') || '',
    link: project?.link || '',
    github: project?.github || '',
    featured: project?.featured || false,
    order: project?.order || 0,
    status: project?.status || 'Project',
    visible: project?.visible !== false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSafeMediaReference(formData.image, true)) {
      toast.error('Use a local /projects/... path or a secure HTTPS poster URL');
      return;
    }
    if (!isSafeMediaReference(formData.video)) {
      toast.error('Use a local /projects/videos/... path or a secure HTTPS video URL');
      return;
    }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(project ? 'Projekt opdateret!' : 'Projekt oprettet!');
        onSave();
      } else {
        toast.error('Kunne ikke gemme projekt');
      }
    } catch {
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
            <label className="block text-sm mb-2 text-gray-400">Lang projektbeskrivelse</label>
            <textarea
              value={formData.longDesc}
              onChange={(e) => setFormData({ ...formData, longDesc: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">Poster image path</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="/projects/project-name.webp"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
            <p className="mt-2 font-mono text-[10px] leading-5 text-gray-600">
              Always shown on mobile and while a video is loading. WebP is recommended.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">Hover-preview video path</label>
            <input
              type="text"
              value={formData.video}
              onChange={(e) => setFormData({ ...formData, video: e.target.value })}
              placeholder="/projects/videos/project-name.mp4"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
            <p className="mt-2 font-mono text-[10px] leading-5 text-gray-600">
              Optional. Use a muted MP4 or WebM clip under 8 MB; the portfolio loads it only when useful.
            </p>
          </div>

          <ProjectMediaPreview
            key={`${formData.image}|${formData.video}`}
            title={formData.title || 'Project'}
            image={formData.image}
            video={formData.video}
          />

          <div>
            <label className="block text-sm mb-2 text-gray-400">Offentlig status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus | 'Project' })}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-colors"
            >
              <option value="Project">Project</option>
              {projectStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-sm text-gray-400">Vis på portfolio</span>
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

function ProjectMediaPreview({
  title,
  image,
  video,
}: {
  title: string;
  image: string;
  video: string;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const validImage = isSafeMediaReference(image, true);
  const validVideo = isSafeMediaReference(video) && Boolean(video.trim());

  return (
    <div className="border border-white/10 bg-black/30 p-3">
      <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.12em]">
        <span className="text-gray-500">Card media preview</span>
        <span className={validVideo && !videoFailed ? 'text-[#4ddbff]' : 'text-gray-600'}>
          {validVideo && !videoFailed ? 'Silent video' : 'Poster fallback'}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border border-white/[0.07] bg-[#050607]">
        {validVideo && !videoFailed ? (
          <video
            key={video}
            src={video}
            poster={validImage ? image : undefined}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={`${title} silent project-card preview`}
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : validImage ? (
          <div
            role="img"
            aria-label={`${title} poster preview`}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
          />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-gray-700">
            Add a valid poster path to preview this card
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/65">
          {title}
        </span>
      </div>

      {videoFailed ? (
        <p className="mt-3 font-mono text-[10px] leading-5 text-amber-300/70">
          The video could not be loaded. The public card will safely keep using its poster.
        </p>
      ) : null}
    </div>
  );
}
