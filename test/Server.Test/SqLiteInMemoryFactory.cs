using System;
using System.Data;
using ServiceStack.OrmLite;
using Shouldly;

namespace Sioux.TechRadar
{
	public class SqLiteInMemoryFactory : SqLiteConnectionFactory
	{
		//private static IDbConnection TheOneConnection;

		public SqLiteInMemoryFactory ()
		{
			ConnectionString = MemoryConnectionString;
			OrmLiteConnectionFactory = new OrmLiteConnectionFactory (MemoryConnectionString, false, SqliteDialect.Provider);
			var db=  OrmLiteConnectionFactory.OpenDbConnection ();
			db.CreateTableIfNotExists<Thing> ();
			db.TableExists ("Thing").ShouldBe(true);
		}


	}
}

