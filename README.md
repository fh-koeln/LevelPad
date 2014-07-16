# LevelPad [![Build status][travis-image]][travis-url] [![Dependency Status][dependency-image]][dependency-url] [![Test coverage][coveralls-image]][coveralls-url]

[travis-image]: https://img.shields.io/travis/fh-koeln/LevelPad.svg
[travis-url]: https://travis-ci.org/fh-koeln/LevelPad
[dependency-image]: https://david-dm.org/fh-koeln/LevelPad.png
[dependency-url]: https://david-dm.org/fh-koeln/LevelPad
[coveralls-image]: https://img.shields.io/coveralls/fh-koeln/LevelPad.svg
[coveralls-url]: https://coveralls.io/r/fh-koeln/LevelPad

Webapp zur Unterstützung einer Bewertung nach dem Niveaustufenmodell

**Status**: In Entwicklung.

## Niveaustufenmodell

## Technik

Dieses Projekt ist umgesetzt als Node.JS / AngularJS webapp. Verwendete Software:

* [Node.js](http://nodejs.org/)
* [express](http://expressjs.com/)
* [Bootstrap](http://getbootstrap.com/)
* [AngularJS](http://www.angularjs.org/)
* [socket.io](http://socket.io/)
* [Passport](http://passportjs.org/)

## Heroku installation

Heroku version runs in production mode:

	heroku config:set NODE_ENV=production

## Commandline hints

*Run server:*

	npm run-script run

(will update this to use grunt or gulpjs soon...)

*Run server and auto restart on code change:*

	npm run-script run-auto

*Push new version to heroku:*

	git push heroku master && heroku logs -t
