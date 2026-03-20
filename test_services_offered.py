from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        print("Visiting homepage...")
        page.goto("http://localhost:3000")
        time.sleep(2)

        # Scroll to Services Offered section
        print("Scrolling to Services Offered...")
        page.evaluate("window.scrollTo(0, 3000)")
        time.sleep(1)

        print("Taking screenshot...")
        os.makedirs("/home/jules/verification", exist_ok=True)
        page.screenshot(path="/home/jules/verification/services_offered.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
