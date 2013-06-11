using NLog;
using ServiceStack.ServiceInterface;
using Sioux.TechRadar.Users.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users
{
    public class SessionService : Service
    {
        private static Logger logger = LogManager.GetLogger("SessionService");
        public IThingsRepository Repository { get; set; }  //Injected by IOC

        public void Post(SessionRequest sessionRequest)
        {

        }
    }
}
