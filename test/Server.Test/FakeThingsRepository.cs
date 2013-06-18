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


		public Thing StoreNew (Thing thing)
		{
			Things.AddLast(thing);
			return thing;
		}
		public Thing StoreUpdated(Thing thing)
		{
			var oldThing = Things.Where (t => t.Name == thing.Name).First ();
			oldThing.Description = thing.Description;
			oldThing.Quadrantid = thing.Quadrantid;
			return oldThing;
		}
		public IEnumerable<Thing> GetByName (string name)
		{
			return Things.Where(t => name == t.Name);
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			return  Things.Where( thing => names.Contains( thing.Name ));
		}
		public IEnumerable<Thing> GetByQuadrant (Quadrant quadrant)
		{
			return Things.Where( thing => thing.Quadrantid == quadrant);
		}
		public IEnumerable<Thing> Search (ThingsRequest request)
		{
			return Things.Where( thing => thing.SoundsKindaLike(request.Keywords));
		}
		public IEnumerable<Thing> GetAll ()
		{
			return Things;
		}

	}
}

