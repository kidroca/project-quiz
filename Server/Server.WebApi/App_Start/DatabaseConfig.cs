namespace Server.WebApi
{
    using System.Data.Entity;
    using Data;
    using Data.Migrations;

    public static class DatabaseConfig
    {
        public static void Initialize()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<QuizzesDbContext, Configuration>());
            QuizzesDbContext.Create().Database.Initialize(force: true);
        }
    }
}
