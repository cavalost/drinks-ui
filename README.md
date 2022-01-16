# drinks_ui

## Factsheet

| **Category**              | **Value**                                 |
| ------------------------- | ---------------------------------------- |
| **Contact**               | @cavalost
| **Language / Framework**  | Node, Vue2
| **Deployment type**       | CircleCI + AWS(S3 + CloudFront)
| **Production URL**     | [https://d2tpv6i2lq638o.cloudfront.net/index.html](https://d2tpv6i2lq638o.cloudfront.net/index.html)|
## Configuration

Configuration is via the following environment variables:

| Env var      | Example      | Purpose                   |
| ------------ | ------------ | ------------------------- |
| `VUE_APP_DRINKS_API` | `https://drinks-api-clau.herokuapp.com` | 
| `VUE_APP_GMAPS_TOKEN` | `-` | 


## Requirements
Node >= 8

## How to run locally
```
npm run start
```

## How to deploy
Each commit in master will trigger CircleCI

### Project description

Table with events that we recorded in the cron job and fetch them through our API.
Users can sort and filter events based on a date range, or by address or event name.

IF the user clicks in any row, a modal will be displayed with the map location, guests and comments.
