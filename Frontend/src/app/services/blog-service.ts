import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) { }
  private apiUrl = "https://localhost:7059";
  private saveApi = 'https://localhost:7059/api/BlogSave';


  //create blog post
  createBlogPost(blogData: any) {
    return this.http.post(`${this.apiUrl}/api/Blogs`, blogData);
  }
  //get all blog posts
  getAllBlogPosts() {
    return this.http.get(`${this.apiUrl}/api/Blogs`);
  }
  //get blog post by userid
  getBlogPostById(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/api/Blogs/user/${id}`);
  }


  //get blog post by Blogid
  getBlogPostByBlogId(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/api/Blogs/blogId/${id}`);
  }


  //latest blog
  getLatestBlog() {
    return this.http.get<any>(this.apiUrl + '/api/Blogs/latest');
  }

  //update blog post
  updateBlogPost(id: number, blogData: any) {
    // console.log(id,blogData);

    return this.http.put(`${this.apiUrl}/api/Blogs/update/${id}`, blogData);
  }
  //delete blog post
  deleteBlogPost(id: number) {
    return this.http.delete(`${this.apiUrl}/api/Blogs/delete/${id}`);
  }
  //saved blog post
  toggleSave(blogId: number, userId: number): Observable<any> {
    return this.http.post(`${this.saveApi}/toggle-save?blogId=${blogId}&userId=${userId}`, {});
  }

  getSavedBlogs(userId: number): Observable<any> {
    return this.http.get(`${this.saveApi}/saved-blogs/${userId}`);
  }

  isSaved(blogId: number, userId: number): Observable<any> {
    return this.http.get(`${this.saveApi}/is-saved?blogId=${blogId}&userId=${userId}`);
  }

  getSaveCount(blogId: number): Observable<any> {
    return this.http.get(`${this.saveApi}/save-count/${blogId}`);
  }
  //like blog post
  // likeBlogPost(id:number){
  //   return this.http.post(`${this.apiUrl}/api/Blogs/like/${id}`,{});
  // }
  //dislike blog post
  // dislikeBlogPost(id:number){
  //   return this.http.post(`${this.apiUrl}/api/Blogs/dislike/${id}`,{});
  // }


  // comment on blog post
  // commentOnBlogPost(blog:any){
  //   return this.http.post(`${this.apiUrl}/api/Comments`,blog);
  // }

  // loadComment(id:number){
  //   return this.http.get(this.apiUrl+'/api/Comments/'+id);
  // }


  // comment
addComment(blogId: number, userId: number, content: string, parentCommentId?: number) {
  let params = new HttpParams()
    .set('blogId', blogId.toString())
    .set('userId', userId.toString())
    .set('content', content);

  if (parentCommentId !== undefined && parentCommentId !== null) {
    params = params.set('parentCommentId', parentCommentId.toString());
  }

  return this.http.post(`${this.apiUrl}/api/Comment/add`, {}, { params });
}

getCommentsByBlog(blogId: number, currentUserId: number) {
  const params = new HttpParams().set('currentUserId', currentUserId);
  return this.http.get(`${this.apiUrl}/api/Comment/blog/${blogId}`, { params });
}


deleteComment(commentId: number) {
  return this.http.delete(`${this.apiUrl}/api/Comment/delete/${commentId}`);
}

toggleReaction(commentId: number, userId: number, reactionType: string = 'Like') {
  const params = new HttpParams()
    .set('commentId', commentId.toString())
    .set('userId', userId.toString())
    .set('reactionType', reactionType);

  return this.http.post(`${this.apiUrl}/api/CommentReaction/toggle-reaction`, {}, { params });
}

getReactionCount(commentId: number) {
  return this.http.get(`${this.apiUrl}/api/CommentReaction/count/${commentId}`);
}

isReacted(commentId: number, userId: number) {
  const params = new HttpParams()
    .set('commentId', commentId.toString())
    .set('userId', userId.toString());

  return this.http.get(`${this.apiUrl}/api/CommentReaction/is-reacted`, { params });
}

  // like
  toggleLike(blogId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Like/toggle-like`, {
      id: blogId,
      userId: userId
    });
  }

  isLiked(blogId: number, userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Like/is-liked/${blogId}/${userId}`);
  }

  getAllBlogs(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Like/all/${userId}`);
  }

  getSingleBlog(blogId: number, userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Like/${blogId}/${userId}`);
  }

}
