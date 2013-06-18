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

        public IEnumerable<Opinion> GetByName(string name)
        {
            using (var connection = connectionFactory.Connect())
            {
                return connection.Select<Opinion>("thingName = {0}", name);
            }
        }

        public IEnumerable<Opinion> GetAll()
        {
            using (var connection = connectionFactory.Connect())
            {
                return connection.Select<Opinion>();
            }
        }

        public object StoreUpdated(Opinion opinion)
        {
            try
            {
                using (var connection = connectionFactory.Connect())
                {
                    connection.UpdateOnly(opinion,o => o.goodness);
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

        public void Delete(string name)
        {
            Opinion opinion = this.GetByName(name).First();
            if (opinion == null) throw new HttpError(HttpStatusCode.NotFound, "exception while trying to delete opinion");
            using (var connection = connectionFactory.Connect())
            {

                connection.Delete(opinion);
            }
        }
    }
}
