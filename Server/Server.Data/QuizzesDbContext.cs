namespace Server.Data
{
    using System.Data.Entity;
    using Contracts;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;

    public class QuizzesDbContext : IdentityDbContext<User>, IQuizzesDbContext
    {
        public QuizzesDbContext() : base("QuizzesData", throwIfV1Schema: false)
        {
        }

        public IDbSet<Quiz> Quizzes { get; set; }

        public static QuizzesDbContext Create()
        {
            return new QuizzesDbContext();
        }

    }
}