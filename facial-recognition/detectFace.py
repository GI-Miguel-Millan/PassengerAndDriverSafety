import argparse
import requests
import json

parser = argparse.ArgumentParser()

parser.add_argument('--img', required=True,
                    help="url location of the image e.g. http://ourserver.com/img-location.jpg")
args = parser.parse_args()

url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect"

headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '[key]',
}
data = {
    'url': args.img
}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.status_code)
print(response.text)
if response.status_code == 200:
    with open('personIds/temp.json', 'w') as f:
        json.dump(response.json(), f)
# TODO: response contains the faceID, faceRectangle, and a whole bunch of other face landmarks.