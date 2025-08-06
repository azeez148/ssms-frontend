from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:4200/")

    # Wait for the products to be loaded on the page.
    # We can look for a product card as an indicator.
    page.wait_for_selector('.card-title')

    # Find an image that should be the default image.
    # The src attribute will be the full URL.
    default_image = page.locator('img[src="http://localhost:4200/notfound.png"]').first

    # Assert that the image is visible
    expect(default_image).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
