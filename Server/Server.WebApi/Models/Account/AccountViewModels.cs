namespace Server.WebApi.Models.Account
{
    using System;
    using System.Collections.Generic;

    // Models returned by AccountController actions.

    public class ExternalLoginViewModel
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public string State { get; set; }
    }

    public class ManageInfoViewModel
    {
        public string LocalLoginProvider { get; set; }

        public string Email { get; set; }

        public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

        public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
    }

    public class UserInfoViewModel
    {
        public string Username { get; set; }

        public string UserId { get; set; }

        public DateTime RegisteredOn { get; set; }

        public string LoginProvider { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int QuizzesCreated { get; set; }

        public int QuizzesTaken { get; set; }

        public string AvatarUrl { get; set; }
    }

    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }
}
