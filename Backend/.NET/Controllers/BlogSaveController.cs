using Blog_API.Data;
using Blog_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class BlogSaveController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogSaveController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("toggle-save")]
    public async Task<IActionResult> ToggleSave(int blogId, int userId)
    {
        var existingSave = await _context.SavedBlogs
            .FirstOrDefaultAsync(x => x.BlogId == blogId && x.UserId == userId);

        if (existingSave != null)
        {
            _context.SavedBlogs.Remove(existingSave);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Blog unsaved successfully" });
        }

        var save = new SavedBlog
        {
            BlogId = blogId,
            UserId = userId
        };

        _context.SavedBlogs.Add(save);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Blog saved successfully" });
    }

    [HttpGet("saved-blogs/{userId}")]
    public async Task<IActionResult> GetSavedBlogs(int userId)
    {
        var savedBlogs = await _context.SavedBlogs
            .Where(x => x.UserId == userId)
            .Include(x => x.Blog)
            .Select(x => new
            {
                x.Blog.Id,
                x.Blog.Title,
                x.Blog.Content,
                x.Blog.Image,
                x.Blog.Author,
                x.Blog.CreatedDate,
                x.Blog.UserId
            })
            .ToListAsync();

        return Ok(savedBlogs);
    }

    [HttpGet("is-saved")]
    public async Task<IActionResult> IsSaved(int blogId, int userId)
    {
        var isSaved = await _context.SavedBlogs
            .AnyAsync(x => x.BlogId == blogId && x.UserId == userId);

        return Ok(isSaved);
    }

    [HttpGet("save-count/{blogId}")]
    public async Task<IActionResult> GetSaveCount(int blogId)
    {
        var count = await _context.SavedBlogs.CountAsync(x => x.BlogId == blogId);
        return Ok(count);
    }
}