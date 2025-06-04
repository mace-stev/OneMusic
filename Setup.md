## Backend

The backend is using a few tools that will help with development and production. One of the set backs of using Typescript is that we have to compile (`tsc`) to build it into Javascript and use that. For this project, we are utilizing `rimraf` which will auto-delete the old `js` files and replace them with the new files every time our backend detects a change. We also have a lot of scripts to choose from in the package.json file to make it easier to work with.


1. Run: `npm install`

If you are using `Postgres` in development:

2. Run: `npm run db:reset`

This will drop your database, remake it, and seed.
*Note* you must have `postbird` closed, if using it, to run. We can not delete a database if another user is accessing it

If are using `Sqlite` in development:

2. Run: `npm run sqlite-reset`.

This will delete your existing `dev.db` file, and will migrate and seed a new sqlite database

3. Run: `npm start`



## Frontend

1. Run: `npm install`

2. Run: `npm run dev` in development

You can manually build using `npm run build`, but docker should handle this in deployment


## Deployment

1. Build an image of your docker file (use the docker extension trick).
- Make sure to name it `<dockerhub username>/projectname:latest`

2. Push your new image to docker hub. You can use `docker push <dockerhub username>/projectname:latest` or you can click the 3 dots next to the image on `docker desktop` and press the `push` button

3. On render, deploy a new project utilizing `docker image`. Enter the name of your project image like so: `docker.io/<dockerhub username>/projectname:latest`

4. Fill out the following: `DATABASE_URL` AND `SCHEMA` .

5. Deploy
