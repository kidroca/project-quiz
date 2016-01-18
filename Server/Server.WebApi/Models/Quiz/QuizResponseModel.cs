namespace Server.WebApi.Models.Quiz
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using AutoMapper;
    using Infrastructure.Mapping;
    using Question;
    using Server.Models;

    public class QuizResponseModel : IMapFrom<Quiz>, IHaveCustomMappings
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Category { get; set; }

        public string Description { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedById { get; set; }

        public DateTime CreatedOn { get; set; }

        public int TimesSolved { get; set; }

        public double Rating { get; set; }

        public string AvatarUrl { get; set; }

        public virtual IEnumerable<QuestionResponseModel> Questions { get; set; }

        public void CreateMappings(IConfiguration config)
        {
            config.CreateMap<Quiz, QuizResponseModel>()
                .ForMember(res => res.CreatedBy, opts => opts.MapFrom(
                    db => db.CreatedBy.FirstName + " " + db.CreatedBy.LastName))
                .ForMember(res => res.Rating, opts => opts.MapFrom(
                    db => db.Ratings.Count > 0 ? db.Ratings.Average(r => r.Value) : 0))
                .ForMember(res => res.AvatarUrl, opts => opts.MapFrom(
                    db => db.CreatedBy.AvatarUrl));
        }
    }
}