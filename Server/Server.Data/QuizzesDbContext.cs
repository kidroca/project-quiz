namespace Server.Data
{
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
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

        /// <summary>
        /// Necessary when replacing/updating questions in existing quiz 
        /// </summary>
        /// <returns></returns>
        public override int SaveChanges()
        {
            this.Questions
                .Local
                .Where(q => q.Quiz == null)
                .ToList()
                .ForEach(q => this.Questions.Remove(q));

            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync()
        {
            await Task.Run(() =>
            {
                this.Questions
                    .Local
                    .Where(q => q.Quiz == null)
                    .ToList()
                    .ForEach(q => this.Questions.Remove(q));
            });

            return await base.SaveChangesAsync();
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