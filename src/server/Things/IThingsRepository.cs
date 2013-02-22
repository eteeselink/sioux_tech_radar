using System;
using System.Collections.Generic;


namespace Sioux.TechRadar
{
	public interface IThingsRepository : IDisposable
	{
		Thing StoreNew(Thing thing);
		Thing StoreUpdated(Thing thing);
		IEnumerable<Thing> GetByName (string[] names);	
		IEnumerable<Thing> GetByName (string name);	
		IEnumerable<Thing> GetByQuadrant (Quadrant quadrant);
		IEnumerable<Thing> Search (ThingsRequest request);
		IEnumerable<Thing> GetAll();
	}
}

