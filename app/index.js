'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const whoami = require('who-ami');
const dateformat = require('dateformat');
const mkdirp = require('mkdirp');
const _ = require('lodash');

const path = require('path');

module.exports = class extends Generator{
    constructor(args, opts) {
        super(args, opts);
        // generators.Base.apply(this, arguments);
        this.option('apply');
    }

    prompting() {
        return this.prompt([{
            name: 'appname',
            message: 'Entry your sub app name:'
        }, {
            name: 'author',
            message: 'author name:',
            default: whoami.name
        }]).then((answer) => {
            this.log('app name', answer.appname);
            this.log('app name', answer.author);
            this.name = answer.appname;
        })
    }

    writing() {
        if (!this.name) {
            this.log(chalk.bold.red('\nReally sorry! You should give a sub app name!'));
            return;
        }
        this.destinationRoot(this.name);

        // //build destination
        // this.template('index.js');
        // this.template('router.js');

        mkdirp.sync(path.join(this.destinationPath(), 'components'));
        mkdirp.sync(path.join(this.destinationPath(), 'components/common'));
        mkdirp.sync(path.join(this.destinationPath(), 'components/'+this.name));

        mkdirp.sync(path.join(this.destinationPath(), 'constants'));

        mkdirp.sync(path.join(this.destinationPath(), 'containers'));

        mkdirp.sync(path.join(this.destinationPath(), 'images'));

        mkdirp.sync(path.join(this.destinationPath(), 'reducers'));
        mkdirp.sync(path.join(this.destinationPath(), 'reducers/app'));
        mkdirp.sync(path.join(this.destinationPath(), 'reducers/'+this.name));


        mkdirp.sync(path.join(this.destinationPath(), 'services'));
        mkdirp.sync(path.join(this.destinationPath(), 'store'));

        const sourceDir = path.join(this.templatePath(), './app');
        const filePaths = this.fs.read(sourceDir);
        _.each(filePaths, (filePath) => {
            this.fs.copy(
                this.templatePath('./app/' + filePath),
                this.destinationPath('./js/mine/reducers/app/' + filePath)
            );
        });

    }

    date() {
        this.date = dateformat(new Date(), 'UTC:yyyy/mm/dd');
    }

    end() {
        if (!this.name) {
            return;
        }
        this.log(yosay(chalk.green('Congratulations！You Just create a sub app successfully')));
    }
};