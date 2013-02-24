using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite;
using MoreLinq;

namespace Sioux.TechRadar
{
	public class SqLiteConnectionFactory : IDisposable
	{
		public SqLiteConnectionFactory ()
		{
			ConnectionString = ":memory:";
		}

		private string connectionString;
		public string ConnectionString {
			get {
				return connectionString ?? ":memory";
			} 
			internal set{
				connectionString = value;
				//TODO: check if it is a file, and if the file exists
			}
		}

		private OrmLiteConnectionFactory ormLiteConnecdtionFactory;
		public OrmLiteConnectionFactory OrmLiteConnectionFactory {
			get {
				if (ormLiteConnecdtionFactory == null) {
					ormLiteConnecdtionFactory = new OrmLiteConnectionFactory(ConnectionString, SqliteDialect.Provider);
				}
				return ormLiteConnecdtionFactory;
			}
			internal set{
				ormLiteConnecdtionFactory = value;
			}
		}

		private LinkedList<IDbConnection> CreatedConnections = new LinkedList<IDbConnection>();
		public IDbConnection Connect ()
		{
			var connection = OrmLiteConnectionFactory.OpenDbConnection ();
			CreatedConnections.AddLast(connection);
			return connection;
		}

		public void Dispose ()
		{
			//note from the docs : An application can call Close more than one time without generating an exception
			CreatedConnections.ForEach((connection)=>connection.Close());
		}

	}
}

