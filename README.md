# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Configuration

- Do NOT commit API keys or tokens. This project now reads third-party keys and backend base URL from `src/environments/environment.ts`.
- Set `GOOGLE_MAPS_KEY`, `GOOGLE_API_KEY`, and `IPINFO_TOKEN` in `src/environments/environment.ts` for local development, or provide them through your CI/CD environment for production builds (use `src/environments/environment.prod.ts`).

Note: After updating keys, rebuild the frontend with `ng build` or run `ng serve` for development.
