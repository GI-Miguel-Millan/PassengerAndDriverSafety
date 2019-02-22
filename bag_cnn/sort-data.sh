#!/bin/bash

# Created by: Miguel Millan
# Date 2/22/19
# Last updated: 2/22/19

# Description: 
# For each file that ends in a .avi extension (in the directory of the script) rename the file to <class><counter>.avi where <class> and <counter> are user provided arguments.

# get the class name
class=$1

# get num of videos:
numVids=$(ls -1 *.avi |wc -l)

# use the first 3/4 of the videos for training:
numTraining=$(((3*numVids)/4))

# create a counter to number each video
counter=1

# make directories for train and test if they don't already exist:
mkdir test train

# for each file that ends in the given extensions:
for output in *.avi
do
	if [ $counter -lt $numTraining ]
       	then
		mv "$output" "train/$class$counter.avi"
       	else
		mv "$output" "test/$class$counter.avi"
	fi

	# increment the counter
	counter=$((counter+1))
done
