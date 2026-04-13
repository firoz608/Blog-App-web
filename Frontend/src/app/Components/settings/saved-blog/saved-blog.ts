import { Component } from '@angular/core';
import { BlogService } from '../../../services/blog-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-saved-blog',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './saved-blog.html',
  styleUrl: './saved-blog.css',
})
export class SavedBlog {
  apiUrl='https://localhost:7059';
  blogposts:any[]=[];
  currentUserId: number = 0;
  constructor(private _blogservice: BlogService,private _router:Router) { }
  isLiked:boolean=false;
  ngOnInit() {
     const user = JSON.parse(localStorage.getItem("user") || '{}');

    if (user.id) {
        const parsedUser = user;
        
        this.currentUserId = parsedUser.id; 
    }
    this.onload();
}

onload(){
     this._blogservice.getSavedBlogs(this.currentUserId).subscribe(
      (posts) => {
        this.blogposts = posts as any[];
     
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
      }
    );
}

 saveBlog(blog: any) {
this._blogservice.toggleSave(blog.id, this.currentUserId).subscribe({
    next: (res) => {
      this.onload(); 
      
      
      alert(res.message);
    },
    error: (err) => {
      console.error(err);
    }
  });

  }


  gotodashboard(){
    this._router.navigate(['/dashboard'])
  }
}
