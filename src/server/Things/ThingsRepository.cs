using System;
using ServiceStack.ServiceInterface;

namespace Sioux.TechRadar
{
	public class ThingsRepository : IThingsRepository
	{
		public object Store(Thing thing)
		{
			throw new NotImplementedException ();
		}

		public object GetByName (string[] names)
		{
			throw new NotImplementedException ();
		}
		public object GetAll ()
		{
			throw new NotImplementedException ();
		}
	}

}

