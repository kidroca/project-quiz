namespace Server.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Rating
    {
        //public int Id { get; set; }

        [Key]
        [Column(Order = 0)]
        public int QuizId { get; set; }

        [Key]
        [Column(Order = 1)]
        [Required]
        public string ByUserId { get; set; }

        public virtual Quiz Quiz { get; set; }

        public User ByUser { get; set; }

        [Range(1, 10)]
        public double Value { get; set; }
    }
}