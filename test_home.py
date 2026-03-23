from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("response", lambda res: print(f"Response: {res.url} - {res.status}"))

        page.goto('http://localhost:3002/')
        time.sleep(3)
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        time.sleep(3)
        page.screenshot(path='home_debug.png')

        # log html of partners section
        partners_html = page.evaluate('document.getElementById("partners").innerHTML')
        with open("partners_html.log", "w") as f:
            f.write(partners_html)

        browser.close()

run()
