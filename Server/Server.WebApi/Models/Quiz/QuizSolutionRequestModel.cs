namespace Server.WebApi.Models.Quiz
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using Question;

    public class QuizSolutionRequestModel
    {
        [Range(0, int.MaxValue)]
        public int Id { get; set; }

        public IList<AnsweredQuestionRequestModel> Questions { get; set; }
    }
}