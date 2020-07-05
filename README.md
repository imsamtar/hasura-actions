# Hasura Actions

hasura actions for simplified (single endpoint)

## Installation

```
npm i --save hasura-actions
```

## Usage

```javascript
const express = require("express");
const hasuraActions = require("hasura-actions");
const config = require("./config");

const app = express();

app.use("/hasura/actions", hasuraActions(config))

app.listen(3000, function(err){
    if(err) console.log(err.message);
    else console.log("Listening on localhost:3000");
})
```

## config.js
```javascript
module.exports = {
    "action_name": {
        "action_name": function(body, headers){
            async function(body, headers){
                // Custom Buisness Logic
                return {
                    fullname: `${body.input.fname} ${body.input.lname}`
                }
            }
        }
    }
}
```