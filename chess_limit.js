function update_date(){
    // Checks whether the date have changed (to reset the number of games for today)
    today = new Date().toDateString()
    chrome.storage.local.get(["date"], function(result){
        saved_date = result.date
        if (today != saved_date){
            chrome.storage.local.set({"date": today})
            chrome.storage.local.set({"games_today": 0})
        }
        if (saved_date == null) {
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
    SELECTORS = [
        ".new-game-margin-component .ui_v5-button-large.ui_v5-button-full",
        ".ui_v5-button-component.ui_v5-button-primary.custom-game-options-play-button",
        ".daily-game-footer-game-over button",
        ".live-game-buttons-game-over button",
        ".custom-game-options-play-button"
    ]
    LINKS_SELECTORS = [
        ".play-quick-links-play-x-min"  //  Play X min (home page)
    ]
    game_over_screen_timer()

    play_buttons = []
    for (index = 0; index < SELECTORS.length;index++){
        // Adds button elements to array
        selected = document.querySelectorAll(SELECTORS[index])
        selected_array = Array.from(selected)
        play_buttons = play_buttons.concat(selected_array)
    }

    play_links = []
    for (index = 0; index < LINKS_SELECTORS.length;index++){
        // Adds button elements to array
        selected = document.querySelectorAll(LINKS_SELECTORS[index])
        selected_array = Array.from(selected)
        play_links = play_links.concat(selected_array)
    }


    if ((play_buttons.length + play_links.length) > 0){
        add_listeners(play_buttons)
        add_listeners(play_links)
        disable_enable(play_buttons, play_links)
    }
}


function add_listeners(elements){
    // When the button / link is clicked, the number of games played today is increased
    for (index = 0; index < elements.length; index++){
        elements[index].addEventListener("click", update_number_of_games)
    }
}


function disable_enable(buttons, links_to_hide){
    // Checks if the daily limit was exceeded. It disables or enables all buttons accordingly
    chrome.storage.local.get(["daily_limit", "games_today"], function(result){
        daily_limit = result.daily_limit
        games_today = result.games_today

        disable = (games_today >= daily_limit)
        
        if (disable){
            title_to_set = "Daily limit reached!\nGood luck tomorrow!"
            display_value = "none"
        } else {
            title_to_set = ""
            display_value = ""
        }

        for (index = 0;index < buttons.length;index++){
            buttons[index].disabled = disable
            buttons[index].title = title_to_set
        }
        for (index = 0; index < links_to_hide.length; index++){
            links_to_hide[index].style.display = display_value
        }
    });
}

update_date()
document.body.addEventListener("click", find_buttons)
find_buttons()
