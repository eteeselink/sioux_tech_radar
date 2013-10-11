using System;
using System.Linq;
using ServiceStack.ServiceInterface;
using NLog;
using ServiceStack.Common.Web;
using System.Collections.Generic;
using System.Net;


namespace Sioux.TechRadar
{
    /// <summary>
    /// Things service is automatically used by servicestack to handle the requests from the client.
    /// Servicestack will automatically determine which routes are possible by the attributes in the DTO's
    /// </summary>
    public class ThingsService : Service
    {
        private static Logger logger = LogManager.GetLogger("ThingsService");
        public IThingsRepository Repository { get; set; }  //Injected by IOC

        /// <summary>
        /// handles any GET request for Things. 
        /// This will only retrieve data.
        /// </summary>
        /// <param name="request">Request.</param>
        public IEnumerable<Thing> Get(ThingsRequest request)
        {
            Console.WriteLine("Get received");

            logger.Debug("got request for things {}", this.RequestContext.AbsoluteUri);
            if (request.Names != null && request.Names.Length > 0)
            {
                return Repository.GetByName(request.Names);
            }

            IEnumerable<Thing> result = null;
            if (request.Quadrant.HasValue)
            {
                result = Repository.GetByQuadrant(request.Quadrant.Value);
            }
            if (request.Keywords != null && request.Keywords.Length > 0)
            {
                if (result == null)
                {
                    result = Repository.Search(request);
                }
                else
                {
                    result = result.Intersect(Repository.Search(request));
                }
            }
            else
            {
                if (result == null)
                {
                    // all request members empty -> search all.
                    result = Repository.GetAll();
                }
            }
            return result ?? new List<Thing>();
        }


        /// <summary>
        /// This will create a new Thing
        /// </summary>
        /// <param name="thing">Thing.</param>
        public object Post(Thing thing)
        {
            Console.WriteLine("Post received thing string = " + thing.ToString());
            
            if (String.IsNullOrWhiteSpace(thing.Title)
               ) throw new HttpError(HttpStatusCode.NotAcceptable, "Thing was not complete");

            thing.SetName();

            var existingThing = Repository.Get(thing.Name);
            if (existingThing == null)
            {
                return Repository.StoreNew(thing);
            }
            else if (existingThing.Quadrantid == thing.Quadrantid)
            {
                return existingThing;
            }
            else
            {
                throw new HttpError(System.Net.HttpStatusCode.Conflict, "'" + thing.Name + "' already exists (for category '" + thing.Quadrantid + "')");
            }
        }
    }
}

