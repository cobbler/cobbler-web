# Cobbler-Web

[![Gitter](https://badges.gitter.im/cobbler/community.svg)](https://gitter.im/cobbler/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![codecov](https://codecov.io/gh/cobbler/cobbler-web/branch/main/graph/badge.svg?token=0JOT3M0AJ9)](https://codecov.io/gh/cobbler/cobbler-web)

Our new separate Angular based web interface for Cobbler!

Initial developer: [@nelliesnoodles](https://github.com/nelliesnoodles) & [@SchoolGuy](https://github.com/SchoolGuy)
@ <https://github.com/nelliesnoodles/Angular-CBBLR>

## Prerequisites

- Node.js and npm
- install Node.js dependencies with `npm install`
- build required projects

```shell
npm run build typescript-xmlrpc
npm run build cobbler-api
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

**Note**: Since this is a multi-project repo you need to add the project name. The only project which is a frontend is
currently `cobbler-frontend` though. Serving will only work if you have built our two libraries as described above.

## Code scaffolding

Run `ng generate component component-name --project projectName` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod`
flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI Overview and Command Reference](https://angular.io/cli) page.
