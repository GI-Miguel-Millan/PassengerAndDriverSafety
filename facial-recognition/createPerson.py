import argparse
import requests
import json

parser = argparse.ArgumentParser()

parser.add_argument('group')
parser.add_argument('person')
args = parser.parse_args()

if args.group is '' or args.person is '':
    print('Missing arguments')
else:
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '[key]',
    }
    data = {
        'name': args.person
    }
    response = requests.post("https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons" % args.group, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        with open('personIds/%s.json' % args.person, 'w') as f:
            json.dump(response.json(), f)