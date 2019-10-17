# Install cypress

We're going to install cypress locally (ie: within this project) and create scripts to run cypress, as opposed to installing it globally and running it directly.
The main advantage of installing cypress locally is that other members of your team can then just run `npm install` once to have everything you have.

1. First install cypress

```
npm install cypress --save-dev
```

2. Add these scripts to `package.json`

Task name: `cypress:open`, task script: `cypress open`
Task name: `cypress:run`, task script: `cypress run`

`cypress:open` is what you typically use yourself
`cypress:run` is what you would use for continuous-integration or deployment.

3. Run the `cypress:open` task.

That means executing `npm run cypress:run` in terminal.
The first time you open cypress from inside a particular folder, cypress will create some configuration and a bunch of example tests.
You can leave these tests if you want, though they'll mostly all fail completely as they weren't made for this application (vue-file-browser).