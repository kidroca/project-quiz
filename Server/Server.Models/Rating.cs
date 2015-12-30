namespace Server.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Rating
    {
        public int Id { get; set; }

        public virtual Quiz Quiz { get; set; }

        public int QuizId { get; set; }

        public User ByUser { get; set; }

        [Required]
        public string ByUserId { get; set; }

        [Range(0, 10)]
        public double Value { get; set; }
    }
}