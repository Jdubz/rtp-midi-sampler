#!/bin/sh

export FLASK_APP=flaskr/server
python3 -m flask run -h 0.0.0.0 -p 8080
