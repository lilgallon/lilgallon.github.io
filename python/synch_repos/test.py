from github import Github
import json


token = None
with open('access_token.txt', 'r') as f:
    token = f.read()

if token is None:
    print('[!] Could not read access token')

print('[-] Github init')
g = Github(token)
user = g.get_user()

print('[-] Looking user\'s data')
data = user.raw_data
print('[+] Success')

print('[-] Saving repos\' data...')
user_file = '../../data/user.json'
with open(user_file, 'w') as f:
    json.dump(data, f, indent=4, sort_keys=True, default=str)
print('[+] User\'s data saved in {}!'.format(user_file))

# data['bio'] = 
# data['bio'] = user.bio()
# data['public_repos'] = user.public_repos()
# data['public_gists'] = user.public_gists()
# data['private_repos'] = user.private_repos()
# data['private_gists'] = user.private_gists()
# data['followers'] = user.followers()
# data['following'] = user.following()
# data['collaborators'] = user.collaborators()