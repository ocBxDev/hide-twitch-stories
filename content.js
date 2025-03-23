// Function to remove the specific div containing the Twitch stories
function removeStoryDiv(storyTexts) {
  // Selector for the div you want to remove
  const selector = 'div.Layout-sc-1xcs6mc-0.cNKHwD';
  
  // Find all divs with the specified selector
  const elements = document.querySelectorAll(selector);
  
  // Remove the matching divs that specifically contain stories
  elements.forEach(element => {
      // Check if this div contains the specific text that is unique to the stories section
      const storyIndicator = storyTexts.some(item => {
          return element.textContent.trim().toLowerCase() === item.text.toLowerCase();
      });
      
      if (storyIndicator && element.parentNode) {
          element.parentNode.removeChild(element);
      }
  });
}

// Load language data from JSON file
fetch(chrome.runtime.getURL('languages.json'))
  .then(response => response.json())
  .then(data => {
    const storyTexts = data.storyTexts;

    // Set up a MutationObserver to handle dynamic changes on the page
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          // Only execute removal if nodes are added or modified
          if (mutation.addedNodes.length || mutation.removedNodes.length) {
              removeStoryDiv(storyTexts);
          }
      });
    });

    // Start observing changes on the page
    observer.observe(document.body, { childList: true, subtree: true });

    // Wait for the DOM to fully load and then remove initial stories
    document.addEventListener('DOMContentLoaded', () => {
      console.log("DOMContentLoaded event fired");
      removeStoryDiv(storyTexts);

      // Disconnect the MutationObserver after 10 seconds
      setTimeout(() => {
        observer.disconnect(); // Stop observing changes
        console.log("MutationObserver has been disconnected after 10 seconds.");
      }, 10000); // 10000 milliseconds = 10 seconds
    });
  })
  .catch(error => console.error('Error loading language data:', error));
