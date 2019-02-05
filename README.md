# generator-jhipster-database-backup
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, This module allows you to generate .yml files allowing you to make regular backups of your production database.

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

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

Then enter the required parameter (backup frequency), don't forget the whitespace if you are using CRON (https://en.wikipedia.org/wiki/Cron).

Now a 'backup-<database-name>.yml' file has been created in the following folder : src/main/docker

This service will periodically backup your database.

Then start your database
Your database should be initialized and started in a docker image using the '<database>.yml' file located in 'src/main/docker'.
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

To find more details about the docker image and the parameters click here https://hub.docker.com/r/deitch/mysql-backup.

## POSTGRESQL

To find more details about the docker image and the parameters click here https://hub.docker.com/r/contributionjhipster/docker-pg_dump

## MONGODB

Your database must not be empty !
To find more details about the docker image and the parameters click here https://github.com/tutumcloud/mongodb-backup/tree/master


## MARIADB

To find more details about the docker image and the parameters click here https://hub.docker.com/r/deitch/mysql-backup.


# License

MIT © [Contribution JHipster UGA](https://github.com/contribution-jhipster-uga/)


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-database-backup.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-database-backup
[travis-image]: https://travis-ci.org/contribution-jhipster-uga/generator-jhipster-database-backup.svg?branch=master
[travis-url]: https://travis-ci.org/contribution-jhipster-uga/generator-jhipster-database-backup
[daviddm-image]: https://david-dm.org/contribution-jhipster-uga/generator-jhipster-database-backup.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/contribution-jhipster-uga/generator-jhipster-database-backup
