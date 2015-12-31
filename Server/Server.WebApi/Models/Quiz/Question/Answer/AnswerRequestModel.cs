namespace Server.WebApi.Models.Quiz.Question.Answer
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using Infrastructure.Mapping;
    using Server.Models;

    public class AnswerRequestModel : IMapFrom<Answer>, IHaveCustomMappings
    {
        [MinLength(2)]
        [MaxLength(128)]
        public string Text { get; set; }

        public bool IsCorrect { get; set; }

        public void CreateMappings(IConfiguration config)
        {
            config.CreateMap<AnswerRequestModel, Answer>();
        }
    }
}