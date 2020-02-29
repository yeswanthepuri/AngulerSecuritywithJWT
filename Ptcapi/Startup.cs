using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;

namespace Ptcapi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public JwtSettings GetJwtSettings()
        {
            JwtSettings settings = new JwtSettings();
            settings.Key = Configuration["JwtSettings:key"];
            settings.Audience = Configuration["JwtSettings:issuer"];
            settings.Issuer = Configuration["JwtSettings:audience"];
            settings.MinutesToExpire = Convert.ToInt32(Configuration["JwtSettings:minutstoexpire"]);
            return settings;
        }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers().AddNewtonsoftJson(options =>
                                                                    options.SerializerSettings.ContractResolver =
                                                                    new CamelCasePropertyNamesContractResolver());
            JwtSettings settings;
            settings = GetJwtSettings();
            services.AddSingleton<JwtSettings>(settings);
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "JwtBearer";
                option.DefaultChallengeScheme = "JwtBearer";
            }).AddJwtBearer("JwtBearer", jwtOption =>
            {
                jwtOption.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key)),

                    ValidateIssuer = true,
                    ValidIssuer = settings.Issuer,

                    ValidateActor = true,
                    ValidAudience = settings.Audience,

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(settings.MinutesToExpire)
                };
            });
            //these are case sensitive
            services.AddAuthorization(configure =>
            {
                configure.AddPolicy("CanAccessProducts", policy => policy.RequireClaim("CanAccessProducts", "true"));
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(options => options.WithOrigins(
         "http://localhost:4200").AllowAnyMethod().AllowAnyHeader());

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
