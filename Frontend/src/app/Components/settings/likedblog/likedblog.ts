import { Component } from '@angular/core';
import { BlogService } from '../../../services/blog-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-likedblog',
  imports: [
    CommonModule
  ],
  templateUrl: './likedblog.html',
  styleUrl: './likedblog.css',
})
export class Likedblog {
  apiUrl='https://localhost:7059';
blogposts:any[]=[];
  currentUserId: number = 0;

constructor(private blogService:BlogService,private _router:Router){
}
ngOnInit(){
   const user = JSON.parse(localStorage.getItem("user") || '{}');
  if (user.id) {
        const parsedUser = user;
      this.currentUserId = parsedUser.id; 
  }
  this.loadBlogs();
}
  loadBlogs() {
    this.blogService.getAllBlogs(this.currentUserId).subscribe(
      (posts) => {
        this.blogposts = posts as any[];
      
        this.blogposts=this.blogposts.filter(blog=>blog.isLiked===true);

      },
      (error) => {
        console.error('Error fetching blog posts:', error);
      }
    );
    
  }


  likeBlog(blog: any) {
       
        
        this.blogService.toggleLike(blog.id, this.currentUserId).subscribe({
      next: (res: any) => {
        blog.likes = res.likes;
        blog.isLiked = res.liked;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  gotodashboard(){
    this._router.navigate(['/dashboard'])
  }

}
