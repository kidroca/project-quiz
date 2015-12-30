namespace Server.WebApi.Controllers
{
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Data.Contracts;
    using Models.Quiz;
    using Server.Models;

    [Authorize]
    public class QuizzesController : BaseController
    {
        private readonly IRepository<Quiz> quizRepo;

        public QuizzesController(IRepository<Quiz> quizRepo)
        {
            this.quizRepo = quizRepo;
        }

        public async Task<IHttpActionResult> Get([FromUri] QuizSearchModel query, int page = 0, int size = 10)
        {
            if (!this.ValidatePageAndSize(page, size))
            {
                return this.BadRequest("Invalid query string paging parameters, must be positive");
            }

            var quizzes = this.quizRepo.All();

            if (query != null)
            {
                quizzes = ApplyQueryParameters(quizzes, query);
            }

            // Todo: ResponseDataModel
            return this.Ok(await quizzes.Skip(page * size).Take(size).ToListAsync());
        }

        [Route("quizzes/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)
        {
            if (id <= 0)
            {
                return this.BadRequest("Invalid Id value");
            }

            Quiz quiz = await Task.Run(() => this.quizRepo.GetById(id));
            if (quiz == null)
            {
                return this.NotFound();
            }
            else
            {
                // Todo Quiz Response Model
                return this.Ok(quiz);
            }
        }

        [Route("quizzes/{name}")]
        public async Task<IHttpActionResult> GetUserQuizzes(
            string name, [FromUri] QuizSearchModel query, int page = 0, int size = 10)
        {
            if (!this.ValidatePageAndSize(page, size))
            {
                return this.BadRequest("Invalid query string paging parameters, must be positive");
            }

            var userQuizzes = this.quizRepo.All()
                    .Where(q => (q.CreatedBy.FirstName + q.CreatedBy.LastName).ToLower()
                        .Contains(name.ToLower()));

            if (query != null)
            {
                userQuizzes = ApplyQueryParameters(userQuizzes, query);
            }

            // Todo: ResponseDataModel
            return this.Ok(await userQuizzes.Skip(page * size).Take(size).ToListAsync());
        }

        // Todo: Post, Put, Delete

        private static IQueryable<Quiz> ApplyQueryParameters(IQueryable<Quiz> quizzes, QuizSearchModel httpQuery)
        {
            if (httpQuery.Title != null)
            {
                quizzes = quizzes.Where(q => q.Title.Equals(httpQuery.Title, StringComparison.OrdinalIgnoreCase));
            }

            if (httpQuery.Category != null)
            {
                quizzes = quizzes.Where(q => q.Category.Equals(httpQuery.Category, StringComparison.OrdinalIgnoreCase));
            }

            if (httpQuery.KeyPhrase != null)
            {
                string phrase = httpQuery.KeyPhrase.ToLower();

                quizzes = quizzes.Where(q => q.Title.ToLower().Contains(phrase)
                                             || q.Description.ToLower().Contains(phrase)
                                             || q.Category.ToLower().Contains(phrase));
            }

            if (httpQuery.FromDate != null)
            {
                quizzes = quizzes.Where(q => q.CreatedOn.CompareTo(httpQuery.FromDate) >= 0);
            }

            if (httpQuery.ToDate != null)
            {
                quizzes = quizzes.Where(q => q.CreatedOn.CompareTo(httpQuery.ToDate) <= 0);
            }

            if (httpQuery.Questions != null)
            {
                quizzes = quizzes.Where(q => q.Questions.Count >= httpQuery.Questions);
            }

            if (httpQuery.Rating != null)
            {
                quizzes = quizzes.Where(q => q.Ratings.Average(r => r.Value) >= httpQuery.Rating);
            }

            return quizzes;
        }
    }
}
