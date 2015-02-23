# LevelPad [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Dependency Status][dependency-image]][dependency-url]

Webapp zur Unterstützung einer Bewertung nach dem Niveaustufenmodell

**Status**: Prototyp umgesetzt.

## Software components:

Implemented with the "MEAN-stack" (mongoDB, express, AngularJS, Node.js):

* Storage / Persistance / Cache:
  [mongoDB](http://www.mongodb.org/) with
  [mongoose](http://mongoosejs.com/)
* Backend stack:
  [Node.js](http://nodejs.org/),
  [express](http://expressjs.com/),
  [acl](https://github.com/optimalbits/node_acl),
  [Passport](http://passportjs.org/),
  [helmet](https://github.com/evilpacket/helmet)
* Backend tests:
  [mocha](https://github.com/visionmedia/mocha),
  [should](https://github.com/shouldjs/should.js),
  [supertest](https://github.com/visionmedia/supertest) and
  [istanbul](https://github.com/gotwarlost/istanbul)
* Frontend stack:
  [AngularJS](http://www.angularjs.org/),
  [Bootstrap](http://getbootstrap.com/)
* Frontend tests: TODO

## Commandline hints

*Run server, optional with auto-restart-option on code changes*  
`npm run-script run` or `npm run-script run-auto`

*Run tests*  
OSX/Linux: `npm test` / Windows: `npm run-script test-win`

*Run tests with coverage report*  
OSX/Linux: `npm run-script test-cov` / Windows: `npm run-script test-cov-win`

*Push new version to heroku:*  
`git push heroku master && heroku logs -t`

(Please remember that we already enabled production-mode on heroku with `heroku config:set NODE_ENV=production`.)

## Docker

With [Docker](https://www.docker.com/) you can setup and link the project to a `mongodb` database.
Or just use [Docker Compose](https://github.com/docker/fig), formerly known as
[fig](http://www.fig.sh/), to setup a local LevelPad tnstallation with just one command:  
`fig up` or `docker-compose up`

[travis-image]: https://img.shields.io/travis/fh-koeln/LevelPad/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/fh-koeln/LevelPad
[coveralls-image]: https://img.shields.io/coveralls/fh-koeln/LevelPad/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/fh-koeln/LevelPad
[dependency-image]: http://img.shields.io/david/fh-koeln/LevelPad.svg?style=flat-square
[dependency-url]: https://david-dm.org/fh-koeln/LevelPad
