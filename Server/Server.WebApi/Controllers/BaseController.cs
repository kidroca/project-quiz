namespace Server.WebApi.Controllers
{
    using System.Web.Http;
    using Microsoft.AspNet.Identity;

    public abstract class BaseController : ApiController
    {
        protected string UserId
        {
            get { return base.User.Identity.GetUserId(); }
        }

        protected bool ValidatePageAndSize(int page, int size)
        {
            return page >= 0 && size > 0;
        }
    }
}