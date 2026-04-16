using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blog_API.Models
{
    [Table("CommentReactions")]
    public class CommentReaction
    {
        [Key]
        public int Id { get; set; }

        public int CommentId { get; set; }
        public Comment? Comment { get; set; }

        public int UserId { get; set; }
        public user? User { get; set; }

        public string ReactionType { get; set; } = "Like";

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}