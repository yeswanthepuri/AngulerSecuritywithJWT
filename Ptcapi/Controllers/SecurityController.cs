using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PtcApi.Model;
using PtcApi.Security;

namespace PtcApi.Controllers
{
    [Route("api/[controller]")]
    public class SecurityController : BaseApiController
    {
        public SecurityController(JwtSettings settings)
        {
            Settings = settings;
        }

        public readonly JwtSettings Settings = null;

        // GET api/values
        [HttpPost("login")]
        public IActionResult LogIn([FromBody]AppUser user)
        {
            IActionResult ret = null;
            AppUserAuth auth = new AppUserAuth();
            SecurityManager securityManager = new SecurityManager(Settings);

            try
            {
                auth = securityManager.ValidateUser(user);
                if (auth != null)
                {
                    ret = StatusCode(StatusCodes.Status200OK, auth);
                }
                else
                {
                    ret = StatusCode(StatusCodes.Status404NotFound,
                                   "InValid UserName/Password");
                }
            }
            catch (Exception ex)
            {
                ret = HandleException(ex,
                     "Exception trying to get all Categories");
            }

            return ret;
        }
    }
}
