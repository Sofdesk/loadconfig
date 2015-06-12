# loadconfig
> It loads the right configuration.

# Installation
```
npm install --save loadconfig
```

# Explaination
The goal of this module is to have a configuration that can be loaded from the environment, but also from local settings.

So, if the environment is set to `test`, the file are loaded (and overrided) in this order:
1. global.js (this is usually where you will have all your defaults)
2. local.js (this file is not in Git, it overrides configs only for _you_)
3. test.js (base on the environment, it may override the local)
4. test.local.js (this file, not in Git, allow you to have local configs when in test)

This allow us to have a global config for all the default, a test config that loads the default mocks and that is loaded in CodeShip, and a test.local.js that is used mainly for database and email settings.

Not everybody uses the same database name or credentials in a team, the same email address neither. The `local.js` allow us to have these configs there.

# Ignore the local files!
```
# in .gitignore
**/config/*local*.js
```

# Usage
```
var loadconfig = require('loadconfig');
// loads the config based on `process.env.NODE_ENV`
var config = loadconfig(__dirname + '/config');
// loads the dev config
var config = loadconfig(__dirname + '/config', false, 'dev');
// the 2nd argument is to show debug messages
```


# TODO
- cache is useless, since `require` caches everything for us already.
