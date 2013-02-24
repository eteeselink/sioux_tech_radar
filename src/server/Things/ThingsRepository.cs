using System;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite.Sqlite;

namespace Sioux.TechRadar
{
	/// <summary>
	/// Responsible for retrieving and storing Things in some form of persistance.
	/// </summary>
	public class ThingsRepository : IThingsRepository
	{
		public ThingsRepository ()
		{

		}
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
		public IEnumerable<Thing> GetByQuadrant (Quadrant quadrant)
		{
			throw new NotImplementedException ();
		}
		public IEnumerable<Thing> Search (ThingsRequest request)
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

