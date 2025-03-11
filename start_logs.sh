#!/bin/bash

gnome-terminal --tab --title="App1 Logs" -- bash -c "pm2 logs app1; exec bash" \
               --tab --title="App2 Logs" -- bash -c "pm2 logs app2; exec bash" \
               --tab --title="App3 Logs" -- bash -c "pm2 logs app3; exec bash"


