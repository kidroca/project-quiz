namespace Server.WebApi.Models.Quiz.Search
{
    using System;

    public class QuizSearchModel
    {
        public string Category { get; set; }

        public string KeyPhrase { get; set; }

        public double? MinRating { get; set; }

        public double? MaxRating { get; set; }

        public int? MinQuestions { get; set; }

        public int? MaxQuestions { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public ResultOrder? OrderBy { get; set; }

        public bool OrderDescending { get; set; }
    }
}