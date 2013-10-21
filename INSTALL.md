Installing the Sioux Tech Radar
===============================

Windows
-------

### Prerequisites

* .NET 4.5
* Git (for easy updates)
* Latest Nginx (manually add it to the PATH)

### Setting up

Copy `^/nginx-data/nginx.conf.sample` (where `^` is wherever the tech radar code is)
to `^/nginx-data/nginx.conf` and edit it. Enabled HTTPS if applicable by uncommenting
some lines here and there

From a command line, run the following commands:

    git pull
    build.cmd
    
    cd ^\build
    nginx-service.exe install
    nginx-service.exe start
    
    cd ^\src\server\bin\Release
    backend-service.exe install
    backend-service.exe start

### Admin

If you want, you can use PHP and Adminer to allow remote db administration.
`nginx.conf.sample` contains a sample configuration. You'll also need to run
`php-cgi.exe` as something that looks like a system service, which I'll leave
as and exercise to the reader.

Linux
-----

This is not currently possible because we depend on System.Data.Sqlite,
which is Windows-only. Must replace by Mono.Data.Sqlite and then disable
or modify the DB-backup-feature. Besides this, it should all work on
Mono fine.