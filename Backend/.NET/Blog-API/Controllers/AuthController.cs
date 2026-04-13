using Microsoft.AspNetCore.Mvc;

namespace Blog_API.Controllers
{
    using Blog_API.Data;
    using Blog_API.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register(user user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "User Registered Successfully"
            });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            var user = _context.Users
                .FirstOrDefault(u =>
                    u.Email == login.Email &&
                    u.Password == login.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Email or Password" });
            }

            return Ok(new
            {
                message = "Login Successful",
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    picture=user.ProfilePicture,
                }
            });
        }

        [HttpPost("uploads/profile/{id}")]
        public async Task<IActionResult> UploadProfile(int id, IFormFile file)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            if (file != null && file.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/profile");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                user.ProfilePicture = "/uploads/profile/" + fileName;

                await _context.SaveChangesAsync();
            }

            return Ok(user);
        }

        [HttpGet("profile-picture/{id}")]
        public async Task<IActionResult> GetProfilePicture(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null || string.IsNullOrEmpty(user.ProfilePicture))
            {
                return NotFound("Profile picture not found");
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ProfilePicture.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Image file not found");
            }

            var imageBytes = await System.IO.File.ReadAllBytesAsync(filePath);

            return File(imageBytes, "image/jpeg");
        }

        [HttpPut("update/name/{id}")]
        public async Task<IActionResult> UpdateName(int id, [FromBody] user updatedUser)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.Name = updatedUser.Name;

            await _context.SaveChangesAsync();

            return Ok(user);
        }
    }
}
