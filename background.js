(function() {
  document.addEventListener('DOMContentLoaded', () => {
    var libScript = document.createElement('script');
    libScript.type = 'text/javascript';
    libScript.src = './lib.js';
    document.body.appendChild(libScript);
  });

  window.unsave = (unsaveArr) => {
    getStorageWebsites()
      .then((websites) => {
        console.log(websites);
        unsaveArr.forEach((url) => delete websites[url]);
        console.log(websites);
        return setStorageWebsites(websites);
      });
  };
})();


var tabsSelect = (condition) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(condition || null, (tabs) => resolve(tabs));
  });
};
var scroll = (scrollTop, tabId) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(tabId, {
      code: `document.documentElement.scrollTop=${scrollTop}`
    });
  });
};

var getCurrentTab = () => {
  // return tabsSelect({ 'active': true, 'lastFocusedWindow': true })
  return tabsSelect({ 'active': true })
    .then((tabs) => tabs[0]);
};

var go = (tabId) => {
  Promise.all([getStorageWebsites(), getCurrentTab()])
    .then(([websites, tab]) => {
      console.log(tab)
      if (websites[tab.url] !== undefined)
        scroll(websites[tab.url].scrollTop, tabId);
    });
};

var goExtent = () => {

}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    go(tabId)
  }
})
