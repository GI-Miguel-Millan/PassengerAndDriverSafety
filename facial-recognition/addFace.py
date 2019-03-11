import argparse
import requests
import json

parser = argparse.ArgumentParser()

parser.add_argument('--img', required=True,
                    help="url location of the image e.g. http://ourserver.com/img-location.jpg")
parser.add_argument('--personGroupID', required=True,
                    help="url location of the image e.g. http://ourserver.com/img-location.jpg")
parser.add_argument('--personID', required=True,
                    help="url location of the image e.g. http://ourserver.com/img-location.jpg")
args = parser.parse_args()

url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/{}/persons/{}/persistedFaces".format(args.personGroupID, args.personID)

headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '[key]',
}
data = {
    'url': args.img
}
response = requests.post(url, data=json.dumps(data), headers=headers)

# TODO store persistedFaceID