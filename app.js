var PubNub = require('pubnub')
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const uuidv4 = require('uuid/v4');
console.log("uuid------->",uuidv4());
/*-----------------------------------------------------------
pubnub constructor with keyset 
-----------------------------------------------*/
var pubnub = new PubNub({
    subscribeKey: "sub-c-5103f638-3cab-11e8-a2e8-d2288b7dcaaf",
    publishKey: "pub-c-33f39334-f8c8-46e6-aec8-2417e5a3b453",
    ssl: true,
    secretKey:"sec-c-OThkYTBmODgtY2ZlYi00MzFiLWExMjUtYzI3ZWRiYjIwMTIz"
    //uuid:uuidv4()
});

/* ---------------------------------------------------------------------------
Publish Messages
--------------------------------------------------------------------------- */
var message = { "Hello" : "World!" };
console.log("publishing---------",message);
    function publishSampleMessage() {
                console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
                setInterval(function(){
                     var publishConfig = {
                    channel : "my_channel_2",
                    message : {
                        title: new Date().getTime(),
                        description: Math.floor(Math.random() * 99)
                    }
                }
                pubnub.publish(publishConfig, function(status, response) {
                    console.log('publish the response');
                    console.log(status.statusCode);
                });
            }, 10000);
            }


/* ---------------------------------------------------------------------------
subscribe to the channel to get messages piublished on that channel
--------------------------------------------------------------------------- */
function subscr(callback){
    pubnub.subscribe({
        channels: ['my_channel_2'],
         message: function(m) {console.log(m + '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$subscribe the response')},
         connect: function(){console.log("connected!!!!")},
         presence: function(p){console.log("presence------->"+p)}
     });
    pubnub.addListener({
        message: function(m) {
            // handle message
            var channelName = m.channel; // The channel for which the message belongs
            var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
            var pubTT = m.timetoken; // Publish timetoken
            var msg = m.message; // The Payload
            var publisher = m.publisher; //The Publisher
            //console.log("message from sub&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",m);
            callback(m.message);
        },
        presence: function(p) {
            // handle presence
            var action = p.action; // Can be join, leave, state-change or timeout
            var channelName = p.channel; // The channel for which the message belongs
            var occupancy = p.occupancy; // No. of users connected with the channel
            var state = p.state; // User State
            var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
            var publishTime = p.timestamp; // Publish timetoken
            var timetoken = p.timetoken;  // Current timetoken
            var uuid = p.uuid; // UUIDs of users who are connected with the channel
        },
        status: function(s) {
            var affectedChannelGroups = s.affectedChannelGroups;
            var affectedChannels = s.affectedChannels;
            var category = s.category;
            var operation = s.operation;
        }
    });
}
/* ---------------------------------------------------------------------------
Publish Messages when this end point is hit
--------------------------------------------------------------------------- */

    app.get('/publish',function(req,res){
        console.log("in req");
        publishSampleMessage();
        res.end("ok");
    });

    /* ---------------------------------------------------------------------------
create an express server and listen to port 8878
--------------------------------------------------------------------------- */

app.listen(8878,()=>{
    console.log("server is running on 8878");
});