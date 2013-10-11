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
            if (userName == "tech" && password == "radar")
            {
                return true;
            }
            return SiouxExchangeServer.CheckLogin(userName, password);
        }

        public override void OnAuthenticated(IServiceBase authService, IAuthSession session, IOAuthTokens tokens, Dictionary<string, string> authInfo)
        {
            // Note:
            // `session.UserAuthName` is already set to the user's user name.
            
            var usersRepo = authService.TryResolve<IUsersRepository>();
            var user = usersRepo.GetOrCreateUser(session.UserAuthName);
            session.UserName = user.Username;
            authService.SaveSession(session);
        }
    }
}
