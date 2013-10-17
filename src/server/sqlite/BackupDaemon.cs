using NLog;
using ServiceStack.OrmLite;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sioux.TechRadar.sqlite
{
    /// <summary>
    /// Class that repeatedly backups the entire SQLite database file to a file
    /// in the 'backup\\' subdirectory.
    /// 
    /// Uses NET 4.5's excellent Task.Delay for simple scheduling.
    /// 
    /// Note: because this class depends on features only offered by the official SQLite
    /// System.Data.SQLite bindings, using this class means that running the app on
    /// Mono is not trivial (because System.Data.SQLite refers to a native Windows sqlite.dll,
    /// by default). The alternative Mono.Data.Sqlite does not have this limitation, and the
    /// rest of the app works fine with it, but this driver does not support SQLite's fancy
    /// backup functionality.
    /// </summary>
    class BackupDaemon : IDisposable
    {
        private static Logger logger = LogManager.GetLogger("BackupDaemon");

        private readonly SqLiteConnectionFactory factory;
        private readonly TimeSpan period;
        private bool stop = false;

        /// <summary>
        /// Schedule the database that `factory` points to for backup every `period` amount of time.
        /// Dispose this object to stop backupping.
        /// </summary>
        public BackupDaemon(SqLiteConnectionFactory factory, TimeSpan period)
        {
            this.factory = factory;
            this.period = period;

            // start loop task and forget about it
            var task = Loop();
        }

        /// <summary>
        /// Repeatedly schedules a backup operation until we're asked to stop.
        /// Due to Task.Delay, there's no busy waiting or painful thread management here.
        /// </summary>
        private async Task Loop()
        {
            while (!stop)
            {
                await Task.Delay(period);
                Backup();
            }
        }

        /// <summary>
        /// Attempts to perform a backup, silently fails and logs exception if something
        /// went wrong.
        /// </summary>
        private void Backup()
        {
            try
            {
                // compute the earliest non-existing filename like "backup_20131017_14_1.sqlite", for the 2nd backup past 14:00 on October 17th.
                var destName = String.Format("backup_{0:yyyyMMdd_HH}", DateTime.Now);
                var filename = "";
                int count = 0;
                do
                {
                    filename = String.Format("backup\\{0}_{1}.sqlite", destName, count);
                    count++;
                } while(File.Exists(filename));

                var destFactory = new SqLiteConnectionFactory
                {
                    ConnectionString = filename,
                };

                using (var dest = (OrmLiteConnection)destFactory.Connect())
                {
                    var destSqlite = (SQLiteConnection)dest.DbConnection;
                    using (var source = (OrmLiteConnection)factory.Connect())
                    {
                        var sourceSqlite = (SQLiteConnection)source.DbConnection;
                        sourceSqlite.BackupDatabase(destSqlite, "main", "main", -1, null, 1000);
                    }
                }
            }
            catch (Exception e)
            {
                logger.ErrorException("Could not backup database", e);
            }
        }

        public void Dispose()
        {
            stop = true;
        }
    }
}
