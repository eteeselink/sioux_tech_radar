using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite;
using MoreLinq;
using Shouldly;

namespace Sioux.TechRadar
{
	public class SqLiteConnectionFactory : IDisposable
	{
		public const string MemoryConnectionString = ":memory:";

		private string connectionString;
		public string ConnectionString {
			get {
				return connectionString ?? MemoryConnectionString;
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

		public virtual IDbConnection Connect ()
		{
			return OrmLiteConnectionFactory.OpenDbConnection();
		}
	
		public void Dispose ()
		{
		
		}

	}
}

