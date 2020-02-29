using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PtcApi.Model;

namespace PtcApi.Security
{
    public class SecurityManager
    {

        public SecurityManager(JwtSettings settings)
        {
            Settings = settings;
        }

        public readonly JwtSettings Settings = null;
        public AppUserAuth ValidateUser(AppUser user)
        {
            var ret = new AppUserAuth();
            AppUser authuser = null;
            try
            {
                using (var db = new PtcDbContext())
                {
                    authuser = db.Users.Where(
                        x => x.UserName.ToLower() == user.UserName.ToLower() &&
                        x.Password == user.Password
                    ).FirstOrDefault();
                }
                if (authuser != null)
                {
                    ret = BuildUserAuthObject(authuser);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Exception while retreving a claim", ex);
            }

            return ret;
        }

        protected List<AppUserClaim> GetUserClaimes(AppUser user)
        {
            List<AppUserClaim> list = new List<AppUserClaim>();

            try
            {
                using (var db = new PtcDbContext())
                {
                    list = db.Claims.Where(x => x.UserId == user.UserId).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Exception while retreving a claim", ex);
            }
            return list;
        }
        protected AppUserAuth BuildUserAuthObject(AppUser user)
        {
            AppUserAuth ret = new AppUserAuth();
            List<AppUserClaim> claims = new List<AppUserClaim>();

            ret.UserName = user.UserName;
            ret.IsAuthenticated = true;
            ret.BearerToken = new Guid().ToString();

            ret.Claims = GetUserClaimes(user);
            ret.BearerToken = BuildJwtToken(ret);
            return ret;
        }

        protected string BuildJwtToken(AppUserAuth authUser)
        {
            SymmetricSecurityKey IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Settings.Key));

            List<Claim> jwtClaims = new List<Claim>();
            jwtClaims.Add(new Claim(JwtRegisteredClaimNames.Sub, authUser.UserName));
            jwtClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

            foreach (var claim in authUser.Claims)
            {
                jwtClaims.Add(new Claim(claim.ClaimType, claim.ClaimValue));
            }
             jwtClaims.Add(new Claim("IsAuthenticated", authUser.IsAuthenticated.ToString().ToLower()));

            var token = new JwtSecurityToken(
            issuer: Settings.Issuer,
            audience: Settings.Audience,
            claims: jwtClaims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(Settings.MinutesToExpire),
            signingCredentials: new SigningCredentials(IssuerSigningKey, SecurityAlgorithms.HmacSha256)

            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}