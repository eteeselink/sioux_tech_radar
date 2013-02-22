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

		private static LinkedList<Thing> things = things ?? new LinkedList<Thing>();
		public ThingsRepository()
		{
			things.AddLast(new Thing (){Name="1"});
		}

		public Thing Store(Thing thing)
		{
			things.AddLast (thing);
			return thing;
		}
		public IEnumerable<Thing> GetByName (string name)
		{
			return things.Where(t => name == t.Name);
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

