using System;
using System.Data;
using ServiceStack.OrmLite;
using Shouldly;
using System.Data.SQLite;

namespace Sioux.TechRadar
{
	public class TempSQLiteFactory : SqLiteConnectionFactory
	{
		//private static IDbConnection TheOneConnection;
		private TempFile SqlFile;

		public TempSQLiteFactory ()
		{
			SqlFile = new TempFile();
			SQLiteConnection.CreateFile(SqlFile.Path);

			ConnectionString = SqlFile.Path;
			OrmLiteConnectionFactory = new OrmLiteConnectionFactory (ConnectionString, true, SqliteDialect.Provider);
			var db=  OrmLiteConnectionFactory.OpenDbConnection ();
			db.CreateTableIfNotExists<Thing> ();
			db.TableExists ("Thing").ShouldBe(true);
		}


	}
}

