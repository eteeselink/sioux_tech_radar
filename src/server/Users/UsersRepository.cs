using NLog;
using Sioux.TechRadar.Users.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ServiceStack.OrmLite;

namespace Sioux.TechRadar.Users
{
    public class UsersRepository : IUsersRepository
    {
        internal SqLiteConnectionFactory ConnectionFactory { get; private set; }
        private static Logger logger = NLog.LogManager.GetLogger("UsersRepository");

        public UsersRepository(SqLiteConnectionFactory factory)
        {
            ConnectionFactory = factory;
            EnsureTablesExist();
        }

        public void EnsureTablesExist()
        {
            using (var db = ConnectionFactory.Connect())
            {
                db.CreateTableIfNotExists<User>();
            }
        }

        public User GetOrCreateUser(string username)
        {
            using (var db = ConnectionFactory.Connect())
            {
                var user = db.SingleWhere<User>("Username", username);
                if (user == null)
                {
                    user = new User
                    { 
                        Username = username 
                    };
                    logger.Info("Created new user '{0}'", username);

                    db.Save(user);
                }
                return user;
            }
        }
    }
}
