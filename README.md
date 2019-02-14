# generator-jhipster-database-backup
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> [JHipster module] The purpose of this module is to perform periodic backups of your database. This backup docker image currently supports MYSQL, POSTGRESQL, MONGODB and MARIADB.

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application. The purpose of this module is to perform periodic backups of your database. This backup docker image currently supports MYSQL, POSTGRESQL, MONGODB and MARIADB.
The results will be .sql or .targz saves in a backup directory.

You can find a sample application [here](https://github.com/contribution-jhipster-uga/sample-application-database) that already have the yml file for a mySQL database if you to try it out.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)
- [Installing Docker](https://docs.docker.com/install/)
- [Installing Docker-compose](https://docs.docker.com/compose/install/)

# Installation

## With Yarn

To install this module:

```bash
yarn global add generator-jhipster-database-backup
```

To update this module:

```bash
yarn global upgrade generator-jhipster-database-backup
```

## With NPM

To install this module:

```bash
npm install -g generator-jhipster-database-backup
```

To update this module:

```bash
npm update -g generator-jhipster-database-backup
```

# Usage

First, you have to run the generator using the following command :

```bash
yo jhipster-database-backup
```

Then enter the required parameter (backup frequency), don't forget the whitespace if you are using [CRON](https://en.wikipedia.org/wiki/Cron).

Now a 'backup-_database-name_.yml' file has been created in the following folder : src/main/docker

This service will periodically backup your database.

Then start your database
Your database should be initialized and started in a docker image using the '_database-name_.yml' file located in 'src/main/docker'.
```bash
sudo docker-compose -f <database-name>.yml up
```
If the database failed to start, you should check if the port is free (for example 'sudo service mysql stop' to stop the default mysql service).

Finally, start the backup service :

```bash
sudo docker-compose -f backup-<database-name>.yml up
```

You will find your backups in the backup folder located in : src/main/docker

## MYSQL

To find more details about the docker image and the parameters click [here](https://hub.docker.com/r/deitch/mysql-backup).

## POSTGRESQL

To find more details about the docker image and the parameters click [here](https://hub.docker.com/r/contributionjhipster/docker-pg_dump).

## MONGODB

Your database must not be empty !
To find more details about the docker image and the parameters click [here](https://github.com/tutumcloud/mongodb-backup/tree/master).


## MARIADB

To find more details about the docker image and the parameters click [here]( https://hub.docker.com/r/deitch/mysql-backup).


# License

MIT © [Contribution JHipster UGA](https://github.com/contribution-jhipster-uga/)
Julien COURTIAL, Hugo GROS-DAILLON, Cédric LAFRASSE et Bastien TERRIER
Our contribution uses the open source work of Avi Deitcher and tutumcloud.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-database-backup.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-database-backup
[travis-image]: https://travis-ci.org/contribution-jhipster-uga/generator-jhipster-database-backup.svg?branch=master
[travis-url]: https://travis-ci.org/contribution-jhipster-uga/generator-jhipster-database-backup
[daviddm-image]: https://david-dm.org/contribution-jhipster-uga/generator-jhipster-database-backup.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/contribution-jhipster-uga/generator-jhipster-database-backup
