using System;
using System.Collections.Generic;


namespace Sioux.TechRadar
{
	public interface IThingsRepository
	{
		Thing StoreNew(Thing thing);
		Thing StoreUpdated(Thing thing);
		IEnumerable<Thing> GetByName (string[] names);	
		Thing Get (string name, Quadrant quadrant);	
		IEnumerable<Thing> GetByQuadrant (Quadrant quadrant);
		IEnumerable<Thing> Search (ThingsRequest request);
		IEnumerable<Thing> GetAll();
	}
}

