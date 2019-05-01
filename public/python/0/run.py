import sys
import json


# params = sys.argv[1]
params = json.loads(sys.argv[1])

present_count = params['count']
current = params['current']

print((current+1)% present_count)