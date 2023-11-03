# Discussion Box Suite

## comment-box-api - Version 1.0.0

### Description
Backend API for Discussion Box, providing essential backend services and API endpoints necessary for discussion functionalities.

### Main Entry
index.js

### Scripts
- `start`: Launches the application using Node.js.
- `test`: Echoes an error message indicating that no tests are specified.

### Dependencies
- `axios`: For making HTTP requests.
- `bcrypt`: For hashing and checking passwords.
- `cors`: For enabling Cross-Origin Resource Sharing.
- `multer`: For handling multipart form data.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: For creating and verifying JSON Web Tokens.
- `read-excel-file`: For reading Excel files.
- `mongodb`: MongoDB driver for Node.js.
- `mongoose`: Elegant MongoDB object modeling for Node.js.
- `passport`: For authentication middleware.
- `passport-jwt`: A Passport strategy for authenticating with a JSON Web Token.
- `uuid`: For generating UUIDs.

## discussion-box - Version 2.0.10

### Description
Frontend service for MoniTalks platforms, providing a scalable comment-box feature as a service.

### Main Entry
dist/index.js

### Scripts
- `build`: Bundles the package.
- `start`: Starts the bundler in watch mode.
- `prepare`: Prepares the build before deployment.
- `test`: Runs linting, unit tests, and build tests.
- `predeploy`: Prepares the example project for deployment.

### Repository
- Type: git
- URL: StanlyMathai/discussion-box

### Dependencies
- `@szhsin/react-menu`: For context menus in React.
- `@types/uuid`: TypeScript definitions for UUID.
- `microbundle-crl-with-assets`: For bundling assets.
- `moment`: For parsing, validating, manipulating, and formatting dates.
- `react-responsive-modal`: For responsive modals in React.
- `sass`: For compiling SASS to CSS.

### Development Dependencies
- Testing libraries and TypeScript for development and testing.
- ESLint and Prettier for code linting and formatting.
- Various other tools to support the development workflow.

### Peer Dependencies
- `react`: The library required by peer projects.

## Common Information

### Author
Stanly Mathai

### License
MIT

## Installation and Setup
Clone both repositories using their respective git URLs. Run `npm install` in both directories to install dependencies. Use `npm start` to launch the backend and front-end services. Refer to each section's `scripts` for commands to build, test, and prepare for deployment.

Ensure to comply with the MIT license and usage guidelines provided for each dependency within the projects.
