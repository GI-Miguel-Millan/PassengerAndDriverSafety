import requests
import json
import os

api_key = [key]
confidence = 0.50

# Make group
def create_group(group):
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': api_key,
    }
    data = {
        'name': group
    }
    response = requests.put("https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s" % group, data=json.dumps(data), headers=headers)

# Add student to group
def add_student(group, person, img):
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': api_key,
    }
    data = {
        'name': person
    }
    response = requests.post("https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons" % group, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        with open('personIds/%s.json' % person, 'w') as f:
            json.dump(response.json(), f)

        jsonResp = response.json()
        with open('personIds/%s.json' % jsonResp['personId'], 'w') as f:
            json.dump([person], f)


        url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/{}/persons/{}/persistedFaces".format(group, jsonResp['personId'])

        data2 = {
            'url': img
        }
        response2 = requests.post(url, data=json.dumps(data2), headers=headers)
        train(group)
        return True

    else:
        return False

    # TODO store persistedFaceID

# Train group
def train(group):
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': api_key,
    }
    response = requests.post("https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/train" % group, headers=headers)

# Identify person in image (returns person in image)
def identify(group, img):
    url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect"

    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': api_key,
    }
    data = {
        'url': img
    }
    response = requests.post(url, data=json.dumps(data), headers=headers)

    if response.status_code == 200:

        jsonResp = response.json()
        data2 = {
            'personGroupId': group,
            'faceIds': [jsonResp[0]['faceId']],
            'confidenceThreshold': confidence
        }
        url2 = "https://eastus.api.cognitive.microsoft.com/face/v1.0/identify"
        response2 = requests.post(url2, data=json.dumps(data2), headers=headers)
        jsonResp2 = response2.json()

        if jsonResp2[0]:
            personId = jsonResp2[0]['candidates'][0]['personId']

            try:
                with open('./personIds/%s.json' % personId) as f:
                    target = json.load(f)
                return target[0]

            except:
                print('Error occured finding student by Face API ID')
        else:
            return None

    else:
        print('Server could not connect to API')

#Delete person from group
def delete_student(group, person):
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': api_key,
    }
    try:
        with open('./personIds/%s.json' % person) as f:
            target = json.load(f)

            url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s/persons/%s" % (group, target['personId'])

            response = requests.delete(url, data=None, headers=headers)

        if response.status_code == 200:
             
            os.remove('./personIds/%s.json' % target['personId'])
            os.remove('./personIds/%s.json' % person)
            return True

        else:
            return False
    except:
        print('No student named %s on file' % person)

#Delete group
def delete_group(group):
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': api_key,
    }

    url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/%s" % group

    response = requests.delete(url, data=None, headers=headers)
