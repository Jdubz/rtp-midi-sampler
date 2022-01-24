import os
from werkzeug.utils import secure_filename
from flask import jsonify

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() == 'wav'

def upload(request, folder):
    for file in request.files.getlist('file'):
        print(file.filename)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(folder, filename))
    return get_files()

def get_files(folder):
    return jsonify(os.listdir(folder))
    