//For Download Blocker

chrome.storage.sync.get(['activation'], function(result) {
  let activation = result.activation || false;

  try{
    chrome.downloads.onDeterminingFilename.addListener(function(file) {
      if(activation){
        chrome.downloads.cancel(file.id);
      }
    });

    chrome.downloads.onChanged.addListener(function(file){
      if(activation && file.state && file.state.current === "complete"){
        chrome.downloads.removeFile(file.id);
      }
    });

    chrome.storage.onChanged.addListener((changes)=> {
      if(changes.activation){
          activation = changes.activation.newValue;
      }
    });
  }
  catch(error){
    console.log(error)
  }
});

//For Tab Closer

function checkAndCloseTab(tabId, link){
  return new Promise((resolve, reject)=> {
    chrome.storage.sync.get({BlacklistedSites: []}, function(result){
      if(chrome.runtime.lastError){
        reject(chrome.runtime.lastError);
      }
      else{
        let array = result.BlacklistedSites;
        for(let website of array){
         if(link.includes(website)){
            //NotifTC(link);
            chrome.tabs.remove(tabId);
            if(chrome.runtime.lastError){
              reject(chrome.runtime.lastError);
            }
            else{
              resolve()
              break;
            }
          };
        };
      }
    }); 
  })
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  try{
    if(changeInfo.url) {
      checkAndCloseTab(tabId, changeInfo.url);
    };
  }
  catch(error){
    console.log(error)
  }
});
