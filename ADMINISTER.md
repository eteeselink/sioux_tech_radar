Administering the Sioux Technology Radar
========================================

Each employee can give his/her own opinion about technology on this radar.
Additionally, people can add their own technologies.

The software has some places where uncareful usage by employees might screw
things up:

* The radar does not allow removing technologies (even in case of typos) or
  moving technologies from/to different categories. This is easy to do by 
  manually editing the database, hwoever.
* No history is kept for the wiki-like "description" field of each technology
  that anyone can edit. This means that hypothetically, someone could erase
  everything that someone else added.
  
Two features were added to mitigate the risk caused by these shortcomings.


DB administration with Adminer
------------------------------

Access https://[server]/admin/adminer.php for a web interface to editing
the database. This page is password protected. 

Once logged in, choose "Sqlite3", and enter "tech_radar.sqlite" for the
current, active, production database.


Backed up databases
-------------------

The server automatically creates a full-db backup every 15 minutes. These
are placed in the `db\backup\` folder, with names like `YYYYMMDD_HH_#.sqlite`
where `#` is an increasing number, starting with 0. So, the first backup made
on October 17th, 2013, after 15:00 will be called `20131017_15_0.sqlite`.

From Adminer, open `backup\20131017_15_0.sqlite` to edit this file.

This backup mechamism allows for a rudimentary "history" feature of all
fields. Even assuming a large database of, say, 1 MB, creating a backup every
15 minutes only uses a modest amount of disk space.
