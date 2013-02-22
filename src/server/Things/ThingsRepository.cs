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

		private static IEnumerable<Thing> things = things ?? new LinkedList<Thing>();
		public ThingsRepository()
		{
			things.Add (new Thing (){Name="1"});
		}

		public IEnumerable<Thing> Store(Thing thing)
		{
			things.Add (thing);
			return things;
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			return things.Where(t => names.Contains(t.Name));
		}
		public IEnumerable<Thing> GetAll ()
		{
			return things;
		}
		public virtual void Dispose(){

		}
	}

}

