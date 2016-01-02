namespace Server.WebApi.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using Data.Contracts;
    using Models.Quiz;
    using Models.Quiz.Question.Answer;
    using Server.Models;
    using WebGrease.Css.Extensions;

    // Todo: Post, Put, Delete

    [RoutePrefix("api/quizzes")]
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

            var quizzes = ApplyQueryParameters(this.quizRepo.All(), query);

            var response = await quizzes
                .Skip(page * size)
                .Take(size)
                .ProjectTo<QuizResponseModel>().ToListAsync();

            return this.Ok(response);
        }

        [Authorize]
        public async Task<IHttpActionResult> Post(QuizRequestModel quiz)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            var dbQuiz = await this.quizRepo.All().FirstOrDefaultAsync(
                q => q.Title.Equals(quiz.Title, StringComparison.OrdinalIgnoreCase));

            bool update = dbQuiz != null;

            quiz.CreatedById = base.UserId;
            quiz.CreatedOn = DateTime.Now;

            var asDbModel = Mapper.Map<Quiz>(quiz);

            if (update)
            {
                if (base.UserId != dbQuiz.CreatedById)
                {
                    return this.BadRequest("You are not allowed to change this quiz becase you are not the owner.");
                }

                dbQuiz.Description = asDbModel.Description;
                dbQuiz.Category = asDbModel.Category;
                dbQuiz.Title = asDbModel.Title;
                dbQuiz.Questions.Clear();
                foreach (var question in asDbModel.Questions)
                {
                    dbQuiz.Questions.Add(question);
                }

                this.quizRepo.Update(dbQuiz);
                await this.quizRepo.SaveChangesAsync();

                return this.Ok(dbQuiz.Id);
            }
            else
            {
                this.quizRepo.Add(asDbModel);
                await this.quizRepo.SaveChangesAsync();

                int id = asDbModel.Id;

                return this.Created($"api/quizzes/{id}", id);
            }
        }

        [Authorize]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            var quiz = this.quizRepo.GetById(id);
            if (quiz.CreatedById != base.UserId)
            {
                return this.BadRequest("You don't have rights to delete this quiz");
            }

            this.quizRepo.Delete(quiz);
            await this.quizRepo.SaveChangesAsync();

            return this.Ok("deleted successfully");
        }

        [Route("categories")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCategories(string pattern, int take = 10)
        {
            string[] categories = await this.quizRepo.All()
                .Where(quiz => quiz.Category.ToLower().Contains(pattern.ToLower()))
                .GroupBy(quiz => quiz.Category)
                .Take(take)
                .Select(gr => gr.Key.ToLower())
                .ToArrayAsync();

            return this.Ok(categories);
        }

        [Route("solve")]
        public async Task<IHttpActionResult> Solve(QuizSolutionRequestModel quiz)
        {
            var dbQuiz = this.quizRepo.GetById(quiz.Id);
            if (quiz.Questions.Count != dbQuiz.Questions.Count)
            {
                return this.BadRequest("Invalid Solution: Questions count mismatch");
            }

            QuizSolutionResponseModel response = await this.EvaluateSolution(quiz, dbQuiz);

            dbQuiz.TimesSolved++;
            this.quizRepo.Update(dbQuiz);
            await this.quizRepo.SaveChangesAsync();

            return this.Ok(response);
        }

        [Route("{id:int}")]
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

        [Route("{name}")]
        [HttpGet]
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

            quizzes = quizzes.OrderByDescending(q => q.CreatedOn);

            return quizzes;
        }

        private async Task<QuizSolutionResponseModel> EvaluateSolution(QuizSolutionRequestModel quizSolution, Quiz quiz)
        {


            var result = await Task.Run(() =>
            {
                var response = new QuizSolutionResponseModel
                {
                    Id = quiz.Id,
                    Title = quiz.Title,
                    WrongAnswers = new List<WrongAnswerResponseModel>(),
                    TotalQuestions = quiz.Questions.Count
                };

                quiz.Questions
                .ForEach((question, i) =>
                {
                    int selected = quizSolution.Questions[i].Selected;
                    var answers = question.Answers.ToArray();

                    if (!answers[selected].IsCorrect)
                    {
                        response.WrongAnswers.Add(new WrongAnswerResponseModel
                        {
                            Question = question.Title,
                            SelectedAnswer = answers[selected].Text,
                            CorrectAnswer = answers.First(a => a.IsCorrect).Text
                        });
                    }
                });

                return response;
            });

            return result;
        }
    }
}
