# LevelPad [![Dependency Status](https://david-dm.org/fh-koeln/LevelPad.png)](https://david-dm.org/fh-koeln/LevelPad)

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

*Push new version to heroku:*

	git push heroku master && heroku logs -t
