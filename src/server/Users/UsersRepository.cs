using NLog;
using Sioux.TechRadar.Users.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ServiceStack.OrmLite;
using System.Security.Cryptography;

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

        /// <summary>
        /// Computes a probably-unique id that is URL-safe.
        /// </summary>
        private string GetUniqueId()
        {
            var bytes = new byte[6];  // 6 bytes becomes 8 base64 chars. should be unique enough for our purposes.
            RNGCryptoServiceProvider.Create().GetNonZeroBytes(bytes);
            return Convert.ToBase64String(bytes)
                .TrimEnd('=')
                .Replace('/', '-')
                .Replace('+', '_');
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
                        Username = username,
                        UserId = GetUniqueId(),
                    };
                    logger.Info("Created new user '{0}'", username);

                    db.Save(user);
                }
                return user;
            }
        }
    }
}
