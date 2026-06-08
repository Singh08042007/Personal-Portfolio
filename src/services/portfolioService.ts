import { supabase } from '@/lib/supabaseClient';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  certificate_url?: string;
  image_url: string;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  category: string;
  description?: string;
  created_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  created_at?: string;
}

export interface TimelineEvent {
  id: string;
  role: string;
  company: string;
  description: string;
  order_index: number;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  created_at?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const portfolioService = {
  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  // Certificates
  async getCertificates(): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
    return data || [];
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
    return data || [];
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
    return data || [];
  },

  // Contact form submission
  async submitContactForm(form: ContactForm): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('contacts')
      .insert([form]);

    if (error) {
      console.error('Error submitting contact form:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  // Analytics - Track Page View
  async trackPageView(pagePath: string, visitorId?: string): Promise<void> {
    const { error } = await supabase
      .from('page_views')
      .insert([{ page_path: pagePath, visitor_id: visitorId || 'anonymous' }]);

    if (error) {
      console.error('Error tracking page view:', error);
    }
  },

  // Analytics - Track Project View
  async trackProjectView(projectId: string, visitorId?: string): Promise<void> {
    const { error } = await supabase
      .from('project_views')
      .insert([{ project_id: projectId, visitor_id: visitorId || 'anonymous' }]);

    if (error) {
      console.error('Error tracking project view:', error);
    }
  },

  // Timeline Event CRUD
  async getTimelineEvents(): Promise<TimelineEvent[]> {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching timeline events:', error);
      return [];
    }
    return data || [];
  },

  async addTimelineEvent(event: Omit<TimelineEvent, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('timeline')
      .insert([event]);

    if (error) {
      console.error('Error adding timeline event:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async updateTimelineEvent(id: string, event: Partial<Omit<TimelineEvent, 'id' | 'created_at'>>): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('timeline')
      .update(event)
      .eq('id', id);

    if (error) {
      console.error('Error updating timeline event:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteTimelineEvent(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('timeline')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting timeline event:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  // Profile CRUD
  async getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
    // Check if profile exists first
    const current = await this.getProfile();
    if (current) {
      const { error } = await supabase
        .from('profile')
        .update({ avatar_url: avatarUrl })
        .eq('id', current.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } else {
      // If not exist, insert it
      const { error } = await supabase
        .from('profile')
        .insert([{ name: 'Deepinder Singh', avatar_url: avatarUrl }]);

      if (error) {
        console.error('Error creating profile:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    }
  }
};
