using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blog_API.Models
{
    [Table("SavedBlogs")]
    public class SavedBlog
    {

        [Key]
        public int Id { get; set; }

        [ForeignKey("Blog")]
        public int BlogId { get; set; }
        public Blog? Blog { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public user? User { get; set; }
    }
}

