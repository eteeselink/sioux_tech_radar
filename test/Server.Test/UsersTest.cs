using NUnit.Framework;
using Sioux.TechRadar.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Shouldly;

namespace Sioux.TechRadar
{
    [TestFixture]
    public class UsersTest
    {
        [Test]
        public void CanCreateOrGetUsersWithoutExceptions()
        {
            var repos = new UsersRepository()
            {
                ConnectionFactory = new TempSQLiteFactory()
            };
            var user = repos.GetOrCreateUser("George");
            user.Username.ShouldBe("George");

            var user2 = repos.GetOrCreateUser("George");
        }
    }
}
