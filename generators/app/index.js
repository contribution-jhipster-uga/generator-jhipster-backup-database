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
        const prompts = [
            {
                type: 'input',
                name: 'message',
                message: 'How often do you want to back up your database? (Please use the CRON format)',
                default: '0 0 * * *'
            }
        ];
        const promptsql = [
            {
                type: 'input',
                name: 'message',
                message: 'How often do you want to back up your database? (in minutes, starting from now)',
                default: '60'
            }
        ];
        var database = ''
        var fs = require('fs');
        var content = fs.readFileSync('.yo-rc.json');
        var contentArray = JSON.parse(content);
        database = contentArray['generator-jhipster'].prodDatabaseType;
        this.log(database);

        if(database=='mysql'){
          const done = this.async();
          this.prompt(promptsql).then((props) => {
              this.props = props;
              // To access props later use this.props.someOption;

              done();
          });
        }else{
          const done = this.async();
          this.prompt(prompts).then((props) => {
              this.props = props;
              // To access props later use this.props.someOption;

              done();
          });
        }

    }

    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        var database = ''
      	var fs = require('fs');
        var content = fs.readFileSync('.yo-rc.json');
        var contentArray = JSON.parse(content);
        database = contentArray['generator-jhipster'].prodDatabaseType;
        this.log(database);

        // variable from questions
        this.message = this.props.message;



        // show all variables
        // this.log('\n--- some config read from config ---');
        // this.log(`baseName=${this.baseName}`);
        // this.log(`packageName=${this.packageName}`);
        // this.log(`clientFramework=${this.clientFramework}`);
        // this.log(`clientPackageManager=${this.clientPackageManager}`);
        // this.log(`buildTool=${this.buildTool}`);
        //
        // this.log('\n--- some function ---');
        // this.log(`angularAppName=${this.angularAppName}`);
        //
        // this.log('\n--- some const ---');
        // this.log(`javaDir=${javaDir}`);
        // this.log(`resourceDir=${resourceDir}`);
        // this.log(`webappDir=${webappDir}`);
        //
        // this.log('\n--- variables from questions ---');
        // this.log(`\nmessage=${this.message}`);
        // this.log(`\nAppConfig=${this.angularAppName}`);
        //
        // this.log('------\n');






	switch(database){
	  case 'mysql': this.log(database);
          var appName = this.baseName.toLowerCase() + '-mysql';
     			this.template('backup-mysql.yml',`src/main/docker/backup-mysql.yml`);
          jhipsterUtils.rewriteFile({
            file: 'src/main/docker/backup-mysql.yml',
            needle: 'environment:',
            splicable: [`container_name: ${appName}`]
          }, this);

          jhipsterUtils.rewriteFile({
            file: 'src/main/docker/backup-mysql.yml',
            needle: '- DB_DUMP_BEGIN=+0',
            splicable: [`- DB_SERVER=${appName}`]
          }, this);

          jhipsterUtils.rewriteFile({
            file: 'src/main/docker/backup-mysql.yml',
            needle: '- DB_DUMP_BEGIN=+0',
            splicable: [`- DB_DUMP_FREQ=${this.message}`]
          }, this);

			break;
	  case 'postgresql': this.log(database);
          var appName = this.baseName.toLowerCase() + '-postgresql';
          var appNameUpper = this.baseName;

     			this.template('backup-postgresql.yml',`src/main/docker/backup-postgresql.yml`);

          jhipsterUtils.rewriteFile({
            file: 'src/main/docker/backup-postgresql.yml',
            needle: '- PGPORT=5432',
            splicable: [`- PGHOST=${appName}`]
          }, this);

          jhipsterUtils.rewriteFile({
            file: 'src/main/docker/backup-postgresql.yml',
            needle: '- PGPORT=5432',
            splicable: [`- PUSER=${appNameUpper}`]
          }, this);

          jhipsterUtils.rewriteFile({
            file: 'src/main/docker/backup-postgresql.yml',
            needle: '- PGPORT=5432',
            splicable: [`- CRON_SCHEDULE=${this.message}`]
          }, this);
			break;
    case 'mongodb': this.log(database);
       		this.template('fifi.yml',`src/main/docker/fifi.yml`);
  		break;
	  default: this.log('Your database is not supported yet :( !');
	}

        if (this.clientFramework === 'angular1') {
            // this.template('dummy.txt', 'dummy-angular1.txt');
        }
        if (this.clientFramework === 'angularX' || this.clientFramework === 'angular2') {
            // this.template('dummy.txt', 'dummy-angularX.txt');
        }
        if (this.buildTool === 'maven') {
            // this.template('dummy.txt', 'dummy-maven.txt');
        }
        if (this.buildTool === 'gradle') {
            // this.template('dummy.txt', 'dummy-gradle.txt');
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
