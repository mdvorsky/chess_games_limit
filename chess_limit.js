function update_date(){
    today = new Date().toDateString()
    chrome.storage.local.get(["date"], function(result){
        saved_date = result.date
        if (today != saved_date){
            console.log("setting new date (" + saved_date + " != " + today + ")")
            chrome.storage.local.set({"date": today})
            chrome.storage.local.set({"games_today": 0})
            chrome.storage.local.set({"daily_limit": 3})
        }
    });
    
}


function update_number_of_games(){
    // Increases the number of games played today after the button is clicked
    chrome.storage.local.get(["games_today"], function(result){
        games_today = result.games_today
        if (games_today == null){
            games_today = 0
        }
        chrome.storage.local.set({"games_today": parseInt(games_today) + 1})

    });
}


function game_over_screen_timer(){
    // The Rematch and New game buttons appear later on the game screen
    if (window.location.href.includes("www.chess.com/game/live")){
        if ((document.getElementsByClassName("daily-game-footer-game-over").length == 0) &&
                document.getElementsByClassName("live-game-buttons-game-over").length == 0
        ){
            setTimeout(find_buttons, 1500)
        }

    }
}


function find_buttons(){
    // Finds the buttons for starting a new game

    console.log("Updating body")
    SELECTORS = [
        ".new-game-margin-component .ui_v5-button-large.ui_v5-button-full",
        ".ui_v5-button-component.ui_v5-button-primary.custom-game-options-play-button",
        ".daily-game-footer-game-over button",
        ".live-game-buttons-game-over button"
    ]
    game_over_screen_timer()

    play_buttons = []
    for (index = 0; index<SELECTORS.length;index++){
        selected = document.querySelectorAll(SELECTORS[index])
        selected_array = Array.from(selected)
        play_buttons = play_buttons.concat(selected_array)
    }
    if (play_buttons.length > 0){
        add_listeners(play_buttons)
        disable_enable(play_buttons)
    }
    console.log(play_buttons)

}


function add_listeners(buttons){
    // When the button is clicked, the number of games played today is increased
    for (index = 0;index<buttons.length;index++){
        buttons[index].addEventListener("click", update_number_of_games)
    }
}


function disable_enable(buttons){
    // Checks if the limit was exceeded. It disables or enables all buttons accordingly
    chrome.storage.local.get(["daily_limit", "games_today"], function(result){
        daily_limit = result.daily_limit
        games_today = result.games_today

        console.log(String(daily_limit)+ "<- daily limit | games today -> " + String(games_today))
        disable = (games_today >= daily_limit)
        console.log("Disable buttons? " + String(disable))
        
        for (index = 0;index<buttons.length;index++){
            buttons[index].disabled = disable
        }
    });
       

}

update_date()
document.body.addEventListener("click", find_buttons)
find_buttons()
