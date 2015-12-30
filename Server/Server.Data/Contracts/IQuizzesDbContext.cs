namespace Server.Data.Contracts
{
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Threading.Tasks;
    using Models;

    public interface IQuizzesDbContext
    {
        IDbSet<Quiz> Quizzes { get; set; }

        IDbSet<User> Users { get; set; }

        DbSet<TEntity> Set<TEntity>() where TEntity : class;

        DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;

        void Dispose();

        int SaveChanges();

        Task<int> SaveChangesAsync();
    }
}