using System;
using ServiceStack.ServiceInterface;

namespace Sioux.TechRadar
{
	public class ThingsService
	{
		public class TodosService : Service
		{
			public IThingsRepository Repository { get; set; }  //Injected by IOC
			
			public object Get(Things request)
			{
				return request.Names.Length == 0
					? Repository.GetAll()
						: Repository.GetByName(request.Names);
			}

			public object Post(Thing thing)
			{
				return Repository.Store(thing);
			}
			
			public object Put(Thing thing)
			{
				return Repository.Store(thing);
			}

			//not needed?
			//public void Delete(Thing thing):
		}
	}
}

