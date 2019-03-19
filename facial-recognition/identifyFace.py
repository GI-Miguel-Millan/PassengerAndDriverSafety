import argparse
import requests
import json

parser = argparse.ArgumentParser()

parser.add_argument('--personGroupId', required=True,
                    help="personGroupId -> points to our group of people")
args = parser.parse_args()

url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/identify"

headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '[key]',
}
with open('./personIds/temp.json') as f:
    target = json.load(f)
    data = {
        'personGroupId': args.personGroupId,
        'faceIds': [target[0]['faceId']]
    }

response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.status_code)
print(response.text)
# TODO choose candidate with highest confidence and update database to reflect that persons status.