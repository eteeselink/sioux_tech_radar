using System;
using ServiceStack.ServiceInterface;
using System.Collections.Generic;

namespace Sioux.TechRadar
{
	public class ThingsRepository : IThingsRepository
	{

		private static LinkedList<Thing> things = things ?? new LinkedList<Thing>();
		public ThingsRepository()
		{
			things.AddLast (new Thing (){Name="1"});
		}

		public IEnumerable<Thing> Store(Thing thing)
		{
			things.AddLast (thing);
			return things;
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			return things;
		}
		public IEnumerable<Thing> GetAll ()
		{
			return things;
		}
		public virtual void Dispose(){
			things.Clear ();
		}
	}

}

