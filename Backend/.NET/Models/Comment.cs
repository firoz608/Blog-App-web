using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blog_API.Models
{
    [Table("Comments")]
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        public int BlogId { get; set; }
        public Blog? Blog { get; set; }

        public int UserId { get; set; }
        public user? User { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // null = main comment, not null = reply
        public int? ParentCommentId { get; set; }
        public Comment? ParentComment { get; set; }

        public ICollection<Comment> Replies { get; set; } = new List<Comment>();

        public ICollection<CommentReaction> CommentReactions { get; set; } = new List<CommentReaction>();
    }
}