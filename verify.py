from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3001/Home/events")
        page.wait_for_selector("text=Upcoming Events & Activities", timeout=10000)
        page.screenshot(path="events_screenshot.png", full_page=True)
        print("Verified frontend.")
        browser.close()

verify()
