using NLog;
using ServiceStack.Common.Web;
using ServiceStack.ServiceInterface;
using ServiceStack.ServiceInterface.Auth;
using Sioux.TechRadar.Users.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;

namespace Sioux.TechRadar.Users
{
    
    public class SessionService : Service
    {
        private static Logger logger = LogManager.GetLogger("SessionService");
        public IThingsRepository Repository { get; set; }  //Injected by IOC

        public AuthResponseEx Get(SessionRequest sessionRequest)
        {

            var authSession = this.GetSession();
            if (authSession.UserAuthName == null)
            {
                throw new HttpError(HttpStatusCode.NotFound, "No session found. Log in, maybe?");
            }
            else
            {
                return new AuthResponseEx()
                {
                    SessionId = authSession.Id,
                    UserName = authSession.UserAuthName,
                    UserId = authSession.UserName,
                };
            }
        }

    }
}
