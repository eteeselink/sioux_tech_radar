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

		public IDbConnection Connect ()
		{
			return OrmLiteConnectionFactory.OpenDbConnection ();;
		}
	
		public void Dispose ()
		{
		
		}

	}
}

