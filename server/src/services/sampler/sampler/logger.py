import json
import sys

def info(tag, message):
  log = {
    'tag': tag,
    'type': 'info',
    'message': message
  }
  print(json.dumps(log))

def debug(tag, message):
  log = {
    'tag': tag,
    'type': 'debug',
    'message': message
  }
  print(json.dumps(log))

def error(tag, err):
  log = {
    'tag': tag,
    'type': 'error',
    'error': repr(err)
  }
  print(json.dumps(log), file=sys.stderr)

def response(id, data):
  log = {
    'id': id,
    'type': 'response',
    'data': data
  }
  print(json.dumps(log))

def event(eventName, data):
  event = {
    'type': 'event',
    'event': eventName,
    'data': data
  }
  print(json.dumps(event))
