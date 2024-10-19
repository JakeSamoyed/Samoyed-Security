document.addEventListener("DOMContentLoaded", function(){
  const notif = document.getElementById("error");
  const list = document.getElementById("Blacklisted");

  document.getElementById('submitter').addEventListener('click', (event) => {
    event.preventDefault();
    const link = document.getElementById('link').value;
    
    chrome.storage.sync.get({BlacklistedSites: []}, async function(result){
      if(chrome.runtime.lastError){
        console.log(chrome.runtime.lastError);
      }
      else{
        try{
          let array = result.BlacklistedSites;

          if(array.includes(link)){
            notif.textContent = "Link already blacklisted."
            setTimeout(() => {notif.textContent = ""}, 4000);
          }
          else{
            await pushLinks(link);
            displayBL();
          }
        }
        catch(error){
          console.error(error);
        }
      }
    });
  });

  function pushLinks(link){
    return new Promise((resolve, reject)=> {
      chrome.storage.sync.get({BlacklistedSites: []}, function(result) {
     
        if(chrome.runtime.lastError){
          return reject(chrome.runtime.lastError);
        }
        else{
          let array = result.BlacklistedSites;
          array.push(link);
          chrome.storage.sync.set({BlacklistedSites: array}, function(){
            if(chrome.runtime.lastError){
              return reject(chrome.runtime.lastError);
            }
            else{
              notif.textContent = "Link Blacklisted!";
              setTimeout(() => {notif.textContent = ""}, 2500);
              if(chrome.runtime.lastError){
                return reject(chrome.runtime.lastError);
              }
              else{
                resolve();
              }
            }
          });
        }
      });
    });
  };
 
  function removeLink(link){
    return new Promise((resolve, reject)=> {
      chrome.storage.sync.get({BlacklistedSites: []}, function(result){
        if(chrome.runtime.lastError){
          return reject(chrome.runtime.lastError);
        }
        else{
          let array = result.BlacklistedSites;
          
          array = array.filter(item => item !== link);

          chrome.storage.sync.set({BlacklistedSites: array}, function(){
            if(chrome.runtime.lastError){
              return reject(chrome.runtime.lastError);
            }
            else{
              console.log(array);
              notif.textContent = "Link Whitelisted!";
              setTimeout(() => {notif.textContent = ""}, 2500);
              if(chrome.runtime.lastError){
                return reject(chrome.runtime.lastError);
              }
              else{
                resolve();
              }
            };
          });
        }
      });
    });
  };

  const blItem = function(link){
    let li = document.createElement("li");
    li.textContent = link;
    list.prepend(li);
    li.classList = "blackURLs";
    console.log(`added ${link}`);
  };

  function whitelist(event){
    try{
      const link = event.target.textContent;
      removeLink(link);
      event.target.remove();
      console.log(link);
    }
    catch(error){
      console.error(error);
    }
  };

  function updateURLs(){
    Array.from(list.children).forEach((child)=> {
    child.addEventListener("click", whitelist);
    });
  };

  function displayBL(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({BlacklistedSites: []}, function(result){
        if(chrome.runtime.lastError){
          return reject(chrome.runtime.lastError);
        }
        else{
          list.innerHTML = '';
          result.BlacklistedSites.forEach(item => {
          blItem(item);
          if(chrome.runtime.lastError){
            return reject(chrome.runtime.lastError);
          }
          else{
            updateURLs();
            resolve();
          }
        });
        }
      });
    });
  };

  window.onload = () => {
    displayBL();
  }
})
