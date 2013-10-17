using ServiceStack.ServiceInterface.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sioux.TechRadar.Users.DTO
{
    public class AuthResponseEx : AuthResponse
    {
        public string UserId { get; set; }
    }
}
