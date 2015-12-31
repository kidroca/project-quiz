namespace Server.WebApi.Models.Quiz.Question
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using Answer;
    using AutoMapper;
    using Infrastructure.Mapping;
    using Server.Models;

    public class QuestionRequestModel : IMapFrom<Question>, IHaveCustomMappings
    {
        [Required]
        [MinLength(5)]
        [MaxLength(500)]
        public string Title { get; set; }

        public virtual IEnumerable<AnswerRequestModel> Answers { get; set; }

        public void CreateMappings(IConfiguration config)
        {
            config.CreateMap<QuestionRequestModel, Question>();
        }
    }
}