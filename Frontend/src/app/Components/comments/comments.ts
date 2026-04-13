import { Component } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  apiUrl = "https://localhost:7059";
  blogPost: any[] = [];
  blogId: number = 0;
  comments: any[] = [];
  newComment: string = '';
  loading: boolean = false;
  currentUserId: number = 0;

  constructor(private commentService: BlogService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.blogId = navigation?.extras?.state?.['blogId'] || 0;
    console.log('Received Blog ID:', this.blogId);
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    this.currentUserId = user.id || 0;

    if (this.blogId) {
      this.loadpost();
      this.loadComments();
    }
  }

  gotoAllpost() {
    this.router.navigate(['/Allposts']);
  }

  loadpost() {
    this.commentService.getBlogPostByBlogId(this.blogId).subscribe({
      next: (res) => {
        this.blogPost = Array.isArray(res) ? res : [res];
        console.log(this.blogPost);
      },
      error: (err) => {
        console.error('Error loading blog post:', err);
      }
    });
  }


  // LOAD COMMENTS
 
  loadComments() {
    if (!this.blogId || !this.currentUserId) return;

    this.loading = true;
    this.commentService.getCommentsByBlog(this.blogId, this.currentUserId).subscribe({
      next: (res: any) => {
        this.comments = (res || []).map((comment: any) => ({
          ...comment,
          showReplyBox: false,
          replyText: '',
          replies: (comment.replies || []).map((reply: any) => ({
            ...reply
          }))
        }));
        this.loading = false;
        console.log("Loaded comments:", this.comments);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.loading = false;
      }
    });
  }

  
  // ADD MAIN COMMENT
  
  addComment() {
    if (!this.newComment.trim()) return;

    this.commentService.addComment(this.blogId, this.currentUserId, this.newComment.trim()).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });

  }

  


 
  // TOGGLE REPLY BOX
  
  toggleReplyBox(comment: any) {
    comment.showReplyBox = !comment.showReplyBox;
  }

 
  // ADD REPLY
  
  addReply(comment: any) {
    if (!comment.replyText || !comment.replyText.trim()) return;

    console.log("Reply ParentCommentId:", comment.id);

    this.commentService.addComment(
      this.blogId,
      this.currentUserId,
      comment.replyText.trim(),
      comment.id
    ).subscribe({
      next: () => {
        comment.replyText = '';
        comment.showReplyBox = false;
        this.loadComments();
      },
      error: (err) => {
        console.error('Error adding reply:', err);
      }
    });
  }

 
  // TOGGLE REACTION
 
  toggleReaction(commentId: number) {
    this.commentService.toggleReaction(commentId, this.currentUserId, 'Like').subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        console.error('Error reacting to comment:', err);
      }
    });
  }

 
  // DELETE COMMENT
 
  deleteComment(commentId: number) {
    const confirmDelete = confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  
  // FORMAT DATE
  
  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleString();
  }

 
  // CHECK OWNER
  
  isMyComment(userId: number): boolean {
    return this.currentUserId === userId;
  }
}