from github import Github
import json


def main():
    token = None
    with open('access_token.txt', 'r') as f:
        token = f.read()

    if token is None:
        print('[!] Could not read access token')
        return

    print('[-] Github init')
    g = Github(token)

    exceptions = [
        'FaceWorks', 'PhysX-3.4'
    ]

    print('[-] Looking for repos...')
    data = []
    for repo in g.get_user().get_repos():
        if repo.name in exceptions:
            continue
        print('[+] Found {}'.format(repo.name))
        data.append({
            'name': repo.name,
            'description': repo.description,
            'topics': repo.get_topics(),
            'stars': repo.stargazers_count,
            'forks': repo.forks_count,
            'watchers': repo.watchers_count,
            'open_issues': [i.title for i in repo.get_issues(state='open')],
            'releases': [(
                {
                    'title': r.title,
                    'tag_name': r.tag_name,
                    'body': r.body,
                    'published_at': r.published_at
                }) for r in repo.get_releases()
            ]
        })

    print('[-] Saving data...')
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4, sort_keys=True, default=str)

    print('[+] Data saved in data.json!')

if __name__ == '__main__':
    main()