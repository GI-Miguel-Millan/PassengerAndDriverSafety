import requests
import json
import os

api_key = [key]
confidence = 0.60

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

        with open('personIds/%s.json' % response['personId'], 'w') as f:
            json.dump([person], f)

        url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/{}/persons/{}/persistedFaces".format(group, response.personID)

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

        data2 = {
            'personGroupId': group,
            'faceIds': [response[0]['faceId']],
            'confidenceThreshold': confidence
        }

        response2 = requests.post(url2, data=json.dumps(data2), headers=headers)

        if response2:
            personId = response2[0]['candidates'][0]['personId']

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

            response = requests.post(url, data=json.dumps(data), headers=headers)

            if response.status_code == 200:

                os.remove('./personIds/%s.json' % person)
                os.remove('./personIds/%s.json' % target['personId'])

                return True

            else:
                return False
    except:
        print('No student named %s on file' % person)