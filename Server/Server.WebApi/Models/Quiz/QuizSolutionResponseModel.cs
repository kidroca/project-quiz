namespace Server.WebApi.Models.Quiz
{
    using System.Collections.Generic;
    using Question.Answer;

    public class QuizSolutionResponseModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public int TotalQuestions { get; set; }

        public IList<WrongAnswerResponseModel> WrongAnswers { get; set; }
    }
}