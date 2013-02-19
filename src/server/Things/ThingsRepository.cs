using System;
using ServiceStack.ServiceInterface;
using System.Collections.Generic;

namespace Sioux.TechRadar
{
	public class ThingsRepository : IThingsRepository
	{
		public IEnumerable<Thing> Store(Thing thing)
		{
			throw new NotImplementedException ();
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			throw new NotImplementedException ();
		}
		public IEnumerable<Thing> GetAll ()
		{
			throw new NotImplementedException ();
		}
		public void Dispose(){
		}
	}

}

