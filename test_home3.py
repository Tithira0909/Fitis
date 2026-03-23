from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        page.goto('http://localhost:3002/')
        time.sleep(3)
        page.evaluate('document.getElementById("partners").scrollIntoView()')
        time.sleep(3)
        page.screenshot(path='home_debug3.png')
        browser.close()

run()
