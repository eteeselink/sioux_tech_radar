using System;
using ServiceStack.ServiceInterface;


namespace Sioux.TechRadar
{

	public class ThingsService: Service
	{
		public IThingsRepository Repository { get; set; }  //Injected by IOC
			
		public object Get (ThingsRequest request)
		{
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

