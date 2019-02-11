const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const jhipsterUtils = require('generator-jhipster/generators/utils');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    // do something when argument is 'default'
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster database-backup')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
                }
            }
        };
    }

    prompting() {
        const prompts = [{
            type: 'input',
            name: 'message',
            message: 'How often do you want to back up your database? (Please use the CRON format)',
            default: '0 0 * * *'
        }];
        var database = this.jhipsterAppConfig.prodDatabaseType;

        const done = this.async();
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });


    }

    writing() {
        // function to use directly template
        this.template = function(source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        var database = this.jhipsterAppConfig.prodDatabaseType;

        // variable from questions
        this.message = this.props.message;


        switch (database) {
            case 'mysql':
                var appName = this.baseName.toLowerCase() + '-mysql';
                this.template('backup-mysql.yml', jhipsterConstants.DOCKER_DIR + `backup-mysql.yml`);
                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-mysql.yml',
                    needle: 'volumes:',
                    splicable: [` - DB_SERVER=${appName}`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-mysql.yml',
                    needle: 'volumes:',
                    splicable: [` - DB_DUMP_CRON=${this.message}`]
                }, this);

                break;
            case 'postgresql':
                var appName = this.baseName.toLowerCase() + '-postgresql';
                var appNameUpper = this.baseName;

                this.template('backup-postgresql.yml', jhipsterConstants.DOCKER_DIR + `backup-postgresql.yml`);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-postgresql.yml',
                    needle: '- PGPORT=5432',
                    splicable: [`- PGHOST=${appName}`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-postgresql.yml',
                    needle: '- PGPORT=5432',
                    splicable: [`- PUSER=${appNameUpper}`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-postgresql.yml',
                    needle: '- PGPORT=5432',
                    splicable: [`- CRON_SCHEDULE=${this.message}`]
                }, this);
                break;
            case 'mongodb':
                this.template('backup-mongodb.yml', jhipsterConstants.DOCKER_DIR + `backup-mongodb.yml`);
                var appName = this.baseName.toLowerCase() + '-mongodb';

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-mongodb.yml',
                    needle: '- INIT_BACKUP=yes',
                    splicable: [`- CRON_TIME=${this.message}`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-mongodb.yml',
                    needle: '- MONGODB_PORT=27017',
                    splicable: [`- MONGODB_HOST=${appName}`]
                }, this);
                break;
            case 'mariadb':
                var appName = this.baseName.toLowerCase() + '-mariadb';
                this.template('backup-mysql.yml', jhipsterConstants.DOCKER_DIR + `backup-mariadb.yml`);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-mariadb.yml',
                    needle: 'volumes:',
                    splicable: [` - DB_SERVER=${appName}`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: jhipsterConstants.DOCKER_DIR + 'backup-mariadb.yml',
                    needle: 'volumes:',
                    splicable: [` - DB_DUMP_CRON=${this.message}`]
                }, this);

                break;
            default:
                this.warnig(`\n Your database is not supported yet ! :(`);

        }

    }

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    }

    end() {
        this.log('End of database-backup generator');
    }
};
