import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-posts',
  imports: [
    CommonModule
  ],
  templateUrl: './all-posts.html',
  styleUrl: './all-posts.css',
})
export class AllPosts {
constructor(private _router: Router,private _blogService:BlogService) { }
  apiUrl = 'https://localhost:7059';
  blogposts:any[]=[];
  ngOnInit(){
    this.loadblog();
  }
  loadblog(){
    this._blogService.getAllBlogPosts().subscribe(res=>{
      this.blogposts=res as any[];
    })
  }

  gotodashboard() {
    this._router.navigate(['/dashboard']);
  }
  

   commentblog(blogid: any) {
    this._router.navigate(
        ['/commentblog'],
        { state: { blogId: blogid } }
      )
  }
}
