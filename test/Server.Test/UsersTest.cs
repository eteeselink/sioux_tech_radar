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

                using (var server = new Server()  { Port = 8000, SqliteFile = tempDb.Path })
                {
                    server.Start();
                    
                    // log in
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

                    // check session service
                    var checkResponse = restClient.Get<AuthResponse>("/api/session");
                    checkResponse.SessionId.ShouldMatch(@"[a-zA-Z0-9=+/]{20,100}");
                    checkResponse.UserName.ShouldBe("tech");


                    // log out
                    var logoutResponse = restClient.Delete<AuthResponse>("/api/auth/credentials?format=json&UserName=tech");
                    logoutResponse.SessionId.ShouldBe(null);


                    // check that GET /api/session 404s
                    var httpError = Should.Throw<WebServiceException>(() => 
                        restClient.Get<AuthResponse>("/api/session")
                    );
                    httpError.StatusCode.ShouldBe(404);
                }
            }
        }

    
    }
}
