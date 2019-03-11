import argparse
import requests
import json

parser = argparse.ArgumentParser()

parser.add_argument('--faceIds', required=True,
                    help="An array of faceIds corresponding to images you want to identify.")
parser.add_argument('--personGroupID', required=True,
                    help="personGroupId -> points to our group of people")
args = parser.parse_args()

url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/identify"

headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '[key]',
}
data = {
    'faceIds': args.faceIds,
    'personGroupId': args.peronGroupId
}
response = requests.post(url, data=json.dumps(data), headers=headers)

# TODO choose candidate with highest confidence and update database to reflect that persons status.