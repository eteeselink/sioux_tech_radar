﻿using System;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite.Sqlite;
using ServiceStack.OrmLite;
using MoreLinq;
using NLog;
using ServiceStack.Common.Web;
using System.Net;
using Shouldly;

namespace Sioux.TechRadar
{
    public class OpinionsRepository: IOpinionsRepository
    {
        internal SqLiteConnectionFactory ConnectionFactory { get; set; }
        private static Logger logger = NLog.LogManager.GetLogger("OpinionsRepository");

        public OpinionsRepository EnsureTablesExist()
        {
            using (var db = ConnectionFactory.Connect())
            {
                db.CreateTableIfNotExists<Opinion>();
            }
            return this;
        }

        public IEnumerable<Opinion> GetByName(string name)
        {
            using (var connection = ConnectionFactory.Connect())
            {
                return connection.Select<Opinion>("thingName = {0}", name);
            }
        }

        object IOpinionsRepository.StoreUpdated(Opinion opinion)
        {
            try
            {
                using (var connection = ConnectionFactory.Connect())
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

        object IOpinionsRepository.StoreNew(Opinion opinion)
        {
            try
            {
                using (var connection = ConnectionFactory.Connect())
                {
                    connection.TableExists("Opinion").ShouldBe(true);
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

        public virtual void Dispose()
        {
            ConnectionFactory.Dispose();
        }
    }
}
