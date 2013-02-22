using System;
using System.Linq;
using System.Data.Linq;
using System.Collections.Generic;

namespace Sioux.TechRadar
{
	public class FakeThingsRepository : IThingsRepository
	{
		public LinkedList<Thing> Things{ get; set; }

		public FakeThingsRepository ()
		{
			Things = new LinkedList<Thing>();
		}

		public Thing SetupFakeThing()
		{
			var csharp = new Thing(){Name=@"C#"};
			this.Things.AddFirst(csharp);
			return csharp;
		}


		public void Dispose ()
		{

		}

		public Thing StoreNew (Thing thing)
		{
			Things.AddLast(thing);
			return thing;
		}
		public Thing StoreUpdated(Thing thing)
		{
			Things = Things.Select( t => t.Name == thing.Name ? thing : t);
			return thing;
		}
		public IEnumerable<Thing> GetByName (string name)
		{
			return Things.Where(t => name == t.Name);
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			return  Things.Where( thing => names.Contains( thing.Name ));
		}

		public IEnumerable<Thing> GetAll ()
		{
			return Things;
		}

	}
}

