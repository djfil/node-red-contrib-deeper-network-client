module.exports = function(RED) {
    const fetch = require('node-fetch');
    const crypto = require('crypto');

    const { DPN_PUBLIC_KEY } = process.env
    const publicKeyPem = DPN_PUBLIC_KEY.replace(/\\n/g, '\n')

    async function encryptPassword(password) {
        const publicKey = crypto.createPublicKey({
            key: publicKeyPem,
            format: 'pem',
            type: 'spki',
        });

        const passwordBytes = Buffer.from(password, 'utf-8');
        const encryptedBytes = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            },
            passwordBytes
        );

        const encryptedBase64 = encryptedBytes.toString('base64');
        return encryptedBase64;
    }

    async function deviceLogin(username, encryptedPassword) {
        const apiHost = process.env.DEVICE_IP || '34.34.34.34';
        const loginEndpoint = `https://${apiHost}/api/admin/login`
      
        const requestData = {
          username: username,
          password: encryptedPassword,
        }
      
        return await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }).then(async (response) => {
      
            if (response.ok) {
                const jsonResponse = await response.json()
                //console.log('Login response:', jsonResponse.token)
                return jsonResponse.token
            } else {
                console.error('Login failed:', response.statusText)
                return null
            }
        })
    }
    
    function DpnLoginNode(config) {
        RED.nodes.createNode(this,config)
        var node = this
        var username = config.username
        var password = config.password
        node.on('input', async function(msg) {
            if (msg.payload.username) {
                username = msg.payload.username
            }
            if (msg.payload.password) {
                password = msg.payload.password
            }
            if (username && password) {
                msg.payload = {} // clear payload
                var encryptedPassword = await encryptPassword(password)
                //msg.payload.encryptedPassword = encryptedPassword // debug
                await deviceLogin(config.username, encryptedPassword)
                    .then((token) => {
                        if (!token){
                            msg.payload = "Login Failed"
                        }
                        else {
                            msg.payload.token = token
                        }
                        node.send(msg)
                    })
            } else {
                msg.payload = "Username or Password not set"
                node.send(msg)
            }
        })
    }

    RED.nodes.registerType("dpnLogin",DpnLoginNode, {
        settings: {
            dpnLogin: {
                value: "dpnLogin",
                exportable: true
            }           
        }
    })
}