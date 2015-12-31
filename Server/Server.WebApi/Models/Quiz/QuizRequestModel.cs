namespace Server.WebApi.Models.Quiz
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using Infrastructure.Mapping;
    using Question;
    using Server.Models;

    public class QuizRequestModel : IMapFrom<Quiz>, IHaveCustomMappings
    {
        public int Id { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(128)]
        public string Title { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(128)]
        public string Category { get; set; }

        [MinLength(5)]
        [MaxLength(500)]
        public string Description { get; set; }

        public string CreatedById { get; set; }

        public DateTime? CreatedOn { get; set; }

        [Range(0, int.MaxValue)]
        public int TimesSolved { get; set; }

        public virtual IEnumerable<QuestionRequestModel> Questions { get; set; }

        public void CreateMappings(IConfiguration config)
        {
            config.CreateMap<QuizRequestModel, Quiz>();
        }
    }
}