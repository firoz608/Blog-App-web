using System.ComponentModel.DataAnnotations;

namespace Blog_API.Models
{
     public class Blog
    {
        public int Id { get; set; }

 
        public string Title { get; set; }

      
        public string Content { get; set; }

        public string? Image { get; set; }

        public string? Author { get; set; }
        
        public DateOnly CreatedDate { get; set; } = new DateOnly();

        public int Likes { get; set; } = 0;

        public int Comments { get; set; } = 0;

        public bool Saved { get; set; } = false;
        public int UserId { get; set; }
        public ICollection<BlogLike> BlogLikes { get; set; }
        public ICollection<SavedBlog>? BlogSaves { get; set; }
        public ICollection<Comment>? CommentsList { get; set; }





    }
}
