# Telegram Product Bot

## Description

[Telegram bot](https://core.telegram.org/bots/api) that searches for products and provides notifications when those go on sale. Meant as a basic project to get to know nestjs, typescript and docker usage. Project runs on port 7754.

## Prerequisites

* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [nestjs](https://docs.nestjs.com/#installation) installed.
* Register a bot in telegram through [The Botfather](https://t.me/botfather).
* [Rainforest](https://app.rainforestapi.com/) API key, for the scope of this project the free 100 requests are enough.
* [ngrok](https://ngrok.com/download) for port fowarding in development mode (any alternative works as well) or having a domain registered.
* Fill in all the values in a file named `.env` according to the example provided in [.env.example](.env.example)
* (Optional) Register an app in Mercado Libre [devcenter](https://developers.mercadolibre.com.mx/devcenter) to obtain API credentials.

## Running the app

```bash
#install all dependencies
$ npm install

# development - this will initate a docker container
# apply database migrations and run in watch mode.
$ npm run start:dev
```

Once the project is running to operate in development mode some setup is necesary.

* Set telegram data in the container database. This can be perfomed easily by sending the following request to the server

```json
POST /telegram
{
  "username": "username_for_your_bot",
  "token": "bot token",
  "bot_id": "bot id"
}
```

* Set bot to provide updates via webhooks to the endpoint `/telegram/apiUpdates/:bot_name`. See [setWebhook](https://core.telegram.org/bots/api#setwebhook) in the telegram API docs.

* If the MercadoLibre API is being used it is necesary to manually fill in the entry as an object in the MercadoLibre table.

## Known issues

* Bot will always show the first result regardless of how accurate to user provided search it is.
* MercadoLibre API does not refresh OAuthToken automatically.
* MercadoLibre API requires a production callback url, in development mode no results are provided unless a new app is created in the MercadoLibre dev dashboard for each created port fowarding url.
* Amazon products that are not available show as having "N/A" on price.
* Unit tests are still in development.
* `docker-comse.yml` file is hardcoded.
* There is no security protecting the endpoints and tokens are saved as plaintext within the database.

## Contact

* Author: [Sela Farrera](https://twitter.com/hylandude) - selafaor@gmail.com

## License

This project is [MIT licensed](LICENSE).
