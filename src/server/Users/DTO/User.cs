using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users.DTO
{
    public class User
    {
        [PrimaryKey]
        public string Username { get; set; }
    }
}
