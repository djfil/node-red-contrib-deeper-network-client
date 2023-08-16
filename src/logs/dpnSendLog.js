module.exports = function(RED) {
    const fetch = require('node-fetch');

    async function sendLog(token, message) {
        const apiHost = process.env.DEVICE_IP || '34.34.34.34';
        const logEndpoint = `https://${apiHost}/api/admin/deeperLog`
    
        return await fetch(logEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                "level": "info",
                "message": message
            }),
        }).then(async (response) => {
            if (response.ok) {
                const jsonResponse = await response.json()
                //console.log('Liquid Data:', jsonResponse)
                return jsonResponse
            } else {
                console.error('Login failed:', response.statusText)
                return null
            }
        })
    }

    function DpnSendLogNode(config) {
        RED.nodes.createNode(this,config)
        var node = this
        var token = config.token
        var message = config.message
        node.on('input', async function(msg) {
            if (msg.payload.token) {
                token = msg.payload.token
            }
            if (token) {
                if (msg.payload.message) {
                    message = msg.payload.message
                }
                msg.payload = {} // clear payload
                await sendLog(token, message)
                
            } else {
                console.log("Token not set");
                //node.send(msg);
            }
        })
    }

    RED.nodes.registerType("dpnSendLog",DpnSendLogNode, {
        settings: {
            dpnSendLog: {
                value: "dpnSendLog",
                exportable: true
            }           
        }
    })
}