import { Injectable } from '@angular/core';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase: SupabaseClient;

  constructor() {

    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

  }

  // BLOG IMAGE UPLOAD
  async uploadBlogImage(file: File): Promise<string> {

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await this.supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = this.supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // PROFILE IMAGE UPLOAD
  async uploadProfileImage(file: File): Promise<string> {

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await this.supabase.storage
      .from('user-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = this.supabase.storage
      .from('user-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

}