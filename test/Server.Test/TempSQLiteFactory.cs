using System;
using System.Data;
using ServiceStack.OrmLite;
using Shouldly;
using System.Data.SQLite;
using Sioux.TechRadar.Users.DTO;

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
            db.CreateTableIfNotExists<User>();
            db.TableExists("Thing").ShouldBe(true);
            db.TableExists("User").ShouldBe(true);
        }


    }
}

