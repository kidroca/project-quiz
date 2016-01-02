namespace Server.WebApi.Models.Quiz
{
    using System.Collections.Generic;
    using Controllers;

    public class QuizSolutionResponseModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public IList<WrongAnswerResponseModel> WrongAnswers { get; set; }
    }
}