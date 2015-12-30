namespace Server.WebApi
{
    using System.Data.Entity;
    using Data;

    public static class DatabaseConfig
    {
        public static void Initialize()
        {
            Database.SetInitializer(new CreateDatabaseIfNotExists<QuizzesDbContext>());
            QuizzesDbContext.Create().Database.Initialize(force: false);
        }
    }
}
