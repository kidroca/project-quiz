namespace Server.WebApi.Models.Quiz.Question.Answer
{
    using Infrastructure.Mapping;
    using Server.Models;

    public class AnswerResponseModel : IMapFrom<Answer>
    {
        public string Text { get; set; }

        public bool IsCorrect { get; set; }
    }
}