ReactJS: Presentation Tool

### Background & Motivation

Build a front-end for the supplied backend. The front end should operate in a similar manner to that of (slido.com).

## The Front-end (Work to do)

Front-end is to be created using ReactJS.

The requirement is to display as a series of screens.

### 1. Login & presentation Creation
Allow for login, logout, registration and presentation creation. 

### 2. Setting up slides
Allow for the following features:
* Create a new presentation
* list presentations on the dashboard
* reroute to new presentation
* Title and thumbnail editing
* creating and moving between slides
* delete slides
* slide numbering

### 3. Putting Elements on a slide
Allow the user to put the following onto the slides:
- text
- image
- video
- code

#### 3.1 Make these same elements movable

### 3.2. The Backend (provided)

The backend is a simple backend that is provided.
Run `npm install` in the `backend` directory once.
Run `npm start` in the `backend` directory to start the backend.
The backend will ensure persistence in storing data and will remain after the express server stops running. To reset backend data:

Navigate to the base URL of the backend (e.g. `http://localhost:5005`) to view the API interface, listing all HTTP routes that can be interacted with.

Your backend is persistent in terms of data storage. That means the data will remain even after your express server process stops running. To reset the backend data to the original starting state, run `npm run reset` in the backend directory. To make a backend data copy (e.g. for a backup), copy `database.json`. To make an empty database, run `npm run clear` in the backend directory.

The backend directory and the files within it should not be modified.
