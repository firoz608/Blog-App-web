namespace Blog_API.Models
{
    public class user
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? ProfilePicture { get; set; }
        public ICollection<SavedBlog>? BlogSaves { get; set; }

    }
}

