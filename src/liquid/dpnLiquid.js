module.exports = function(RED) {
    const fetch = require('node-fetch');

    async function liquid(token) {
        const apiHost = process.env.DEVICE_IP || '34.34.34.34';
        const liquidEndpoint = `https://${apiHost}/api/liquid`
    
        return await fetch(liquidEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
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

    function DpnLiquidNode(config) {
        RED.nodes.createNode(this,config)
        var node = this
        var token = config.token
        node.on('input', async function(msg) {
            if (msg.payload.token) {
                token = msg.payload.token
            }
            if (token) {
                msg.payload = {} // clear payload
                await liquid(token)
                    .then(liquidData => {
                        //console.log('Liquid Data:', liquidData)
                        msg.payload.liquid = liquidData
                        node.send(msg)
                    })
                    .catch(error => {
                        console.error(error)
                        msg.payload = error
                        node.send(msg)
                    })
            } else {
                msg.payload = "Token not set"
                node.send(msg)
            }
        })
    }

    RED.nodes.registerType("dpnLiquid",DpnLiquidNode, {
        settings: {
            dpnLiquid: {
                value: "dpnLiquid",
                exportable: true
            }           
        }
    })
}