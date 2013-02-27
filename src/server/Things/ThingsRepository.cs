using System;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite.Sqlite;
using ServiceStack.OrmLite;
using MoreLinq;
using NLog;
using ServiceStack.Common.Web;
using System.Net;
using Shouldly;

namespace Sioux.TechRadar
{
	/// <summary>
	/// Responsible for retrieving and storing Things in some form of persistance.
	/// </summary>
	public class ThingsRepository : IThingsRepository
	{
		internal SqLiteConnectionFactory ConnectionFactory{get;set;}
		private static Logger logger = NLog.LogManager.GetLogger("ThingsRepository");

		public ThingsRepository(){

		}

		public Thing StoreNew (Thing thing)
		{
			try {
				using (var connection = ConnectionFactory.Connect()) {
					connection.TableExists("Thing").ShouldBe(true);
					connection.Insert (thing);
				}
				return thing;
			} catch (Exception e) {
				logger.ErrorException("attempted to insert a new thing",e);
				throw new HttpError(HttpStatusCode.InternalServerError, "exception while trying to insert thing");
			}
		}

		public Thing StoreUpdated (Thing thing)
		{
			try {
				using (var connection = ConnectionFactory.Connect()) {
					connection.Update (thing);
				}
				return thing;
			} catch (Exception e) {
				logger.ErrorException("attempted to update a thing",e);
				throw new HttpError(HttpStatusCode.InternalServerError, "exception while trying to update thing");
			}
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

