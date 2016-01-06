namespace Server.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Answer
    {
        [Key]
        [Column(Order = 0)]
        public int QuestionId { get; set; }

        public virtual Question Question { get; set; }

        [Key]
        [Column(Order = 1)]
        [MinLength(2)]
        [MaxLength(256)]
        public string Text { get; set; }

        public bool IsCorrect { get; set; }
    }
}