# NEONAV • CLIENT • WEB
## Getting Started

First, install vendor dependencies and do a build of the application

```bash
npm install
npm run build
```

For local development, run the development server:

```bash
npm run dev
# or
npm run sdev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If *sdev*, [https://local.neonav.net:3000](https://local.neonav.net:3000) with your browser to see the result. This assumes you have a key and cert in the root folder and your local machine is configured properly.

### Configuration

Environment values that can be passed in via a `.env` file include `NODE_ENV`, `CERT_PATH`, `LOCAL_DOMAIN`, `LOCAL_PORT`

### Troubleshooting
- logins for this client can be done through https://auth.neonav.net
- it is suggested to map `local.neonav.net` to localhost on your development machine. The method to do this varies from each machine, but one method can be seen [here](https://ecompile.io/blog/localhost-custom-domain-name)
