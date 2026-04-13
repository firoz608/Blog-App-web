import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog-service';
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../services/auth-service';
import { concatMap, switchMap } from 'rxjs';
import { Shared } from '../../services/shared';



@Component({
  selector: 'app-dashboard',
  imports: [
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor(private fb: FormBuilder, private _blogservice: BlogService, private _router: Router, private authService: AuthService, private _shared: Shared) { }
  apiUrl = 'https://localhost:7059';
  write = faPen;
  search = faSearch;
  user = faUser;
  settings = faGear;
  logout = faSignOut;
  heart = faHeart;
  saved = faSave;
  isProfileMenuOpen: boolean = false;
  showPopup = false;
  savecolor: string = "black";
  blogForm!: FormGroup;
  blogPosts: any[] = [];
  searchblogPosts: any[] = [];
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  profileImage: any = 'assets/default-avatar.jpg'; // default image
  latestBlog: any;
  showCommentPopup = false;
  CommentblogPosts: any[] = [];
  loadcmnt: any[] = [];
  isLoggedIn: boolean = false;
  latestblogprofileImage: any = 'assets/default-avatar.jpg'; // default image

  currentUserId: number = 0;



  logoutfunc() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  ngOnInit() {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.loadBlogs();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadlatestblog();

    const user = JSON.parse(localStorage.getItem("user") || '{}');

    if (user.id) {
      const parsedUser = user;

      this.currentUserId = parsedUser.id;
      this.authService.getprofilepic(user.id)
        .subscribe((imageBlob: Blob) => {

          const imageUrl = URL.createObjectURL(imageBlob);
          this.profileImage = imageUrl;
          localStorage.setItem("profilePicture", this.profileImage);
        });
    }



    if (!this.imagePreview) {
      this.imagePreview = "assets/default-upld-image2.png"; // set default image 
    }


  }

  ngDoCheck() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
  loadlatestblog() {
    this._blogservice.getLatestBlog().pipe(
      switchMap(res => {
        this.latestBlog = res;


        return this.authService.getprofilepic(res.userId);
      })
    ).subscribe((imageBlob: Blob) => {

      const imageUrl = URL.createObjectURL(imageBlob);
      this.latestblogprofileImage = imageUrl;

      console.log(this.latestblogprofileImage);

      // optional
      localStorage.setItem("latestblogprofileImage", imageUrl);
    });
  }

  loadBlogs() {
    this._blogservice.getAllBlogPosts().subscribe(
      (posts) => {
        this.blogPosts = posts as any[];
        this.searchblogPosts = posts as any[];


      },
      (error) => {
        console.error('Error fetching blog posts:', error);
      }
    );
  }



  getAuthorName(): string {
    const storedUser = JSON.parse(localStorage.getItem("user")!);
    return storedUser ? storedUser.name : "Unknown Author";

  }
  getuserid(): number {
    const storedUser = JSON.parse(localStorage.getItem("user")!);
    return storedUser ? storedUser.id : 0;
  }

  openPopup() {
    if (this.isLoggedIn) {

      this.showPopup = true;
    }
    else {
      this._router.navigate(['/login']);
    }
  }

  closePopup() {
    this.showPopup = false;
    this.blogForm.reset();
    this.showCommentPopup = false;
    if (this.imagePreview) {
      this.imagePreview = "assets/default-upld-image2.png"; // set default image 
    }

  }

  submitBlog() {


    const formData = new FormData();

    formData.append('userId', this.getuserid() as any);
    formData.append('title', this.blogForm.value.title);
    formData.append('content', this.blogForm.value.content);
    formData.append('author', this.getAuthorName());
    formData.append('Bloglikes', '0');
    formData.append('comments', '0');
    formData.append('Saved', 'false');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this._blogservice.createBlogPost(formData).subscribe(
      (response: any) => {
        console.log('Blog post created:', response);

        this.blogPosts.unshift({
          ...response,
          isLiked: false
        });

        this.blogForm.reset();
        this.showPopup = false;
        this.imagePreview = null;
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  }



  onImageSelect(event: any) {


    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  searchblog(searchTerm: string) {

    if (searchTerm.trim() === '') {

    } else {
      this.searchblogPosts = this.blogPosts.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.author.toLowerCase().includes(searchTerm)
      );

      this._shared.setBlogPosts(this.searchblogPosts);
      localStorage.setItem('searchValue', 'true');
      this._router.navigate(['/searchblog']);

    }

  }


  likeBlog(blog: any) {
    if (!this.isLoggedIn) {
      this._router.navigate(["/login"]);
      return;
    }

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
    if (!this.isLoggedIn) {
      this._router.navigate(["/login"]);
      return;
    }


    this._blogservice.toggleSave(blog.id, this.currentUserId).subscribe({
      next: (res) => {
        this.loadBlogs();


        alert(res.message);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }




  commentblog(blogId: any) {

    if (this.isLoggedIn) {

      this._router.navigate(
        ['/commentblog'],
        { state: { blogId: blogId } }
      )



    }
    else {
      this._router.navigate(['/login']);
    }

  }



  


  gotosearchblog() {
    if (this.isLoggedIn) {
      this._router.navigate(['/searchblog']);
    }
    else {
      this._router.navigate(['/login']);
    }
  }
  gotoallposts() {
    if (this.isLoggedIn) {
      this._router.navigate(['/Allposts'])
    }
    else {
      this._router.navigate(['/login']);
    }
  }
  gotoliked() {
    if (this.isLoggedIn) {
      this._router.navigate(['/settings/likedblog']);
    }
    else {
      this._router.navigate(['/login']);
    }
  }
  gotosaved() {
    if (this.isLoggedIn) {
      this._router.navigate(['/settings/savedBlog']);
    }
    else {
      this._router.navigate(['/login']);
    }
  }

}
