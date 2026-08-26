'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// ── Tab Types ──────────────────────────────────────────
type Tab = 'overview' | 'contacts' | 'projects' | 'certifications' | 'achievements' | 'timeline' | 'profile';

// ── Tiny reusable spinner ──────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-8 h-8 border-4 border-primary-fixed border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState({ contacts: 0, projects: 0, certs: 0, achievements: 0, pageViews: 0, timeline: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [c, p, cert, ach, pv, t] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('achievements').select('id', { count: 'exact', head: true }),
        supabase.from('page_views').select('id', { count: 'exact', head: true }),
        supabase.from('timeline').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        contacts: c.count ?? 0,
        projects: p.count ?? 0,
        certs: cert.count ?? 0,
        achievements: ach.count ?? 0,
        pageViews: pv.count ?? 0,
        timeline: t.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Contacts', value: stats.contacts, icon: 'mail', color: 'text-primary-fixed' },
    { label: 'Projects', value: stats.projects, icon: 'code', color: 'text-secondary' },
    { label: 'Certifications', value: stats.certs, icon: 'workspace_premium', color: 'text-primary-fixed' },
    { label: 'Achievements', value: stats.achievements, icon: 'emoji_events', color: 'text-secondary' },
    { label: 'Page Views', value: stats.pageViews, icon: 'visibility', color: 'text-primary-fixed' },
    { label: 'Timeline Items', value: stats.timeline, icon: 'timeline', color: 'text-secondary' },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="glass-card rounded-xl p-5 flex flex-col gap-2">
          <span className={`material-symbols-outlined ${c.color}`}>{c.icon}</span>
          <p className="text-3xl font-extrabold text-on-surface">{c.value}</p>
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── CONTACTS TAB ──────────────────────────────────────
function ContactsTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (id: string) => {
    if (!confirm('Delete this contact message?')) return;
    await supabase.from('contacts').delete().eq('id', id);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-headline-md text-xl font-bold">Contact Messages ({rows.length})</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-on-surface-variant text-sm py-8 text-center">No messages yet.</p>
      ) : (
        rows.map((r) => (
          <div key={r.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 items-baseline mb-1">
                <span className="font-bold text-on-surface">{r.name}</span>
                <span className="text-primary-fixed text-xs">{r.email}</span>
                <span className="text-on-surface-variant text-xs">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              {r.subject && <p className="text-xs text-secondary font-semibold mb-1">Subject: {r.subject}</p>}
              <p className="text-sm text-on-surface-variant">{r.message}</p>
            </div>
            <button onClick={() => del(r.id)} className="text-error hover:bg-error/10 px-3 py-1 rounded text-xs font-semibold border border-error/30 transition-colors shrink-0">
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ── PROJECTS TAB ──────────────────────────────────────
function ProjectsTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image_url: '',
    live_url: '',
    github_url: '',
    featured: false,
    category: 'flagship',
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image_url: '',
    live_url: '',
    github_url: '',
    featured: false,
    category: 'flagship',
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('projects').insert([{
      ...form,
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
    }]);
    setSaving(false);
    setAdding(false);
    setForm({ title: '', description: '', tech_stack: '', image_url: '', live_url: '', github_url: '', featured: false, category: 'flagship' });
    load();
  };

  const startEdit = (project: any) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title || '',
      description: project.description || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      image_url: project.image_url || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      featured: project.featured || false,
      category: project.category || 'flagship',
    });
  };

  const saveEdit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('projects').update({
      ...editForm,
      tech_stack: editForm.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
    }).eq('id', id);
    setSaving(false);
    setEditingId(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('projects').update({ featured: !current }).eq('id', id);
    load();
  };

  const changeCategory = async (id: string, newCategory: string) => {
    await supabase.from('projects').update({ category: newCategory }).eq('id', id);
    load();
  };

  const inputCls = 'w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary-fixed outline-none transition-all';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-xl font-bold">Projects ({rows.length})</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Manage Flagship Projects, Hackathon Builds, and Small Practice Projects</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,219,233,0.3)]">
          {adding ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {adding && (
        <form onSubmit={save} className="glass-card rounded-xl p-6 space-y-3 border border-primary-fixed/20">
          <h3 className="font-bold text-primary-fixed mb-2">New Project</h3>
          <input required className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea required className={inputCls} placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary-fixed mb-1 uppercase tracking-wider">Project Category</label>
              <select 
                className={inputCls} 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="flagship" className="bg-slate-900 text-white">🚀 Flagship Project (Time & Effort)</option>
                <option value="hackathon" className="bg-slate-900 text-white">⚡ Hackathon Build (Sprint)</option>
                <option value="small" className="bg-slate-900 text-white">🧪 Small Project (Fun & Practice)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary-fixed mb-1 uppercase tracking-wider">Featured Status</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
                <span className="text-on-surface-variant">Mark as Featured</span>
              </label>
            </div>
          </div>

          <input required className={inputCls} placeholder="Tech Stack (comma separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
          <input required className={inputCls} placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} placeholder="Live URL (optional)" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            <input className={inputCls} placeholder="GitHub URL (optional)" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
          </div>

          <button type="submit" disabled={saving} className="btn-premium px-6 py-2 rounded-lg text-on-primary-fixed text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </form>
      )}

      {loading ? <Spinner /> : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-5 border border-white/10 transition-all">
              {editingId === r.id ? (
                <form onSubmit={(e) => saveEdit(e, r.id)} className="space-y-3">
                  <h4 className="font-bold text-primary-fixed">Edit Project</h4>
                  <input required className={inputCls} placeholder="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  <textarea required className={inputCls} placeholder="Description" rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-primary-fixed mb-1 uppercase tracking-wider">Project Category</label>
                      <select 
                        className={inputCls} 
                        value={editForm.category} 
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        <option value="flagship" className="bg-slate-900 text-white">🚀 Flagship Project (Time & Effort)</option>
                        <option value="hackathon" className="bg-slate-900 text-white">⚡ Hackathon Build (Sprint)</option>
                        <option value="small" className="bg-slate-900 text-white">🧪 Small Project (Fun & Practice)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary-fixed mb-1 uppercase tracking-wider">Featured</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                        <input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="accent-primary" />
                        <span className="text-on-surface-variant">Mark as Featured</span>
                      </label>
                    </div>
                  </div>

                  <input required className={inputCls} placeholder="Tech Stack (comma separated)" value={editForm.tech_stack} onChange={(e) => setEditForm({ ...editForm, tech_stack: e.target.value })} />
                  <input required className={inputCls} placeholder="Image URL" value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Live URL (optional)" value={editForm.live_url} onChange={(e) => setEditForm({ ...editForm, live_url: e.target.value })} />
                    <input className={inputCls} placeholder="GitHub URL (optional)" value={editForm.github_url} onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={saving} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold uppercase">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="bg-surface-container-highest px-4 py-2 rounded-lg text-xs font-bold uppercase">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex gap-4 items-center flex-1 min-w-0">
                    <img src={r.image_url} alt={r.title} className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0 border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-on-surface truncate text-base">{r.title}</p>
                        
                        {/* Interactive Category Selector Dropdown */}
                        <select 
                          value={r.category || 'flagship'} 
                          onChange={(e) => changeCategory(r.id, e.target.value)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border cursor-pointer outline-none ${
                            r.category === 'flagship' ? 'bg-primary-container/20 text-primary-fixed border-primary-fixed/40' :
                            r.category === 'hackathon' ? 'bg-secondary/20 text-secondary border-secondary/40' :
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          <option value="flagship" className="bg-slate-900 text-white">🚀 Flagship Project</option>
                          <option value="hackathon" className="bg-slate-900 text-white">⚡ Hackathon Build</option>
                          <option value="small" className="bg-slate-900 text-white">🧪 Small / Practice</option>
                        </select>
                      </div>
                      
                      <p className="text-xs text-on-surface-variant line-clamp-1">{r.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(r.tech_stack || []).map((t: string) => (
                          <span key={t} className="px-2 py-0.5 bg-surface-container-highest rounded text-[10px] text-on-surface-variant font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button 
                      onClick={() => toggleFeatured(r.id, r.featured)} 
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                        r.featured 
                          ? 'border-primary-fixed text-primary-fixed bg-primary-fixed/10' 
                          : 'border-white/10 text-on-surface-variant hover:border-white/20'
                      }`}
                    >
                      {r.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                    
                    <button 
                      onClick={() => startEdit(r)} 
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-primary-fixed/30 text-primary-fixed hover:bg-primary-fixed/10 transition-colors"
                    >
                      Edit
                    </button>

                    <button 
                      onClick={() => del(r.id)} 
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-error/30 text-error hover:bg-error/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CERTIFICATIONS TAB ────────────────────────────────
function CertificationsTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', issuer: '', issue_date: '', certificate_url: '', image_url: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('*').order('issue_date', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('certifications').insert([form]);
    setSaving(false);
    setAdding(false);
    setForm({ title: '', issuer: '', issue_date: '', certificate_url: '', image_url: '' });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    await supabase.from('certifications').delete().eq('id', id);
    load();
  };

  const inputCls = 'w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary-fixed outline-none transition-all';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md text-xl font-bold">Certifications ({rows.length})</h2>
        <button onClick={() => setAdding(!adding)} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,219,233,0.3)] transition-all">
          {adding ? 'Cancel' : '+ Add Certification'}
        </button>
      </div>

      {adding && (
        <form onSubmit={save} className="glass-card rounded-xl p-6 space-y-3 border border-secondary/20">
          <h3 className="font-bold text-secondary mb-2">New Certification</h3>
          <input required className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required className={inputCls} placeholder="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
          <input required type="date" className={inputCls} value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
          <input required className={inputCls} placeholder="Certificate Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input className={inputCls} placeholder="Verification URL (optional)" value={form.certificate_url} onChange={(e) => setForm({ ...form, certificate_url: e.target.value })} />
          <button type="submit" disabled={saving} className="btn-premium px-6 py-2 rounded-lg text-on-primary-fixed text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Certification'}
          </button>
        </form>
      )}

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map((r) => (
            <div key={r.id} className="glass-card rounded-xl overflow-hidden flex flex-col">
              <img src={r.image_url} alt={r.title} className="h-40 w-full object-cover bg-black/40" />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="font-bold text-on-surface">{r.title}</p>
                  <p className="text-xs text-primary-fixed mt-0.5">{r.issuer}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Issued: {r.issue_date}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  {r.certificate_url && <a href={r.certificate_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-fixed hover:underline">View</a>}
                  <button onClick={() => del(r.id)} className="ml-auto text-error hover:bg-error/10 px-3 py-1 rounded text-xs font-semibold border border-error/30">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ACHIEVEMENTS TAB ──────────────────────────────────
function AchievementsTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', image_url: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('achievements').select('*').order('date', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('achievements').insert([form]);
    setSaving(false);
    setAdding(false);
    setForm({ title: '', description: '', date: '', image_url: '' });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    await supabase.from('achievements').delete().eq('id', id);
    load();
  };

  const inputCls = 'w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary-fixed outline-none transition-all';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md text-xl font-bold">Achievements ({rows.length})</h2>
        <button onClick={() => setAdding(!adding)} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,219,233,0.3)] transition-all">
          {adding ? 'Cancel' : '+ Add Achievement'}
        </button>
      </div>

      {adding && (
        <form onSubmit={save} className="glass-card rounded-xl p-6 space-y-3 border border-primary-fixed/20">
          <h3 className="font-bold text-primary-fixed mb-2">New Achievement</h3>
          <input required className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea required className={inputCls} placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input required type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className={inputCls} placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <button type="submit" disabled={saving} className="btn-premium px-6 py-2 rounded-lg text-on-primary-fixed text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Achievement'}
          </button>
        </form>
      )}

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-4 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/10 border border-primary-fixed/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-fixed">emoji_events</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{r.title}</p>
                <p className="text-xs text-primary-fixed">{r.date}</p>
                <p className="text-sm text-on-surface-variant mt-1">{r.description}</p>
              </div>
              <button onClick={() => del(r.id)} className="text-error hover:bg-error/10 px-3 py-1 rounded text-xs font-semibold border border-error/30 shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROFILE TAB ───────────────────────────────────────
function ProfileTab() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('profile').select('*').limit(1).single();
    if (data) {
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Check if profile exists
    const { data: current } = await supabase.from('profile').select('*').limit(1).single();
    let resError = null;
    if (current) {
      const { error } = await supabase.from('profile').update({ avatar_url: avatarUrl }).eq('id', current.id);
      resError = error;
    } else {
      const { error } = await supabase.from('profile').insert([{ name: 'Deepinder Singh', avatar_url: avatarUrl }]);
      resError = error;
    }

    setSaving(false);
    if (resError) {
      alert('Error saving profile: ' + resError.message);
    } else {
      alert('Profile updated successfully!');
      load();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${Date.now()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      alert('Image uploaded successfully! Please click "Save Changes" to apply it to your profile.');
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const inputCls = 'w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary-fixed outline-none transition-all';

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-headline-md text-xl font-bold">Customize Profile Picture</h2>
        <p className="text-xs text-on-surface-variant mt-1">Select a new portrait image for the homepage About section.</p>
      </div>

      <form onSubmit={save} className="glass-card rounded-xl p-6 space-y-6 border border-primary-fixed/20">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar Preview */}
          <div className="relative group w-36 h-36 rounded-xl overflow-hidden border border-white/10 bg-surface-container-low shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">No Image</div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary-fixed border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-grow space-y-4 w-full">
            {/* Upload File */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary-fixed uppercase tracking-wider">Upload Local Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                disabled={uploading}
                className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary-container file:text-on-primary-container hover:file:opacity-90 file:cursor-pointer"
              />
            </div>

            {/* Direct URL Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary-fixed uppercase tracking-wider">Or Enter Image URL</label>
              <input 
                type="url" 
                className={inputCls} 
                placeholder="https://example.com/portrait.jpg" 
                value={avatarUrl} 
                onChange={(e) => setAvatarUrl(e.target.value)} 
                disabled={uploading || saving}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving || uploading} 
          className="btn-premium px-6 py-2.5 rounded-lg text-on-primary-fixed text-xs font-bold uppercase tracking-wider disabled:opacity-50 w-full"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

// ── TIMELINE TAB ──────────────────────────────────────
function TimelineTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ role: '', company: '', description: '', order_index: 0 });
  const [editForm, setEditForm] = useState({ role: '', company: '', description: '', order_index: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('timeline').select('*').order('order_index', { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('timeline').insert([form]);
    setSaving(false);
    setAdding(false);
    setForm({ role: '', company: '', description: '', order_index: rows.length });
    load();
  };

  const saveEdit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('timeline').update(editForm).eq('id', id);
    setSaving(false);
    setEditingId(null);
    load();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      role: item.role,
      company: item.company,
      description: item.description,
      order_index: item.order_index
    });
  };

  const del = async (id: string) => {
    if (!confirm('Delete this timeline event?')) return;
    await supabase.from('timeline').delete().eq('id', id);
    load();
  };

  const inputCls = 'w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary-fixed outline-none transition-all';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md text-xl font-bold">Operational Timeline ({rows.length})</h2>
        <button onClick={() => { setAdding(!adding); setForm({ ...form, order_index: rows.length }); }} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,219,233,0.3)]">
          {adding ? 'Cancel' : '+ Add Timeline Item'}
        </button>
      </div>

      {adding && (
        <form onSubmit={save} className="glass-card rounded-xl p-6 space-y-3 border border-primary-fixed/20">
          <h3 className="font-bold text-primary-fixed mb-2">New Timeline Item</h3>
          <input required className={inputCls} placeholder="Role / Signature (e.g. Founder & CEO)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <input required className={inputCls} placeholder="Company / Institution (e.g. Zanqir)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <textarea required className={inputCls} placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input required type="number" className={inputCls} placeholder="Order Index" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} />
          <button type="submit" disabled={saving} className="btn-premium px-6 py-2 rounded-lg text-on-primary-fixed text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Item'}
          </button>
        </form>
      )}

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-5 border border-white/5">
              {editingId === r.id ? (
                <form onSubmit={(e) => saveEdit(e, r.id)} className="space-y-3">
                  <input required className={inputCls} placeholder="Role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} />
                  <input required className={inputCls} placeholder="Company" value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} />
                  <textarea required className={inputCls} placeholder="Description" rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  <input required type="number" className={inputCls} placeholder="Order Index" value={editForm.order_index} onChange={(e) => setEditForm({ ...editForm, order_index: parseInt(e.target.value) || 0 })} />
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-semibold uppercase">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="bg-surface-container-highest px-4 py-2 rounded-lg text-xs font-semibold uppercase">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed/10 border border-primary-fixed/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary-fixed">timeline</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface">{r.company}</p>
                    <p className="text-xs text-primary-fixed">{r.role} • Index: {r.order_index}</p>
                    <p className="text-sm text-on-surface-variant mt-2">{r.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(r)} className="text-primary-fixed hover:bg-primary-fixed/10 px-3 py-1 rounded text-xs font-semibold border border-primary-fixed/30">Edit</button>
                    <button onClick={() => del(r.id)} className="text-error hover:bg-error/10 px-3 py-1 rounded text-xs font-semibold border border-error/30">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN ADMIN PAGE ───────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [userEmail, setUserEmail] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setUserEmail(session.user.email ?? '');
        setAuthChecked(true);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!authChecked) return <Spinner />;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'contacts', label: 'Contacts', icon: 'mail' },
    { id: 'projects', label: 'Projects', icon: 'code' },
    { id: 'certifications', label: 'Certifications', icon: 'workspace_premium' },
    { id: 'achievements', label: 'Achievements', icon: 'emoji_events' },
    { id: 'timeline', label: 'Timeline', icon: 'timeline' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary-fixed">Admin Dashboard</h1>
          <p className="text-xs text-on-surface-variant mt-1">Logged in as <span className="text-on-surface">{userEmail}</span></p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-error/30 text-error hover:bg-error/10 text-xs font-semibold transition-colors">
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              tab === t.id
                ? 'bg-primary-container/20 text-primary-fixed border border-primary-fixed/30'
                : 'text-on-surface-variant hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'certifications' && <CertificationsTab />}
        {tab === 'achievements' && <AchievementsTab />}
        {tab === 'timeline' && <TimelineTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
    </main>
  );
}
