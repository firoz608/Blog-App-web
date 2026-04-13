using Blog_API.Data;
using Blog_API.DTO;
using Blog_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blog_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LikeController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // TOGGLE LIKE / UNLIKE
        // =========================
        [HttpPost("toggle-like")]
        public async Task<IActionResult> ToggleLike([FromBody] LikeRequestDto dto)
        {
            var blog = await _context.Blogs.FindAsync(dto.Id);

            if (blog == null)
            {
                return NotFound(new { message = "Blog not found" });
            }

            var existingLike = await _context.BlogLikes
                .FirstOrDefaultAsync(x => x.BlogId == dto.Id && x.UserId == dto.UserId);

            if (existingLike == null)
            {
                // LIKE
                var newLike = new BlogLike
                {
                    BlogId = dto.Id,
                    UserId = dto.UserId
                };

                _context.BlogLikes.Add(newLike);
                blog.Likes += 1;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    liked = true,
                    likes = blog.Likes,
                    message = "Post liked"
                });
            }
            else
            {
                // UNLIKE
                _context.BlogLikes.Remove(existingLike);

                if (blog.Likes > 0)
                    blog.Likes -= 1;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    liked = false,
                    likes = blog.Likes,
                    message = "Like removed"
                });
            }
        }

        // =========================
        // CHECK IF CURRENT USER LIKED
        // =========================
        [HttpGet("is-liked/{blogId}/{userId}")]
        public async Task<IActionResult> IsLiked(int blogId, int userId)
        {
            var isLiked = await _context.BlogLikes
                .AnyAsync(x => x.BlogId == blogId && x.UserId == userId);

            return Ok(new { liked = isLiked });
        }

        // =========================
        // GET ALL BLOGS WITH LIKE STATUS
        // =========================
        [HttpGet("all/{userId}")]
        public async Task<IActionResult> GetAllBlogs(int userId)
        {
            var blogs = await _context.Blogs
                .OrderByDescending(x => x.Id)
                .Select(blog => new
                {
                    blog.Id,
                    blog.Title,
                    blog.Content,
                    blog.Image,
                    blog.Author,
                    blog.CreatedDate,
                    blog.Likes,
                    blog.Comments,
                    blog.Saved,
                    blog.UserId,
                    IsLiked = _context.BlogLikes.Any(bl => bl.BlogId == blog.Id && bl.UserId == userId),
                    
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // =========================
        // GET SINGLE BLOG
        // =========================
        [HttpGet("{id}/{userId}")]
        public async Task<IActionResult> GetSingleBlog(int id, int userId)
        {
            var blog = await _context.Blogs
                .Where(x => x.Id == id)
                .Select(blog => new
                {
                    blog.Id,
                    blog.Title,
                    blog.Content,
                    blog.Image,
                    blog.Author,
                    blog.CreatedDate,
                    blog.Likes,
                    blog.Comments,
                    blog.Saved,
                    blog.UserId,
                    IsLiked = _context.BlogLikes.Any(bl => bl.BlogId == blog.Id && bl.UserId == userId)
                })
                .FirstOrDefaultAsync();

            if (blog == null)
                return NotFound();

            return Ok(blog);
        }
    }
}