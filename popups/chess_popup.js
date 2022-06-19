function show_text(){
    // Displays the number of games played today and daily limit in the popup
    chrome.storage.local.get(["daily_limit", "games_today"], function (result){
        daily_limit = result.daily_limit
        games_today = result.games_today

        if (daily_limit == null && games_today == null){
            first_time_user()
            show_text()
        } else {
            limit_elem = document.getElementById("h1_show_limit")
            limit_elem.innerHTML = String(games_today) + "/" + String(daily_limit)

            if (games_today >= daily_limit){
                document.getElementById("note").innerHTML = "Daily limit reached! <br>Good luck tomorrow!"
            } else if (games_today == 0) {
                document.getElementById("note").innerHTML = "Start a new game today!"
            } else {
                document.getElementById("note").innerHTML = ""
            }
            document.getElementById("input_limit").value = String(daily_limit)
        }
    });
}


function first_time_user(){
    // User is using the extension for the first time -> saves date, number of today games and daily limit
    today = new Date().toDateString()
            
    chrome.storage.local.set({"date": today})
    chrome.storage.local.set({"games_today": 0})

    // Sets the daily limit to default value - 3
    chrome.storage.local.set({"daily_limit": 3})
}


function swap_windows(){
    // Hide the settings page to show the text or vice versa 
    div_text = document.getElementById("div_show_limit")
    div_settings = document.getElementById("div_settings")

    if (div_text.classList.contains("hide")){
        div_text.classList.remove("hide")
        div_settings.classList.add("hide")
    } else {
        div_text.classList.add("hide")
        div_settings.classList.remove("hide")
    }
}

function set_new_limit(){
    // Saves the newly set daily limit to storage
    new_limit = document.getElementById("input_limit").value
    if (!isNaN(new_limit)){
        chrome.storage.local.get(["daily_limit"], function (result){
            old_limit = result.daily_limit
            
            swap_windows()

            // Selecting text to display
            if (new_limit != old_limit){
                chrome.storage.local.set({"daily_limit": new_limit})
                show_text()
                document.getElementById("limit_note").innerHTML = "Daily limit set to " + String(new_limit) + "."
            } else {
                document.getElementById("limit_note").innerHTML = "Daily limit unchanged."
            }       
        })
    }
}

document.getElementById("settings").addEventListener("click", swap_windows);
document.getElementById("submit_limit").addEventListener("click", set_new_limit)
document.getElementById("limit_note").innerHTML = ""
show_text()