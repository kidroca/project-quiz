namespace Server.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Quiz
    {
        private ICollection<Rating> rattings;
        private ICollection<Question> questions;

        public Quiz()
        {
            this.rattings = new HashSet<Rating>();
            this.questions = new HashSet<Question>();
        }

        public int Id { get; set; }

        [Required]
        [Index(IsUnique = true)]
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

        public virtual User CreatedBy { get; set; }

        [Required]
        public string CreatedById { get; set; }

        public DateTime CreatedOn { get; set; }

        [Range(0, int.MaxValue)]
        public int TimesSolved { get; set; }

        public virtual ICollection<Rating> Ratings
        {
            get { return this.rattings; }

            set { this.rattings = value; }
        }

        public virtual ICollection<Question> Questions
        {
            get { return this.questions; }

            set { this.questions = value; }
        }
    }
}