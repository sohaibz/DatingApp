using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>().HasKey(l => new { l.LikerId, l.LikeeId });
            modelBuilder.Entity<Like>().HasOne(l => l.Likee).WithMany(l => l.Likers).HasForeignKey(u => u.LikeeId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Like>().HasOne(l => l.Liker).WithMany(l => l.Likees).HasForeignKey(u => u.LikerId).OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
    }
}