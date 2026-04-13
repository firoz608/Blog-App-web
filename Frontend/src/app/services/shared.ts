import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Shared {
    private blogPosts: any[] = [];

  setBlogPosts(posts: any[]=[]) {
    this.blogPosts = posts;
    console.log(this.blogPosts);
    
  }

  getBlogPosts() {
    return this.blogPosts;
  }

}
