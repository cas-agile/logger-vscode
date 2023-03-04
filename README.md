# VS Code Logger
This extension helps to store your code metrics (lines, comments and tests added, modified or deleted) through a continuose activity monitoring.\
At the same time it keeps track of the session time and explorated files.


## Credits
The original repository of this project can be found [here](https://github.com/Stintipacchio/VScode-Logger).\
This extension is a porting of the Atom package [atom-logger](https://github.com/elPeroN/atom-logger.git).


## How to use
After the installation, in the Explorer Tab will appear a teardown window named "VS-LOGGER". From there you can login by inserting your credentials and the server address.


## Features
Credentials persistence through differents sessions.\
A local DB stores all offline data while server is not available.\
The extension autostarts with VS Code.


## Extension Settings
The extension parameter can be changed in its settings tab.


## Installation
1. Download the compiled package
2. In VS Code, open the **Command palette** (`Ctrl+Shift+P`) and search for `Extensions: install from VSIX`
3. Select the `.vsix` file

## Installation from source
1. Install the required packeges and build the extension by running
    ```
    npm install
    npm run build
    ```
2. Follow the Installation section