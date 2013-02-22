using System;
using System.Linq;
using ServiceStack.ServiceInterface;
using System.Collections.Generic;

namespace Sioux.TechRadar
{
	/// <summary>
	/// Responsible for retrieving and storing Things in some form of persistance.
	/// </summary>
	public class ThingsRepository : IThingsRepository
	{
		public Thing StoreNew(Thing thing)
		{
			throw new NotImplementedException ();
		}
		public Thing StoreUpdated(Thing thing)
		{
			throw new NotImplementedException ();
		}
		public IEnumerable<Thing> GetByName (string name)
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
		public virtual void Dispose()
		{
			throw new NotImplementedException ();
		}
	}

}

