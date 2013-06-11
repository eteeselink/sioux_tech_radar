using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users.Auth
{
    public class SiouxAuthProvider : CredentialsAuthProvider
    {
        public override bool TryAuthenticate(IServiceBase authService, string userName, string password)
        {
            var ok = SiouxExchangeServer.CheckLogin(userName, password);

            if (ok)
            {
                var usersRepo = authService.TryResolve<IUsersRepository>();
                usersRepo.GetOrCreateUser(userName);
            }
            return ok;
        }
        public override void OnAuthenticated(IServiceBase authService, IAuthSession session, IOAuthTokens tokens, Dictionary<string, string> authInfo)
        {
            
        }
    }
}
