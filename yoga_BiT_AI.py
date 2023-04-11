import os 
import keras 
import pandas as pd
import numpy as np
import tensorflow as tf
from IPython.display import clear_output as cls
import matplotlib.pyplot as plt
import plotly.express as px
from keras.preprocessing.image import ImageDataGenerator as IDG
import tensorflow_hub as hub
from keras.layers import Dense
from keras.models import Sequential, load_model
from keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.optimizers.schedules import PiecewiseConstantDecay as PWCD
from tensorflow.keras.optimizers import SGD
from keras.metrics import SparseCategoricalAccuracy, SparseTopKCategoricalAccuracy

path = 'C:\Users\magdziarekj\Studia\Yoga'

class_names = sorted(os.listdir(path))
class_names.remove("Poses.json")
n_classes = len(class_names)

train_gen = IDG(rescale=1./255, rotation_range=10, validation_split=0.1)
train_ds = train_gen.flow_from_directory(path, target_size=(256,256), class_mode='binary', shuffle=True, batch_size=32, subset='training')
valid_ds = train_gen.flow_from_directory(path, target_size=(256,256), class_mode='binary', shuffle=True, batch_size=32, subset='validation')

url = "https://tfhub.dev/google/bit/m-r50x1/1"
bit = hub.KerasLayer(url)

model = Sequential([
    bit,
    Dense(n_classes, activation='softmax', kernel_initializer='zeros')
], name="CyfrowyAsystentYoga")

learning_rate = 5e-2 * 32/512
lr_scheduler = PWCD(
    boundaries=[
        100,
        150,
        200
    ],
    values = [
        learning_rate,
        learning_rate*0.1,
        learning_rate*0.01,
        learning_rate*0.001
    ], name="LearningRate"
)
optimizer = SGD(learning_rate=lr_scheduler, momentum=0.9)

model.compile(
    loss='sparse_categorical_crossentropy',
    optimizer=optimizer,
    metrics=[
        SparseCategoricalAccuracy(name="accuracy"),
        SparseTopKCategoricalAccuracy(k=3, name="Top3Acc")
    ]
)

cbs = [
    EarlyStopping(patience=3, restore_best_weights=True), ModelCheckpoint(model_name+".h5", save_best_only=True)
]

history = model.fit(
    train_ds, 
    validation_data=valid_ds,
    epochs=10, # With the right learning rate, only 5 will also work.
    callbacks=cbs
)