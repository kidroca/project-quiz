namespace Server.WebApi.Models.Quiz.Question
{
    public class AnsweredQuestionRequestModel
    {
        public string Title { get; set; }

        public int Selected { get; set; }
    }
}