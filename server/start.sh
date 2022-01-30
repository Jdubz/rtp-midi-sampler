#!/bin/sh

export FLASK_APP=flaskr/server
flask run -h 0.0.0.0 -p 8080
