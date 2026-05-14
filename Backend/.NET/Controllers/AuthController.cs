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

        [HttpGet("profile-picture/{id}")]
        public async Task<IActionResult> GetProfilePicture(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                imageUrl = user.ProfilePicture
            });
        }


        [HttpPut("update/profile-image/{id}")]
        public async Task<IActionResult> UpdateProfileImage(int id, [FromBody] string imageUrl)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.ProfilePicture = imageUrl;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile updated successfully",
                profilePicture = user.ProfilePicture
            });
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
