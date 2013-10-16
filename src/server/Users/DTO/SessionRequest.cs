using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users.DTO
{
    [Route("/api/session", "GET")]
    public class SessionRequest
    {
    }

    [Route("/api/validate_credentials", "GET")]
    [Authenticate]
    public class ValidateCredentials
    {
    }
}
