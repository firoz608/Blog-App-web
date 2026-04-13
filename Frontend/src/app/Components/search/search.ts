import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BlogService } from '../../services/blog-service';
import { CommonModule } from '@angular/common';
import { Shared } from '../../services/shared';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search',
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterLink,
    FormsModule
],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  search = faSearch;
  apiUrl = 'https://localhost:7059';
  blogPosts: any[] = [];
  searchblogPosts:any[]=[];
   isProfileMenuOpen: boolean = false;
   isLoggedIn: boolean = false;
   profileImage: any = 'assets/default-avatar.jpg'; // default image
   settings = faGear;
   currentUserId: number = 0;
 
  constructor(private _blogservice: BlogService,private _shared:Shared,private _router:Router,private authService:AuthService) { }
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    const search=localStorage.getItem('searchValue')==='true';
    if(search==false){
      this.loadBlogs();
    }
    else{
      this.searchblogPosts=this._shared.getBlogPosts();
      localStorage.setItem('searchValue', 'false');
      this.loadBlogs2();
    }


    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const parsedUser = user;
      this.currentUserId = parsedUser.id; 
    if (user.id) {

      this.authService.getprofilepic(user.id)
        .subscribe((imageBlob: Blob) => {

          const imageUrl = URL.createObjectURL(imageBlob);
          this.profileImage = imageUrl;
          localStorage.setItem("profilePicture", this.profileImage);
        });
    }



  }

  loadBlogs() {
    this._blogservice.getAllBlogPosts().subscribe(
      (posts) => {
        this.blogPosts = posts as any[];


        this.searchblogPosts=posts as any[];
        
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
      }
    );
  }
    loadBlogs2() {
    this._blogservice.getAllBlogPosts().subscribe(
      (posts) => {
        this.blogPosts = posts as any[];
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
      }
    );
  }

  searchblog(searchTerm: string) {
    if (searchTerm.trim() === '') {
      this.loadBlogs();
    } else {
      this.searchblogPosts = this.blogPosts.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.author.toLowerCase().includes(searchTerm)
      );
      
      

    }

  }


  likeBlog(blog: any) {
   
        this._blogservice.toggleLike(blog.id, this.currentUserId).subscribe({
      next: (res: any) => {
        blog.likes = res.likes;
        blog.isLiked = res.liked;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  saveBlog(blog: any) {
  this._blogservice.toggleSave(blog.id, this.currentUserId).subscribe({
    next: (res) => {
      
      
      alert(res.message);
    },
    error: (err) => {
      console.error(err);
    }
  });
 

  }

  commentblog(blogid: any) {
     this._router.navigate(
        ['/commentblog'],
        { state: { blogId: blogid } }
      )

  }

    logoutfunc() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }


   getAuthorName(): string {
    const storedUser = JSON.parse(localStorage.getItem("user")!);
    return storedUser ? storedUser.name : "Unknown Author";

  }

}
