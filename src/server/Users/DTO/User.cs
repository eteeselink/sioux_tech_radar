﻿using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar.Users.DTO
{
    public class User
    {
        [PrimaryKey]
        public string UserId { get; set; }

        [Index(true)]
        public string Username { get; set; }
    }
}
