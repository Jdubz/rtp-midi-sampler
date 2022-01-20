import os
from werkzeug.utils import secure_filename

from flask import jsonify
UPLOAD_FOLDER = '../samples'

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() == 'wav'

def upload(request):
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
    return 'success'

def get_files():
    return jsonify(os.listdir(UPLOAD_FOLDER))

def load_files():
    print('loading')
        