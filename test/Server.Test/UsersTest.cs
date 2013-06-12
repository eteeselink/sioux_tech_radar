using NUnit.Framework;
using Sioux.TechRadar.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Shouldly;
using System.Net;
using ServiceStack.ServiceInterface.Auth;
using ServiceStack.ServiceClient.Web;

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
            using(var tempDb = new TempFile())
            {
                //GlobalProxySelection.Select = new WebProxy("127.0.0.1", 8888); // proxy via Fiddler2.

                using (var fs = new Server()  { Port = 8000, SqliteFile = tempDb.Path })
                {
                    fs.Start();

                    var client = new WebClient();
                    var result = client.DownloadString(
                        FakeServer.BaseUri + "api/things/search?format=json"
                    );
                    Console.WriteLine(result);

                    var restClient = new JsonServiceClient(FakeServer.BaseUri);
                    var response = restClient.Post<AuthResponse>(
                        "/api/auth/credentials?format=json",
                        new Auth()
                        {
                            UserName = "tech",
                            Password = "radar",
                            RememberMe = true
                        });

                    response.SessionId.ShouldMatch(@"[a-zA-Z0-9=+/]{20,100}");

                    // FIXME: add to test that we can now access something that needs authentication.
                }
            }
        }

    
    }
}
