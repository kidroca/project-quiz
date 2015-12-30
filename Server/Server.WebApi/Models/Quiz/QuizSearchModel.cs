namespace Server.WebApi.Models.Quiz
{
    using System;

    public class QuizSearchModel
    {
        public string Title { get; set; }

        public string Category { get; set; }

        public string KeyPhrase { get; set; }

        public double? Rating { get; set; }

        public int? Questions { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}