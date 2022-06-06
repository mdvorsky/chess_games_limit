console.log("Popup window opened");
document.getElementById("settings").addEventListener("click", settings_clicked);
document.getElementById("submit_limit").addEventListener("click", set_new_limit)
document.getElementById("limit_note").innerHTML = ""

show_text();

function show_text(){
    console.log("Show text function called")
    chrome.storage.local.get(["daily_limit", "games_today"], function (result){
        daily_limit = result.daily_limit
        games_today = result.games_today
        console.log(String(games_today) + "/" + String(daily_limit))

        if (daily_limit == null && games_today == null){
            setTimeout(show_text, 1000)
            return
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

function settings_clicked(){
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
    new_limit = document.getElementById("input_limit").value
    if (isNaN(new_limit)){
        return
    }
    chrome.storage.local.get(["daily_limit"], function (result){
        old_limit = result.daily_limit
        
        settings_clicked()

        if (new_limit != old_limit){
            chrome.storage.local.set({"daily_limit": new_limit})
            show_text()
            document.getElementById("limit_note").innerHTML = "Daily limit set to " + String(new_limit) + "."
        } else {
            document.getElementById("limit_note").innerHTML = "Daily limit unchanged."
        }
        
    })
}