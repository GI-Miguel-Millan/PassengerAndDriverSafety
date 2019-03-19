import argparse
import requests
import json

parser = argparse.ArgumentParser()

parser.add_argument('group')
args = parser.parse_args()

if args.group is '':
    print('Missing arguments')
else:
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '[key]',
    }
    response = requests.post("https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/train" % args.group, headers=headers)