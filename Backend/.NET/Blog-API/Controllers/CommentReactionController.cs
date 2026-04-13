using Blog_API.Data;
using Blog_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class CommentReactionController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentReactionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("toggle-reaction")]
    public async Task<IActionResult> ToggleReaction(int commentId, int userId, string reactionType = "Like")
    {
        var commentExists = await _context.Comments.AnyAsync(c => c.Id == commentId);
        if (!commentExists)
            return BadRequest(new { message = "Comment not found" });

        var existingReaction = await _context.CommentReactions
            .FirstOrDefaultAsync(x => x.CommentId == commentId && x.UserId == userId);

        if (existingReaction != null)
        {
            _context.CommentReactions.Remove(existingReaction);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Reaction removed successfully" });
        }

        var reaction = new CommentReaction
        {
            CommentId = commentId,
            UserId = userId,
            ReactionType = reactionType,
            CreatedAt = DateTime.Now,
        };

        _context.CommentReactions.Add(reaction);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Reaction added successfully" });
    }

    [HttpGet("count/{commentId}")]
    public async Task<IActionResult> GetReactionCount(int commentId)
    {
        var count = await _context.CommentReactions.CountAsync(x => x.CommentId == commentId);
        return Ok(count);
    }

    [HttpGet("is-reacted")]
    public async Task<IActionResult> IsReacted(int commentId, int userId)
    {
        var isReacted = await _context.CommentReactions
            .AnyAsync(x => x.CommentId == commentId && x.UserId == userId);

        return Ok(isReacted);
    }
}