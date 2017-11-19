import sys
sys.path.append('/usr/local/lib/python2.7/site-packages')
import numpy as np
from keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img
from keras.models import Sequential
from keras.layers import Dropout, Flatten, Dense
from keras import applications
from keras.utils.np_utils import to_categorical
import matplotlib.pyplot as plt
import math
from flask import Flask, jsonify, request, make_response
import json
import urllib

# Model directory
top_model_weights_path = 'assets/bottleneck_fc_model.h5'

def predict(url):
    # load the class_indices saved in the earlier step
    class_dictionary = np.load('assets/class_indices.npy').item()

    num_classes = len(class_dictionary)

    # add the path to your test image below
    image_path = urllib.urlopen(url)

    print("[INFO] loading and preprocessing image...")
    image = load_img(image_path, target_size=(224, 224))
    image = img_to_array(image)

    # important! otherwise the predictions will be '0'
    image = image / 255

    image = np.expand_dims(image, axis=0)

    # build the VGG16 network
    model = applications.VGG16(include_top=False, weights='imagenet')

    # get the bottleneck prediction from the pre-trained VGG16 model
    bottleneck_prediction = model.predict(image)

    # build top model
    model = Sequential()
    model.add(Flatten(input_shape=bottleneck_prediction.shape[1:]))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(num_classes, activation='sigmoid'))

    model.load_weights(top_model_weights_path)

    # use the bottleneck prediction on the top model to get the final
    # classification
    class_predicted = model.predict_classes(bottleneck_prediction)

    probabilities = model.predict_proba(bottleneck_prediction)

    inID = class_predicted[0]

    inv_map = {v: k for k, v in class_dictionary.items()}

    label = inv_map[inID]

    # Return predict label
    return label

# Web App
app = Flask(__name__,static_url_path='')

@app.route('/classify', methods=['GET'])
def classify():
    # Get image url form web
    image_url = request.args.get('imageurl')

    # Use image url form web to predict
    results = predict(image_url)

    # Return label to Web by json
    return jsonify({"results": results})

@app.route('/', methods=['GET'])
def root():
    # Use web template in static folder
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = 8000 # the custom port you want
    app.run(host='127.0.0.1', port=port)
