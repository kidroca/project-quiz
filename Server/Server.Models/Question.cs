namespace Server.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Question
    {
        private ICollection<Answer> answers;

        public Question()
        {
            this.answers = new HashSet<Answer>();
        }

        public int Id { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(500)]
        public string Title { get; set; }

        public virtual ICollection<Answer> Answers
        {
            get { return this.answers; }

            set { this.answers = value; }
        }

        public virtual Quiz Quiz { get; set; }

        public int QuizId { get; set; }
    }
}