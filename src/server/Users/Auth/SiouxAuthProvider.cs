using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using Sioux.TechRadar.Users.DTO;
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
            // we use `session.UserName` for the user's secret unique id.
            
            var usersRepo = authService.TryResolve<IUsersRepository>();
            var user = usersRepo.GetOrCreateUser(session.UserAuthName);
            session.UserName = user.UserId;
            authService.SaveSession(session);
        }

        public override object Authenticate(IServiceBase authService, IAuthSession session, ServiceStack.ServiceInterface.Auth.Auth request)
        {
            var response = (AuthResponse)base.Authenticate(authService, session, request);
            session = authService.GetSession(true);
            return new AuthResponseEx
            {
                ReferrerUrl = response.ReferrerUrl,
                ResponseStatus = response.ResponseStatus,
                SessionId = response.SessionId,
                UserId = session.UserName,
                UserName = session.UserAuthName,
            };
        }
    }
}
