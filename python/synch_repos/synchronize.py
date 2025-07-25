from github import Github
import json


def main():
    token = None
    with open('access_token.txt', 'r') as f:
        token = f.read()

    if token is None:
        print('[-] Could not read access token')
        return

    print('[~] Github init')
    g = Github(token)
    user = g.get_user()

    exceptions = [
        'FaceWorks', 'PhysX-3.4', 'Blast', 'FleX', 'NvCloth', 'Flow',
        'dev-toolbox', 'retable'
    ]

    print('[~] Looking for repos...')
    repos = []
    for repo in user.get_repos():
        if repo.name in exceptions:
            continue
        print(' |  [+] Found {}'.format(repo.name))
        repos.append({
            'name': repo.name,
            'description': repo.description,
            'topics': repo.get_topics(),
            'stars': repo.stargazers_count,
            'forks': repo.forks_count,
            'watchers': repo.subscribers_count,
            'language': repo.language,
            'updated_at': repo.updated_at,
            'html_url': repo.html_url,
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
    print('[+] Success')

    print('[~] Saving repos\' data...')
    repos_file = '../../data/repos.json'
    with open(repos_file, 'w') as f:
        json.dump(repos, f, indent=4, sort_keys=True, default=str)

    print('[+] Repos\' data saved in {}!'.format(repos_file))

    # user's data
    print('[~] Looking user\'s data')
    data = user.raw_data
    print('[+] Success')

    print('[~] Saving repos\' data...')
    user_file = '../../data/user.json'
    with open(user_file, 'w') as f:
        json.dump(data, f, indent=4, sort_keys=True, default=str)
    print('[+] User\'s data saved in {}!'.format(user_file))


if __name__ == '__main__':
    main()
