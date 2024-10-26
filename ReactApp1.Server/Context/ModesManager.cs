using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Domain.Enities;


namespace ReactApp1.Server.Context
{
    public partial class ModelsManager : IdentityDbContext<User>
    {
        protected readonly IConfiguration Configuration;
        public ModelsManager(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        }
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<Recipe> Recipe { get; set; }
        public virtual DbSet<Ingredient> Ingredient { get; set; }
        public virtual DbSet<Measurement> Measurement { get; set; }
        public virtual DbSet<RecipeStep> RecipeStep { get; set; }
        public virtual DbSet<Favourite> Favourite { get; set; }

        protected override void OnModelCreating(ModelBuilder
        modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<Measurement>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<RecipeStep>(entity =>
            {
                entity.HasOne(d => d.Recipe)
                .WithMany(p => p.RecipeStep)
                .HasForeignKey(d => d.RecipeId);
            });

            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.HasOne(d => d.Category)
                .WithMany(p => p.Recipe)
                .HasForeignKey(d => d.CategoryId);

                entity.HasOne(d => d.User)
                .WithMany(p => p.Recipe)
                .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<Ingredient>(entity =>
            {
                entity.HasOne(d => d.Measurement)
                .WithMany(p => p.Ingredient)
                .HasForeignKey(d => d.MeasurementId);

                entity.HasOne(d => d.Recipe)
                .WithMany(p => p.Ingredient)
                .HasForeignKey(d => d.RecipeId);
            });

            modelBuilder.Entity<Favourite>(entity =>
            {
                entity.HasOne(d => d.Recipe)
                .WithMany(p => p.Favourite)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.User)
                .WithMany(p => p.Favourite)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
