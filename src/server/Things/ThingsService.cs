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
	public class ThingsService: Service
	{
		private static Logger logger = LogManager.GetLogger("ThingsService");
		public IThingsRepository Repository { get; set; }  //Injected by IOC
			
		/// <summary>
		/// handles any GET request for Things. 
		/// </summary>
		/// <param name="request">Request.</param>
		public object Get (ThingsRequest request)
		{
			logger.Debug ("got request for things {}", this.RequestContext.AbsoluteUri);		
			if (request.Names != null && request.Names.Length > 0) {
				return Repository.GetByName (request.Names);
			}

			IEnumerable<Thing> result = null;
			if (request.Quadrant.HasValue) 
			{
				result = Repository.GetByQuadrant(request.Quadrant.Value);
			}
			if (request.Keywords != null && request.Keywords.Length > 0) {
				if (result == null){
					result = Repository.Search(request);
				}else{
					result = result.Intersect(Repository.Search(request));
				}
			}
			return result ?? new List<Thing>();
		}

        public object Post(Thing thing)
		{
			if (String.IsNullOrWhiteSpace(thing.Name) 
			    || thing.Quadrant == null
			    || String.IsNullOrEmpty(thing.Description)) throw new HttpError(HttpStatusCode.NotAcceptable,"Thing was not complete");

			if (Repository.GetByName (thing.Name).Count () == 1) {
				return Repository.StoreUpdated (thing);			
			}else {
				throw new HttpError(HttpStatusCode.NotFound, "'"+thing.Name + "' does not exist yet");
			}
		}
			
		public object Put (Thing thing)
		{
			if (String.IsNullOrWhiteSpace(thing.Name) 
			    || thing.Quadrant == null
			    || String.IsNullOrEmpty(thing.Description)) throw new HttpError(HttpStatusCode.NotAcceptable,"Thing was not complete");

			if (Repository.GetByName (thing.Name).Count () == 0) 
			{
				return Repository.StoreNew (thing);
			} else {
				throw new HttpError(System.Net.HttpStatusCode.Conflict, "'"+thing.Name + "' already exists");
			}

		}

		//not needed?
		//public void Delete(Thing thing):
	}
}

