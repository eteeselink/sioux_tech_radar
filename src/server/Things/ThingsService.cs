using System;
using ServiceStack.ServiceInterface;
using NLog;


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
			return Repository.Store (thing);
		}
			
		public object Put (Thing thing)
		{
			return Repository.Store (thing);
		}

		//not needed?
		//public void Delete(Thing thing):
	}
}

