import requests
import argparse

parser = argparse.ArgumentParser()

parser.add_argument('url')
parser.add_argument('data')
parser.add_argument('file')

args = parser.parse_args()

if args.url is '' or args.file is '':
	print('Missing arguements')

else:
	url = args.url
	data = {'event': args.data}
	files = {'file': open(args.file, 'rb')}
	
	r = requests.post(url, data = data, files = files)
	
	print(r.content)