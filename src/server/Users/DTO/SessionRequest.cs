using ServiceStack.ServiceHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users.DTO
{
    [Route("/api/session", "POST")]
    public class SessionRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
