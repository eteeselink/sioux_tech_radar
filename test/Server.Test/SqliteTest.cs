using System;
using NUnit.Framework;

namespace Sioux.TechRadar
{
    [TestFixture]
    public class SqliteTest
    {

        [Test]
        public void BasicSqliteConnectionFactorUsageTest()
        {
            var factory = new SqLiteConnectionFactory();

            // this should now be the default sqlite in memory 
            using (var connection = factory.Connect())
            {

                Assert.That(connection.ConnectionString, Is.EqualTo(factory.ConnectionString));
                Assert.That(connection.ConnectionString, Is.EqualTo(SqLiteConnectionFactory.MemoryConnectionString));

                Assert.That(connection.Database, Is.Not.Null);
            }

        }

    }
}

