using System;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite.Sqlite;
using ServiceStack.OrmLite;
using MoreLinq;

namespace Sioux.TechRadar
{
	/// <summary>
	/// Responsible for retrieving and storing Things in some form of persistance.
	/// </summary>
	public class ThingsRepository : IThingsRepository
	{
		internal SqLiteConnectionFactory ConnectionFactory{get;set;}

		public Thing StoreNew (Thing thing)
		{
			using (var connection = ConnectionFactory.Connect()) {
				connection.Insert(thing);
			}
			return thing;
		}
		public Thing StoreUpdated(Thing thing)
		{
			using (var connection = ConnectionFactory.Connect()) {
				connection.Update(thing);
			}
			return thing;
		}
		public IEnumerable<Thing> GetByName (string name)
		{
			using (var connection = ConnectionFactory.Connect()) {
				return connection.Select<Thing>("Name = {0}",name);
			}
		}
		public IEnumerable<Thing> GetByName (string[] names)
		{
			using (var connection = ConnectionFactory.Connect()) {
				return connection.Select<Thing>("Name in ({0})", names.Aggregate((a,b) => a + ',' + b));
			}
		}
		public IEnumerable<Thing> GetByQuadrant (Quadrant quadrant)
		{
			using (var connection = ConnectionFactory.Connect()) {
				return connection.Select<Thing>("Quadrant = {0}", quadrant);
			}
		}
		public IEnumerable<Thing> Search (ThingsRequest request)
		{
			using (var connection = ConnectionFactory.Connect()) {
				return connection.Select<Thing>().Where( thing => thing.SoundsKindaLike(request.Keywords));
			}
		}
		public IEnumerable<Thing> GetAll ()
		{
			using (var connection = ConnectionFactory.Connect()) {
				return connection.Select<Thing>();
			}
		}
		public virtual void Dispose()
		{
			ConnectionFactory.Dispose();
		}
	}

}

