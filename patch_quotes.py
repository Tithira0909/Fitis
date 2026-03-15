import re

with open('src/pages/ChairmanMessage.tsx', 'r') as f:
    content = f.read()

content = content.replace('"{data.message_title}"', '{data.message_title}')

with open('src/pages/ChairmanMessage.tsx', 'w') as f:
    f.write(content)
