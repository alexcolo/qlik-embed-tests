# qlik-embed-test
Qlik Embed library sample web application

# Getting started
1. Run `npm install`
3. Create cert and key for running local server in https: `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout certs\key.pem -out certs\cert.pem`
4. Create an OAuth client into your tenant
5. Set your Qlik tenant configuration in index.html and oauth_callback.html
6. Run `npm run serve`