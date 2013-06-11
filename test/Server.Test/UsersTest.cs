using NUnit.Framework;
using Sioux.TechRadar.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Shouldly;
using System.Net;

namespace Sioux.TechRadar
{
    [TestFixture]
    public class UsersTest
    {
        [Test]
        public void CanCreateOrGetUsersWithoutExceptions()
        {
            var repos = new UsersRepository(new TempSQLiteFactory());

            var user = repos.GetOrCreateUser("George");
            user.Username.ShouldBe("George");

            var user2 = repos.GetOrCreateUser("George");
        }


        [Test()]
        public void TryLogin()
        {
            // RED TEST PATTERN!
            using (FakeServer fs = new FakeServer().StartWithRealRepos())
            {
                //using (JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri))
                {
                    var client = new WebClient();
                    var result = client.UploadString(
                        FakeServer.BaseUri +"api/auth?format=json", 
                        "POST", 
                        @"{""UserName"":""skrebbel"",""Password"":""gak"",""RememberMe"":true}"
                    );
                    Console.WriteLine(result);
                }
            }
        }

    
    }
}
