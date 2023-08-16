# Deeper Network Node-RED Custom Node

This Node-RED custom node allows seamless integration with Deeper Network devices, enabling interaction with their APIs. The node provides functionality to perform device login, retrieve data, and more. Docker is utilized for rapid testing and development.

## Installation

1. Install [Node-RED](https://nodered.org/docs/getting-started/installation) if not already installed.

2. Navigate to your Node-RED user directory, typically `~/.node-red`.

3. Run the following command to install the Deeper Network custom node:

   ```sh
   npm install node-red-contrib-deeper-network
    ```

## Usage
Drag and drop the "Deeper Network" node from the palette onto your Node-RED flow canvas.

Configure the node by providing the necessary credentials and parameters required to interact with the Deeper Network devices.

Connect the node to other nodes in your flow to process the retrieved data or perform further actions.

## Configuration
Username: Your Deeper Network username.
Password: Your Deeper Network password.
API Host: The IP address or hostname of the Deeper Network device.
... (Add any additional configuration options here)

## Docker Testing
1. Ensure you have Docker installed on your machine.

2. Clone or download this repository to your local machine.

3. In the repository directory, build the Docker image:
```sh
docker build -t deeper-network-node-red .
Run the Docker container:
```
```sh
docker run -it -p 1880:1880 deeper-network-node-red
Open your web browser and navigate to http://localhost:1880 to access the Node-RED interface.
````
## Contributing
Contributions are welcome! Please create an issue or submit a pull request if you encounter any bugs or want to add improvements.

## License
This project is licensed under the MIT License.