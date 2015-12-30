﻿using Microsoft.Owin;
using Server.WebApi;

[assembly: OwinStartup(typeof(Startup))]

namespace Server.WebApi
{
    using System.Reflection;
    using System.Web.Http;
    using Microsoft.Owin.Cors;
    using Ninject.Web.Common.OwinHost;
    using Ninject.Web.WebApi.OwinHost;
    using Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);

            DatabaseConfig.Initialize();
            AutoMapperConfig.RegisterMappings(Assembly.Load("Server.WebApi"));

            var config = new HttpConfiguration();
            WebApiConfig.Register(config);
            this.ConfigureAuth(app);

            app
                .UseNinjectMiddleware(NinjectConfig.CreateKernel)
                .UseNinjectWebApi(config);
        }
    }
}