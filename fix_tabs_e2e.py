from playwright.sync_api import sync_playwright

def verify_chairman_tab():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/")
        page.wait_for_timeout(3000)
        page.screenshot(path="homepage_debug.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    verify_chairman_tab()
