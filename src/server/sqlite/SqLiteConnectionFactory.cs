using System;
using System.Data;
using ServiceStack.OrmLite;

namespace Sioux.TechRadar
{
	public class SqLiteConnectionFactory
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

		public IDbConnection Connect ()
		{
			return ormLiteConnecdtionFactory.OpenDbConnection ();
		}
	}
}

