namespace Server.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class User : IdentityUser
    {
        private ICollection<Quiz> quizzes;
        private ICollection<Rating> ratingsGiven;

        public User()
        {
            this.ratingsGiven = new HashSet<Rating>();
            this.quizzes = new HashSet<Quiz>();
        }

        [MinLength(2)]
        [MaxLength(25)]
        public string FirstName { get; set; }

        [MinLength(2)]
        [MaxLength(25)]
        public string LastName { get; set; }

        public virtual ICollection<Quiz> Quizzes
        {
            get { return this.quizzes; }

            set { this.quizzes = value; }
        }

        [Url]
        [MaxLength(500)]
        public string AvatarUrl { get; set; }

        public virtual ICollection<Rating> RatingsGiven
        {
            get { return this.ratingsGiven; }
            set { this.ratingsGiven = value; }
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }
}
