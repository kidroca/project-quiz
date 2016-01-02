namespace Server.WebApi.Models.Quiz.Question.Answer
{
    public class WrongAnswerResponseModel
    {
        public string Question { get; set; }

        public string SelectedAnswer { get; set; }

        public string CorrectAnswer { get; set; }
    }
}