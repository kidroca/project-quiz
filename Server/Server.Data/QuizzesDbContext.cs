namespace Server.Data
{
    using System.Data.Entity;
    using Contracts;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;

    public class QuizzesDbContext : IdentityDbContext<User>, IQuizzesDbContext
    {
        public QuizzesDbContext() : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public virtual IDbSet<Quiz> Quizzes { get; set; }

        public virtual IDbSet<Rating> Ratings { get; set; }

        public virtual IDbSet<Question> Questions { get; set; }

        public virtual IDbSet<Answer> Answers { get; set; }

        public static QuizzesDbContext Create()
        {
            return new QuizzesDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Rating>()
                .HasRequired(rating => rating.Quiz)
                .WithMany(quiz => quiz.Ratings)
                .HasForeignKey(rating => rating.QuizId)
                .WillCascadeOnDelete(false);
        }
    }
}