import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """
import { LeadershipTeam } from './pages/LeadershipTeam';
import { ChairmanMessage } from './pages/ChairmanMessage';
import { CodeOfConduct } from './pages/CodeOfConduct';
import { PastLeaders } from './pages/PastLeaders';
"""

content = content.replace("import { Introduction } from './pages/Introduction';",
                          f"import {{ Introduction }} from './pages/Introduction';\n{imports_to_add}")

# Add routes
routes_to_add = """
              <Route path="/Home/leadership-team" element={<LeadershipTeam />} />
              <Route path="/Home/chairman-message" element={<ChairmanMessage />} />
              <Route path="/Home/code-of-conduct" element={<CodeOfConduct />} />
              <Route path="/Home/past-leaders" element={<PastLeaders />} />"""

content = content.replace("<Route path=\"/Home/introduction\" element={<Introduction />} />",
                          f"<Route path=\"/Home/introduction\" element={{<Introduction />}} />{routes_to_add}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("src/App.tsx patched.")
