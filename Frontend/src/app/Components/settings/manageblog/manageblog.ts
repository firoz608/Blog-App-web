import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { CommonModule, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-manageblog',
  imports: [NgForOf,
    CommonModule,
    ReactiveFormsModule, RouterLink],
  templateUrl: './manageblog.html',
  styleUrl: './manageblog.css',
})
export class Manageblog {
  apiUrl='https://localhost:7059';
  blogPosts: any[] = [];
  blogForm!: FormGroup;
  isProfileMenuOpen: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile!: File;
  blogid: any;
  showPopup = false;

  constructor(private _route: Router, private _blogservice: BlogService, private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: [''],
      content: [''],
      image: [''],
    });
  }

  ngOnInit() {
    this.onload();
    if(!this.imagePreview){
      this.imagePreview='/assets/default-upld-image2.png';
    }
  }
  onload() {
    const storedUser = JSON.parse(localStorage.getItem("user")!);
    const id = storedUser.id;
    
    this._blogservice.getBlogPostById(id).subscribe(
      (posts) => {
        this.blogPosts = posts;
        // console.log(this.blogPosts);
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
      }
    );
  }
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  openPopup(blogId: any) {
    this.showPopup = true;
    this.blogid = blogId;
    
    this._blogservice.getSingleBlog(blogId, this.getuserid()).subscribe(
      (blog) => {
        console.log(blog);
        
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content,
        });
      }
    );
  }


  closePopup() {
    this.showPopup = false;
    this.blogForm.reset();
       if(this.imagePreview){
      this.imagePreview='/assets/default-upld-image2.png';
    }
  }

  getAuthorName(): string {
    const storedUser = JSON.parse(localStorage.getItem("user")!);
    return storedUser ? storedUser.name : "Unknown Author";

  }
  getuserid(): number {
    const storedUser = JSON.parse(localStorage.getItem("user")!);
    return storedUser ? storedUser.id : 0;
  }

  submitBlog() {
    // console.log(this.blogForm.value);

  const formData = new FormData();

  formData.append('userId', this.getuserid()as any);
  formData.append('title', this.blogForm.value.title);
  formData.append('content', this.blogForm.value.content);
  formData.append('author', this.getAuthorName());
  formData.append('likes', '0');
  formData.append('comments', '0');
  formData.append('saved', 'false');

  if (this.selectedFile) {
    formData.append('file', this.selectedFile); // 👈 send real file
  }
   
    
    this._blogservice.updateBlogPost(this.blogid, formData).subscribe(
      (response) => {
        console.log('Blog post updated successfully:', response);
        this.blogForm.reset();
        this.onload(); // Refresh the blog posts list after update
        this.imagePreview = null;
        this.showPopup = false;
        // Optionally, refresh the blog posts list or update the specific post in the UI
      },
      (error) => {
        console.error('Error updating blog post:', error);
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


  deleteblog(blogId: any) {
    // console.log(blogId);
    const confirmdelete=confirm("Are you sure to delete this blog");
    if(confirmdelete){
          this._blogservice.deleteBlogPost(blogId).subscribe(
      () => {
        this.blogPosts = this.blogPosts.filter(post => post.id !== blogId);
        console.log('Blog deleted successfully');
      },
      (error) => {
        console.error('Error deleting blog:', error);
      }
    );
    }

  }

















}
