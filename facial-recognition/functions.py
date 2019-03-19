import requests
import json

api_key = [key]

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

        url = "https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/{}/persons/{}/persistedFaces".format(group, response.personID)

        data2 = {
            'url': img
        }
        response2 = requests.post(url, data=json.dumps(data2), headers=headers)

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

# Identify person in image
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
        with open('personIds/temp.json', 'w') as f:
            json.dump(response.json(), f)

        url2 = "https://eastus.api.cognitive.microsoft.com/face/v1.0/identify"

        with open('./personIds/temp.json') as f:
            target = json.load(f)
            data2 = {
                'personGroupId': group,
                'faceIds': [target[0]['faceId']]
            }

        response2 = requests.post(url2, data=json.dumps(data2), headers=headers)

        return True
    
    else:
        return False

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
    except:
        print('No student named %s' % person)
