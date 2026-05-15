import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { CommonModule, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SupabaseStorageService } from '../../../services/supabase-storage.service';
import { SupabaseService } from '../../../services/supabase.service';


@Component({
  selector: 'app-manageblog',
  imports: [NgForOf,
    CommonModule,
    ReactiveFormsModule, RouterLink],
  templateUrl: './manageblog.html',
  styleUrl: './manageblog.css',
})
export class Manageblog {
 apiUrl = 'https://blog-app-web-1lat.onrender.com';
  blogPosts: any[] = [];
  blogForm!: FormGroup;
  isProfileMenuOpen: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile!: File;
  blogid: any;
  showPopup = false;

  constructor(private _route: Router, private _blogservice: BlogService, private fb: FormBuilder,private storageService: SupabaseStorageService, private supabaseService: SupabaseService) {
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
        // console.log(blog);
        
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content,
          image: blog.image,
          
        });
        this.imagePreview = blog.image || 'assets/default-upld-image2.png';
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

  async submitBlog() {

  try {

    let imageUrl = this.imagePreview;

    // Upload new image only if user selects a new one
    if (this.selectedFile) {

      imageUrl = await this.storageService
        .uploadBlogImage(this.selectedFile);

    }

    const updatedBlogData = {

     

      userId: this.getuserid(),

      title: this.blogForm.value.title,

      content: this.blogForm.value.content,

      author: this.getAuthorName(),

      image: imageUrl

    };

    this._blogservice.updateBlogPost(this.blogid, updatedBlogData)
      .subscribe({

        next: (response: any) => {

          // Update blog in UI instantly
          const index = this.blogPosts.findIndex(
            (x: any) => x.id === this.blogid
          );

          if (index !== -1) {

            this.blogPosts[index] = {
              ...this.blogPosts[index],
              ...response
            };

          }

          this.blogForm.reset();

          this.showPopup = false;

          this.imagePreview = "assets/default-upld-image2.png";

         

          alert("Blog updated successfully");

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  catch (error) {

    console.log(error);

    alert("Image upload failed");

  }

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
        // console.log('Blog deleted successfully');
        alert("Blog deleted successfully");
      },
      (error) => {
        console.error('Error deleting blog:', error);
      }
    );
    }

  }

















}
