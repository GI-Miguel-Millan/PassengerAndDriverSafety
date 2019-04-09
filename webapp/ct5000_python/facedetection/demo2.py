import face
import requests
import json

#This is just a script to test back end functionality, don't mind me. Be sure to fill stuff in.

username = [user]

password = [pw]

demogroup = [group]

url = 'http://127.0.0.1:8000'

image_dir = 'events/'

classification_path = url + "/" + image_dir

def refresh_access_token(url, refresh_token):
    headers = {'Content-type': 'application/json'}
    refresh_token_url = url + "/api/token/refresh/"
    parameters = {'refresh': refresh_token}
    r = requests.post(refresh_token_url, data=json.dumps(parameters), headers=headers)
    return r.json()

def connect_to_server(url, user_name, password):
    get_token_url = url + "/api/token/"

    headers = {'Content-type': 'application/json'}

    parameters = {'username':user_name, 'password':password}

    r=requests.post(get_token_url, data=json.dumps(parameters), headers=headers)

    return r.json() # returns a json containing the access and refresh tokens.

def send_face(face, access_token):
    headers={'Authorization':'access_token {}'.format(access_token)}

    data = {'enter': True}

    files = {'picture':  open('face/b.jpeg', 'rb')}

    r = requests.post(classification_path, headers=headers, files=files, data=data)

def make_bus(access_token):
    new_url = url + '/buses/'

    headers={'Authorization':'access_token {}'.format(access_token)}

    data = {
        'name': demogroup
    }

    r = requests.post(new_url, headers=headers, data=data)

def make_person(access_token):
    new_url = url + '/students/'

    headers={'Authorization':'access_token {}'.format(access_token)}

    data = {
        'first_name': 'miguel',
        'last_name': 'miguel',
        'age': 12,
        'grade': 6,
        'bus': demogroup
    }

    files = {'picture':  open('face/a.jpeg', 'rb')}

    r = requests.post(new_url, headers=headers, files=files, data=data)

def demo():
    r = connect_to_server(url, username, password)
    access_token = r['access']
    refresh_token = r['refresh']
    make_bus(access_token)
    make_person(access_token)
    face.delete_group(demogroup)

if __name__ == "__main__":
    demo()