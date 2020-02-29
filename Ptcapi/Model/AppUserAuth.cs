using System.Collections.Generic;
using PtcApi.Model;
namespace PtcApi.Security
{
    public partial class AppUserAuth
    {
        public AppUserAuth()
        {
            UserName = "Not Authorized";
            BearerToken = string.Empty;

        }
        public string UserName { get; set; }
        public string BearerToken { get; set; }
        public bool IsAuthenticated { get; set; }
        public List<AppUserClaim> Claims { get; set; }

        // public bool CanAccessProducts { get; set; }
        // public bool CanAddProduct { get; set; }
        // public bool CanSaveProduct { get; set; }
        // public bool CanAccessCategories { get; set; }
        // public bool CanAddCategory { get; set; }
    }
}