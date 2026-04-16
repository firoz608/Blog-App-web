using Microsoft.AspNetCore.Mvc;

namespace Blog_API.Controllers
{
    using Blog_API.Data;
    using Blog_API.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogsController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL BLOGS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
        {
            return await _context.Blogs.OrderByDescending(x => x.Id).ToListAsync();
        }

        //Getbyid
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogsByUserId(int userId)
        {
            var blogs = await _context.Blogs
                                      .Where(b => b.UserId == userId)
                                      .ToListAsync();

            if (blogs == null || !blogs.Any())
            {
                return NotFound(new { message = "No blogs found for this user" });
            }

            return Ok(blogs);   // ✅ RETURNING LIST
        }



        //GetbyBlogid
        [HttpGet("blogId/{blogId}")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogsByBlogId(int BlogId)
        {
            var blogs = await _context.Blogs
                                      .Where(b => b.Id == BlogId)
                                      .ToListAsync();

            if (blogs == null || !blogs.Any())
            {
                return NotFound(new { message = "No blogs found for this BlogId" });
            }

            return Ok(blogs);   // ✅ RETURNING LIST
        }




        // POST BLOG
        [HttpPost]
        public async Task<ActionResult<Blog>> CreateBlog([FromForm] Blog blog, IFormFile? file)
        {
            var userExists = await _context.Users
                .AnyAsync(u => u.Id == blog.UserId);

            if (!userExists)
                return BadRequest("Invalid UserId");

            // 🔥 Save Image to Folder
            if (file != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine("wwwroot/uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                blog.Image = "/uploads/" + fileName; // store path only
            }

            blog.CreatedDate = DateOnly.FromDateTime(DateTime.Now);

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return Ok(blog);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestBlog()
        {
            var blog = await _context.Blogs
     .OrderByDescending(b => b.CreatedDate)
     .ThenByDescending(b => b.Id)
     .FirstOrDefaultAsync();

            return Ok(blog);
        }

        //Update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] Blog updatedBlog, IFormFile file)
        {
            if (id != updatedBlog.Id)
            {
                return BadRequest(new { message = "Blog ID mismatch" });
            }

            var blog = await _context.Blogs.FindAsync(id);

            if (blog == null)
            {
                return NotFound(new { message = "Blog not found" });
            }

            // Update text fields
            blog.Title = updatedBlog.Title;
            blog.Content = updatedBlog.Content;
            blog.Author = updatedBlog.Author;
            blog.CreatedDate = updatedBlog.CreatedDate;

            // ✅ Handle file upload properly
            if (file != null && file.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                blog.Image = "/uploads/" + fileName;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog updated successfully" });
        }


        //Delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);

            if (blog == null)
            {
                return NotFound(new { message = "Blog not found" });
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog deleted successfully" });
        }


    }
}
