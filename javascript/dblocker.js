document.addEventListener("DOMContentLoaded", function() {
    const Activater = document.getElementById("dbActivate");
    const Disabler = document.getElementById("dbDisable");

    

    chrome.storage.sync.get(['activation'], function(result) {
        let activation = result.activation !== undefined ? result.activation : false;

        Activater.style.opacity = activation ? '20%' : '100%';
        Activater.textContent = activation ? "Activated" : "Activate";
        Disabler.style.opacity = activation ? '100%' : '20%';
        Disabler.textContent = activation ? "Disable" : "Disabled";
        Activater.addEventListener("click", function(){
            if(activation == false){
                activation = true;
                Activater.style.opacity = '20%';
                Activater.textContent = "Activated";
                Disabler.style.opacity = '100%';
                Disabler.textContent = "Disable";
                chrome.storage.sync.set({activation: true});
            };
        });
        

        Disabler.addEventListener("click", function(){
            if(activation == true){
                activation = false;
                Disabler.style.opacity = '20%';
                Disabler.textContent = "Disabled"
                Activater.style.opacity = '100%';
                Activater.textContent = "Activate";
                chrome.storage.sync.set({activation: false})
            };
        });
    });
});
