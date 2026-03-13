from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to Gallery...")
        page.goto('http://localhost:3000/Home/gallery')
        page.wait_for_selector('.grid', timeout=10000)
        page.screenshot(path='public-gallery-list.png', full_page=True)
        print("Captured public-gallery-list.png")

        # Try to click on the first gallery post to open the lightbox
        gallery_cards = page.locator('.group').all()
        if gallery_cards:
            print("Clicking first gallery item...")
            gallery_cards[0].click()
            # Wait for lightbox
            page.wait_for_selector('.fixed.inset-0', timeout=5000)
            page.screenshot(path='public-gallery-lightbox.png')
            print("Captured public-gallery-lightbox.png")
        else:
            print("No gallery items found.")

        browser.close()

if __name__ == '__main__':
    run()
