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
    /// <summary>
    /// Responsible for retrieving and storing Things in some form of persistance.
    /// </summary>
    public class ThingsRepository : IThingsRepository
    {
        private readonly SqLiteConnectionFactory connectionFactory;
        private static Logger logger = NLog.LogManager.GetLogger("ThingsRepository");

        public ThingsRepository(SqLiteConnectionFactory factory)
        {
            connectionFactory = factory;
            EnsureTablesExist();
        }

        private void EnsureTablesExist()
        {
            using (var db = connectionFactory.Connect())
            {
                db.CreateTableIfNotExists<Thing>();

                ////Fill some hardcoded entries (temp code)

                IEnumerable<Thing> result = null;
                result = GetAll();
                if (result.Count() == 0)
                {
                    //data if database is empty
                    
                    var thingToInsert = new Thing() { Title = @"C" };
                    thingToInsert.SetName();
                    thingToInsert.Quadrantid = Quadrant.Languages;
                    db.Insert(thingToInsert);

                    
                    thingToInsert = new Thing() { Title = @"Scala" };
                    thingToInsert.SetName();
                    thingToInsert.Quadrantid = Quadrant.Languages;
                    db.Insert(thingToInsert);
                }
            }
        }

        public Thing StoreNew (Thing thing)
        {
            try {
                using (var connection = connectionFactory.Connect()) {

                    if (String.IsNullOrWhiteSpace(thing.Name))
                    {
                        throw new ArgumentException("Name must be set");
                    }

                    connection.Insert (thing);
                }
                return thing;
            } catch (Exception e) {
                logger.ErrorException("attempted to insert a new thing",e);
                //throw new HttpError(HttpStatusCode.InternalServerError, "exception while trying to insert thing");
                return null;
            }
        }

        public Thing StoreUpdated (Thing thing)
        {
            try {
                using (var connection = connectionFactory.Connect()) {
                    connection.UpdateOnly( thing, t => t.Description ,  t => t.Name == thing.Name);
                }
                return thing;
            } catch (Exception e) {
                logger.ErrorException("attempted to update a thing",e);
                throw new HttpError(HttpStatusCode.InternalServerError, "exception while trying to update thing");
            }
        }
        public IEnumerable<Thing> GetByName (string name)
        {
            using (var connection = connectionFactory.Connect()) {
                return connection.Select<Thing>("Name = {0}",name);
            }
        }
        public IEnumerable<Thing> GetByName (string[] names)
        {
            using (var connection = connectionFactory.Connect()) {
                return connection.Select<Thing>("Name in ({0})", names.Aggregate((a,b) => a + ',' + b));
            }
        }
        public IEnumerable<Thing> GetByQuadrant (Quadrant quadrant)
        {
            using (var connection = connectionFactory.Connect()) {
                return connection.Select<Thing>("Quadrantid = {0}", quadrant);
            }
        }
        //TODO: make this perform properly
        public IEnumerable<Thing> Search (ThingsRequest request)
        {
            using (var connection = connectionFactory.Connect()) {
                return connection.Select<Thing>().Where( thing => thing.SoundsKindaLike(request.Keywords));
            }
        }
        public IEnumerable<Thing> GetAll ()
        {
            using (var connection = connectionFactory.Connect()) {
                return connection.Select<Thing>();
            }
        }
    }

}

