namespace Blog_API.DTO
{
    public class AddCommentDto
    {
        public int BlogId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? ParentCommentId { get; set; }
    }
}
