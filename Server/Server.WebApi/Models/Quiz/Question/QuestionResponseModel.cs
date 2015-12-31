namespace Server.WebApi.Models.Quiz.Question
{
    using System.Collections.Generic;
    using Answer;
    using Infrastructure.Mapping;
    using Server.Models;

    public class QuestionResponseModel : IMapFrom<Question>
    {
        public string Title { get; set; }

        public virtual IEnumerable<AnswerResponseModel> Answers { get; set; }
    }
}