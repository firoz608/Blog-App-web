namespace Blog_API.Models
{
    public class BlogLike
    {
        public int Id { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; }

        public int UserId { get; set; }

        //public DateOnly CreatedDate { get; set; } = new DateOnly();
    }
}
