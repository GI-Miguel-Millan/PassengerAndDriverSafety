# Neural Network For Database

The neural network uses a convolutional neural network to find features and then feeds that into a neural network layer with recurion.

## Data Formatting

The `data_file.csv` contains records of every video. The format for these records is:

`[train|test], class, filename, nb frames`

Each video is stored, with its frames in a directory which looks like this:

`data/[train|test]/class`

The number of classes is represented by how many different classes are in the .csv file. So for our appplication, there might be a class named `normal` and one named `violent` to describe the behavior of passengers on the bus.

Each image file representing a frame must be named `[.avi file name]-NNNN.png`, where N is the four-digit sequence number of the frame.

## Running the System

The options for running the system are described in `main.py` in the `main` function.