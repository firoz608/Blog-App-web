namespace Blog_API.DTO
{
    public class CreateBlogDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? Image { get; set; }
        public string? Author { get; set; }
        public int UserId { get; set; }
    }
}
