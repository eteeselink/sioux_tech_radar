using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.OrmLite;
using MoreLinq;
using Shouldly;
using System.Data.SQLite;
using System.IO;

namespace Sioux.TechRadar
{
	public class SqLiteConnectionFactory : IDisposable
	{
		public const string MemoryConnectionString = ":memory:";

		public SqLiteConnectionFactory(){
			AutodDisposeConnection = false;
			ConnectionString = MemoryConnectionString;
		} 

		public bool AutodDisposeConnection{get;set;}
		private string connectionString;
		public string ConnectionString {
			get {
				return connectionString ?? MemoryConnectionString;
			} 
			internal set{
				connectionString = value;

				if ( connectionString != null && connectionString != MemoryConnectionString ) {
					AutodDisposeConnection = true;
					EnsureFileExists();
				}
				
			}
		}

		private OrmLiteConnectionFactory ormLiteConnecdtionFactory;
		public OrmLiteConnectionFactory OrmLiteConnectionFactory {
			get {
				if (ormLiteConnecdtionFactory == null) {
					ormLiteConnecdtionFactory = new OrmLiteConnectionFactory(ConnectionString, AutodDisposeConnection, SqliteDialect.Provider);	
				}
				return ormLiteConnecdtionFactory;
			}
			internal set{
				ormLiteConnecdtionFactory = value;
			}
		}
		/// <summary>
		/// Creates a new DB connection, which is auto disposed
		/// </summary>
		public virtual IDbConnection Connect ()
		{		
			return OrmLiteConnectionFactory.OpenDbConnection();
		}

		/// <summary>
		/// Ensures the SQLite file exists.
		/// </summary>
		public void EnsureFileExists ()
		{
			if (!ConnectionString.Equals(MemoryConnectionString) 
			    	&&!File.Exists (ConnectionString)) {
				SQLiteConnection.CreateFile(ConnectionString);
			}
		}
	
		public void Dispose ()
		{
		
		}

	}
}

