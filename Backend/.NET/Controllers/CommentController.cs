using Blog_API.Data;
using Blog_API.DTO;
using Blog_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentController(AppDbContext context)
    {
        _context = context;
    }

    // =========================
    // ADD COMMENT / REPLY
    // =========================
    [HttpPost("add")]
    public async Task<IActionResult> AddComment([FromBody] AddCommentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new { message = "Comment cannot be empty" });

        var blogExists = await _context.Blogs.AnyAsync(b => b.Id == dto.BlogId);
        if (!blogExists)
            return BadRequest(new { message = "Blog not found" });

        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
        if (!userExists)
            return BadRequest(new { message = "User not found" });

        var comment = new Comment
        {
            BlogId = dto.BlogId,
            UserId = dto.UserId,
            Content = dto.Content.Trim(),
            ParentCommentId = dto.ParentCommentId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Comment added successfully", comment.Id });
    }

    // =========================
    // GET COMMENTS WITH REPLIES
    // =========================
    [HttpGet("blog/{blogId}")]
    public async Task<IActionResult> GetCommentsByBlog(int blogId, int currentUserId)
    {
        var allComments = await _context.Comments
            .Where(c => c.BlogId == blogId)
            .Include(c => c.User)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var mainComments = allComments
            .Where(c => c.ParentCommentId == null)
            .Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.UserId,
                UserName = c.User != null ? c.User.Name : "",

                ReactionCount = _context.CommentReactions.Count(r => r.CommentId == c.Id),
                IsReacted = _context.CommentReactions.Any(r => r.CommentId == c.Id && r.UserId == currentUserId),

                Replies = allComments
                    .Where(r => r.ParentCommentId == c.Id)
                    .OrderBy(r => r.CreatedAt)
                    .Select(r => new
                    {
                        r.Id,
                        r.Content,
                        r.CreatedAt,
                        r.UserId,
                        UserName = r.User != null ? r.User.Name : "",

                        ReactionCount = _context.CommentReactions.Count(cr => cr.CommentId == r.Id),
                        IsReacted = _context.CommentReactions.Any(cr => cr.CommentId == r.Id && cr.UserId == currentUserId),

                        ParentCommentId = r.ParentCommentId
                    })
                    .ToList()
            })
            .ToList();

        return Ok(mainComments);
    }

    // =========================
    // DELETE COMMENT / REPLY SAFELY
    // =========================
    [HttpDelete("delete/{commentId}")]
    public async Task<IActionResult> DeleteComment(int commentId)
    {
        var comment = await _context.Comments
            .Include(c => c.Replies)
            .FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null)
            return NotFound(new { message = "Comment not found" });

        // 1. Delete reactions of replies
        var replyIds = comment.Replies.Select(r => r.Id).ToList();

        if (replyIds.Any())
        {
            var replyReactions = await _context.CommentReactions
                .Where(r => replyIds.Contains(r.CommentId))
                .ToListAsync();

            _context.CommentReactions.RemoveRange(replyReactions);

            // 2. Delete replies
            _context.Comments.RemoveRange(comment.Replies);
        }

        // 3. Delete reactions of main comment/reply itself
        var commentReactions = await _context.CommentReactions
            .Where(r => r.CommentId == commentId)
            .ToListAsync();

        _context.CommentReactions.RemoveRange(commentReactions);

        // 4. Delete main comment/reply
        _context.Comments.Remove(comment);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Comment deleted successfully" });
    }
}