import os # Chech arguments
import argparse # Used to manage args
from markdown2 import markdown_path # https://github.com/trentm/python-markdown2

def main(args):
    verbose = args.verbose

    raw_html = markdown_path(
        args.input,
        extras={
            'html-classes': {
                'h1': 'clasasa'
            }
        }
    )

    output_html = ''
    lines = raw_html.split('\n')
    for line in lines:
        new_line = True

        if line == '':
            new_line = False

        # Section title
        if line.startswith('<h2>'):
            # Example "<h2>cpp4|fas fa-user-friends|4. POINTERS</h2>"
            raw_title = line.replace('<h2>', '').replace('</h2>', '') # ex: "cpp4|fas fa-user-friends|4. POINTERS"
            section_id = raw_title.split('|')[0] # ex: "cpp4"
            icon = raw_title.split('|')[1] # ex: fas fa-user-friends
            title = raw_title.split('|')[2] # ex: 4. POINTERS

            line = (
                '<div id="' + section_id + '"' + ' class="section-title">\n' +
                '<i class="' + icon + '"></i> ' + title + '\n<hr>\n</div>'
            )


        # Code blocks
        if (line.startswith('<p><code>cpp')):
            line = line.replace('<p><code>cpp', '<pre>\n<code class="cpp">')
            new_line = False
        if (line.startswith('</code></p>')):
            line = line.replace('</code></p>', '</code>\n\t</pre>')

        # Code in-line
        if ('<code>' in line):
            line = line.replace('<code>', '<code class="text-info">')

        output_html = output_html + line + ('\n' if new_line else '')

    with open(args.output if args.output else 'output.html', 'w') as f:
        f.write(output_html)

def checkFile(string):
    if not os.path.isfile(string):
        raise FileNotFoundError('Could not find ' + string)
    else:
        return string

def isValidHtml(string):
    if not string.endswith(".html"):
        raise AssertionError("The output .html file should ends with .html")
    else:
        if os.path.isfile(string):
            print(string + ' already exists and will be replaced')
        return string

if __name__ == '__main__':
    # https://docs.python.org/3/howto/argparse.html
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="input markdown file", type=checkFile)
    parser.add_argument("-o", "--output", help="output html file", type=isValidHtml)
    parser.add_argument("--verbose", help="increase output verbosity", action="store_true")
    args = parser.parse_args()

    main(args)