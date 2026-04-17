using Blog_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Blog_API.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<user> Users { get; set; }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<SavedBlog> SavedBlogs { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentReaction> CommentReactions { get; set; }
        public DbSet<BlogLike> BlogLikes { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // BLOG LIKES
            // =========================
            modelBuilder.Entity<BlogLike>()
                .HasIndex(x => new { x.BlogId, x.UserId })
                .IsUnique();

            modelBuilder.Entity<BlogLike>()
                .HasOne(x => x.Blog)
                .WithMany(x => x.BlogLikes)
                .HasForeignKey(x => x.BlogId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================
            // COMMENTS
            // =========================
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Blog)
                .WithMany(b => b.CommentsList)
                .HasForeignKey(c => c.BlogId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // COMMENT REACTIONS
            // =========================
            modelBuilder.Entity<CommentReaction>()
                .HasIndex(x => new { x.CommentId, x.UserId })
                .IsUnique();

            modelBuilder.Entity<CommentReaction>()
                .HasOne(cr => cr.Comment)
                .WithMany(c => c.CommentReactions)
                .HasForeignKey(cr => cr.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}