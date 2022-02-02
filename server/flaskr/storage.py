import json

class Storage():
    def __init__(self):
        self.file = './config.json'
        self.load()

    def set_channel(self, channel, value):
        if value in self.config['channel']:
            index = self.config['channels'].index(value)
            self.config['channels'][index] = None
        
        self.config['channels'][channel] = value
        self.save()

    def load(self):
        with open(self.file, 'r') as f:
            data = json.load(f)
            self.config = data

    def save(self):
        with open(self.file, 'w') as json_file:
            json.dump(self.config, json_file)
            