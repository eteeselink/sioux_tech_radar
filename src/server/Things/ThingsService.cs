using System;
using System.Linq;
using ServiceStack.ServiceInterface;
using NLog;
using ServiceStack.Common.Web;


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
			
		public object Get (ThingsRequest request)
		{
			logger.Debug("got request for things {}",this.RequestContext.AbsoluteUri);		
			return Repository.GetByName (request.Names);
		}

        public object Post(Thing thing)
		{
			if (Repository.GetByName (thing.Name).Count () == 1) {
				return Repository.StoreUpdated (thing);			
			}else {
				throw new HttpError(System.Net.HttpStatusCode.NotFound, "'"+thing.Name + "' does not exist yet");
			}
		}
			
		public object Put (Thing thing)
		{
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

