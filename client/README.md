# barbers

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd barbers`
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying to Heroku

Запускать в корне каталога, не в client
`git subtree push --prefix client heroku master`

Если падает ошибка:
```
fatal: 'heroku' does not appear to be a git repository
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

эапустить сначала 
`heroku git:remote -a barber-service` затем `git subtree push --prefix client heroku master`

## SCSS Structure

### vendor.css
Весь код из файлов *.css папки vendor генерируется и минифицируется в vendor.css

### app.scss
Подключен плагин для работы с SASS `ember-cli-sass`, поэтому файл styles/app.scss автоматически генерируется в app.css.
В папке styles файлы структурируются по адаптированным правилам Доксы. В папке metronic хранятся все scss файлы, относящиеся к теме Метроника.

## Service API

[service4barbers](https://service4barbers-h2osis.rhcloud.com)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

* [heroku docs](https://devcenter.heroku.com/)