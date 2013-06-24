using System;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite.Sqlite;
using ServiceStack.OrmLite;
using MoreLinq;
using NLog;
using ServiceStack.Common.Web;
using System.Net;

namespace Sioux.TechRadar
{
    public class OpinionsRepository: IOpinionsRepository
    {
        private readonly SqLiteConnectionFactory connectionFactory;
        private static Logger logger = NLog.LogManager.GetLogger("OpinionsRepository");

        public OpinionsRepository(SqLiteConnectionFactory factory)
        {
            connectionFactory = factory;
            EnsureTablesExist();
        }

        private void EnsureTablesExist()
        {
            using (var db = connectionFactory.Connect())
            {
                db.CreateTableIfNotExists<Opinion>();
            }
        }

        public IEnumerable<Opinion> GetByName(string name, string username)
        {
            using (var connection = connectionFactory.Connect())
            {
                return connection.Select<Opinion>("thingName = {0} AND user= {1}", name, username);
            }
        }

        public IEnumerable<Opinion> GetAll(string username)
        {
            using (var connection = connectionFactory.Connect())
            {
                return connection.Select<Opinion>("user= {0}", username);
            }
        }

        public object StoreUpdated(Opinion opinion)
        {
            try
            {
                var matchingOpinion = GetByName(opinion.thingName, opinion.user).First();
                using (var connection = connectionFactory.Connect())
                {
                    opinion.id = matchingOpinion.id;
                    if (String.IsNullOrEmpty(opinion.rant)) {
                        opinion.rant = matchingOpinion.rant;
                    }
                    connection.Update(opinion);
                }
                return opinion;
            }
            catch (Exception e)
            {
                logger.ErrorException("attempted to update a opinion", e);
                throw new HttpError(HttpStatusCode.InternalServerError, "exception while trying to update opinion");
            }
        }

        public object StoreNew(Opinion opinion)
        {
            try
            {
                using (var connection = connectionFactory.Connect())
                {
                    connection.Insert(opinion);
                }
                return opinion;
            }
            catch (Exception e)
            {
                logger.ErrorException("attempted to insert a new opinion", e);
                throw new HttpError(HttpStatusCode.InternalServerError, "exception while trying to insert opinion");
            }
        }

        public void Delete(string name, string username)
        {
            Opinion opinion = this.GetByName(name, username).First();
            if (opinion == null) throw new HttpError(HttpStatusCode.NotFound, "exception while trying to delete opinion");
            using (var connection = connectionFactory.Connect())
            {

                connection.Delete(opinion);
            }
        }
    }
}
