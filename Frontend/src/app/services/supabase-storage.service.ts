import { Injectable } from '@angular/core';
import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {

  // BLOG IMAGE UPLOAD
  async uploadBlogImage(file: File): Promise<string> {

    const fileName = `blog-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // PROFILE IMAGE UPLOAD
  async uploadProfileImage(file: File): Promise<string> {

    const fileName = `profile-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('user-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from('user-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}