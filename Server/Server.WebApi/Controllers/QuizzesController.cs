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
    using Models.Quiz.Search;
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

            var quizzes = this.quizRepo.All()
                .Where(quiz => !quiz.IsPrivate);

            quizzes = ApplyQueryParameters(quizzes, query);

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
                dbQuiz.IsPrivate = asDbModel.IsPrivate;
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

        [Authorize]
        [Route("rate/{id:int}")]
        public async Task<IHttpActionResult> RateQuiz(int id, double value)
        {
            value = Math.Round(value * 10) / 10;

            if (value <= 0 || 10 < value)
            {
                return this.BadRequest("Rating must be between 0.1 and 10");
            }

            var quiz = this.quizRepo.GetById(id);
            if (quiz == null)
            {
                return this.NotFound();
            }

            var rating = await
                Task.Run(() => quiz.Ratings.FirstOrDefault(r => r.ByUserId == this.UserId));

            if (rating != null)
            {
                rating.Value = value;
            }
            else
            {
                quiz.Ratings.Add(new Rating
                {
                    ByUserId = this.UserId,
                    Value = value,
                });
            }

            this.quizRepo.Update(quiz);
            await this.quizRepo.SaveChangesAsync();

            var response = Mapper.Map<QuizResponseModel>(quiz);
            return this.Ok(response);
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
            else if (quiz.IsPrivate && base.UserId != quiz.CreatedById)
            {
                return this.BadRequest("This quiz is private, and you don't have the rights tp access it.");
            }
            else
            {
                var response = Mapper.Map<QuizResponseModel>(quiz);
                return this.Ok(response);
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

            // Only return private quizzes if they are created by the user making the request
            userQuizzes = userQuizzes.Where(quiz => !quiz.IsPrivate || quiz.CreatedById == this.UserId);

            userQuizzes = ApplyQueryParameters(userQuizzes, query);

            var response = await userQuizzes
                .Skip(page * size)
                .Take(size)
                .ProjectTo<QuizResponseModel>()
                .ToListAsync();

            return this.Ok(response);
        }

        // Todo: Extract in a service
        private static IQueryable<Quiz> ApplyQueryParameters(IQueryable<Quiz> quizzes, QuizSearchModel httpQuery)
        {
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
                quizzes = quizzes.Where(q => q.CreatedOn >= httpQuery.FromDate);
            }

            if (httpQuery.ToDate != null)
            {
                quizzes = quizzes.Where(q => q.CreatedOn <= httpQuery.ToDate);
            }

            if (httpQuery.MinQuestions != null)
            {
                quizzes = quizzes.Where(q => q.Questions.Count >= httpQuery.MinQuestions);
            }

            if (httpQuery.MaxQuestions != null)
            {
                quizzes = quizzes.Where(q => q.Questions.Count <= httpQuery.MaxQuestions);
            }

            if (httpQuery.MinRating != null)
            {
                quizzes = quizzes.Where(q => q.Ratings.Average(r => r.Value) >= httpQuery.MinRating);
            }

            if (httpQuery.MaxRating != null)
            {
                quizzes = quizzes.Where(q => q.Ratings.Average(r => r.Value) <= httpQuery.MaxRating);
            }

            quizzes = ApplyOrdering(quizzes, httpQuery);

            return quizzes;
        }

        // Todo: Extract in a service
        private static IQueryable<Quiz> ApplyOrdering(IQueryable<Quiz> quizzes, QuizSearchModel httpQuery)
        {
            if (httpQuery.OrderBy == null)
            {
                return quizzes.OrderByDescending(q => q.CreatedOn);
            }
            switch (httpQuery.OrderBy)
            {
                case ResultOrder.ByDate:
                    quizzes = quizzes.OrderBy(q => q.CreatedOn);
                    break;
                case ResultOrder.ByRating:
                    quizzes = quizzes.OrderBy(q => q.Ratings.Average(r => r.Value));
                    break;
                case ResultOrder.ByNumberOfQuestions:
                    quizzes = quizzes.OrderBy(q => q.Questions.Count);
                    break;
                case ResultOrder.ByTimesTaken:
                    quizzes = quizzes.OrderBy(q => q.TimesSolved);
                    break;
            }

            if (httpQuery.OrderDescending)
            {
                quizzes = quizzes.Reverse();
            }

            return quizzes;
        }

        // Todo: Extract in a service
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