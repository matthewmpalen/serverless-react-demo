# serverless-react-demo

## Setup

After having installed [Nodejs](https://nodejs.org/en/)
and [npm](https://www.npmjs.com/):

```bash
npm install
```

Create AWS access and secret keys with the permissions required
by Serverless. Set their values as `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY` in the Github repo Secrets settings.

## CI/CD

Continuous integration and deployment is implemented using
[Github Actions](https://github.com/features/actions). Pushes
on the `master` branch will trigger the pipeline.
