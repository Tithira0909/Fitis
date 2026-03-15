with open('index.html', 'r') as f:
    content = f.read()

search = '<title>My Google AI Studio App</title>'
replace = '<title>FITIS</title>\n    <link rel="icon" type="image/png" href="/fitis-logo.png" />'

content = content.replace(search, replace)

with open('index.html', 'w') as f:
    f.write(content)
