const {MongoClient} = require('mongodb');
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));


app.listen(3000, ()=>{
    console.log("Server has started at port 3000");
});

app.post("/quest1", (request,response)=>{
    console.log(request.body);
    main(response,request.body.mongostring,request.body.param,request.body.query).catch(console.error);
});

app.post("/quest2", (request,response)=>{
    app.use(bodyParser.json());
    console.log(request.body);
});

async function main(response,string,param,query){

    const client = new MongoClient(string);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        // await  listDatabases(client);

        var returnobj = await givelocations(client,param,query);
        response.setHeader('Name', 'Aditya');
        response.setHeader('Contact', 'adityadatar2001@gmail.com');
        response.send(returnobj);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


async function givelocations(client,param,query) {
    const devices = await client.db("__CONCOX__").collection(param).find().sort({_id:-1}).limit(30).toArray();
    var obj = [];
    for(var i=0;i<devices.length;i++)
    {
        const results = await client.db("__CONCOX__").collection(query).find(
            {
                imei: `${devices[i].imei}`
            }
        ).sort({_id:-1}).limit(50).toArray();

        if (results.length > 0) 
        {
            for (let j = 0; j < results.length; j++) {
                console.log(results[j].gps);
                obj.push(
                    {
                        deviceId:devices[i].id,
                        gps:results[j].gps
                    }
                )
            }
        }
    }
    var returnobj = JSON.parse(JSON.stringify(obj));
    return returnobj;
}


