using System;
using NUnit.Framework;

namespace Sioux.TechRadar
{
	[TestFixture]
	public class SqliteTest
	{

		[Test]
		public void BasicSqliteConnectionFactorUsageTest ()
		{
			using (var factory = new SqLiteConnectionFactory()){
				// this should now be the default sqlite in memory 
				using(var connection = factory.Connect()){

					Assert.That(connection.ConnectionString, Is.EqualTo(factory.ConnectionString));
					Assert.That(connection.ConnectionString, Is.EqualTo(":memory:"));

					Assert.That(connection.Database, Is.Not.Null);
				}
			}
		}

		[Test]
		public void FactoryConnectionCleanuperTest ()
		{
			using (var factory = new SqLiteConnectionFactory()){
				// this should now be the default sqlite in memory 
				using(var connection = factory.Connect()){
					//use connection, bla bla.
				}
				//now connection was closed or disposed, but factory still has a reference
				Assert.That(factory.CreatedConnections.Count, Is.EqualTo(1));
			}
		}
	}
}

