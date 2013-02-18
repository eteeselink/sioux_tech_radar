using System;

namespace Sioux.TechRadar
{
	public interface IThingsRepository
	{
		object Store(Thing thing);
		object GetByName (string[] names);	
		object GetAll();
	}
}

