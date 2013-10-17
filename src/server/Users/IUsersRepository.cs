using Sioux.TechRadar.Users.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users
{
    public interface IUsersRepository
    {
        User GetOrCreateUser(string username);
        User GetUser(string userid);
    }
}
