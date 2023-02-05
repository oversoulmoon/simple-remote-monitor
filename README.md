# simple-remote-monitor
A simple web-based resource monitor that will show the information of the computers that has the server side installed
# Usage
Auto start the startServer.sh on the computer at which u want to monitor (Note: The computer must be in the same network)
To monitor the computer start the startClient.sh and go to localhost:3000
# Goals
Here are the list of goals for this project in later modifications
* Add a side bar for navigation
* Enable the modification of settings (ports and query interval)
* Fix socket.io multiple connections
* Adjust for large scale usage
* Add functionaly to monitor worker nodes in a cluster
* Save clients that has been turned off
# Known Bugs
* On a large network, this program might break due to the sheer volume of possible IPs address that it has to query. 