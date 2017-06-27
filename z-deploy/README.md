# How to Deploy your Shiny new Node App

Got something working?  Want to show someone?

Let's put it out in the world.

## Deploy Mongo at mLab

Hosted mongodb (free tier = &lt; .5G)
https://mlab.com

1. Sign up
2. Verify email (required)
3. Create new mongodb deployment
4. Select "Amazon", "Single-node", "Sandbox = Free"
5. Type in a "Database Name" like `fsjs_demo` or your project's name
6. Create button (submit form)

![ss](https://i.imgur.com/N4NpbON.png)

Once created, click on your new db.

Click on `Users` and `Add database user`

Give it a strong user/pass.  _(pro tip, don't include `@` or `:` or `*`)_

Eg: `fsjsdb` / `35cqfvmbxpXMw$5mM$$WsJav3JH&` _(not actual value)_

Copy the connection string from the top of this page:

> To connect using a driver via the standard MongoDB URI (what's this?):
> `mongodb://<dbuser>:<dbpassword>@ds139242.mlab.com:39242/fsjs_demo`

Take a note and assemble the connection string in your notes like this (you will use it later):

`mongodb://fsjsdb:35cqfvmbxpXMw$5mM$$WsJav3JH&@ds139242.mlab.com:39242/fsjs_demo`

Here's a breakdown:

> `mongodb://` the protocol
> `fsjsdb` the username who the app can use to access the database
> `:` splits user and pass
> `35cqfvmbxpXMw$5mM$$WsJav3JH&` the user's password
> `@` splits the auth from domain
> `ds139242.mlab.com` the domain name of the database, from mlab
> `:` splits the domain and port
> `39242` the port of the database from mlab
> `/` splits the host from the "path" or in this case the "dbname"
> `fsjs_demo` the name of our database

## Deploy Node at now

Super, Crazy, Wildly simple node deployments
https://zeit.co/now#get-started

1. [install](https://zeit.co/download) their desktop `now` app (convenient, optional, also get their [cli](https://zeit.co/download#command-line))
2. open the app, walk through the tutorial, install the command line tool, enter your email
3. verify the email, you should get a "hooray"
4. click the `get started` button to show you the UI in the GUI
5. select deploy, browse to your project folder (the one with the `package.json` file in it)

![ss](https://i.imgur.com/middH4S.png)
![ss](https://i.imgur.com/k8vWtGn.png)
![ss](https://i.imgur.com/NcgnrME.png)

Now... it deploys...

### Did you get a build error?

I did, because `package.json` has `scripts` which has `"start": "nodemon index.js"`

`nodemon` is a NPM tool we installed onto our machines to make development easier, "fancy start".

So I changed the `package.json` scripts section to the following, so start is basic, and dev is fancy.

```
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
```

Now you can use nodemon locally with `npm run dev`

Re-deploy:

Now you can delete the deployment in now:

> Now -> Deployments -> <name> -> delete -> confirm

![ss](https://i.imgur.com/jHJaARx.png)

Now deploy again.

### Did you get a build error?

I did, because the node app can't connect to the mongo database...

That makes sense, we never told our app where the new database is...

Edit `src/config/index.js`

> replace the host, and name database config with the full connection url

```
module.exports = {
  appName: 'Our Glorious Node Project',
  // TODO make this environment aware and switch automatically
  // port: 3030,
  // mongo_url: 'mongodb://localhost/fsjs',
  port: 80,
  mongo_url: 'mongodb://fsjsdb:35cqfvmbxpXMw$5mM$$WsJav3JH&@ds139242.mlab.com:39242/fsjs_demo',
};
```

Edit `src/server.js`

> replace the connection string line to the complete one from the config

```
// Connect to MongoDB and create/use database as configured
mongoose.connect(config.mongo_url);
```

Re-deploy:

Now you can delete the deployment in now:

> Now -> Deployments -> <name> -> delete -> confirm

![ss](https://i.imgur.com/jHJaARx.png)

Now deploy again.


### Did you get it to work?

I did.

![ss](https://puu.sh/wvOwK/fc1132e182.png)

Bonus points, add `/_src` to the end of the domain name... and you can see your source code

![ss](https://i.imgur.com/0NWxAAw.png)
