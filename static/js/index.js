function load_everything() {
    load_top_headlines();
    load_cnn_fox_headlines();
}

function load_top_headlines() {
    fetch("/generic")
        .then(response => {
            return response.json();
        })
        .then(data => {
            display_slides(data.articles);
        })
        .catch(err => {
            console.log(err);
        })
}

function load_cnn_fox_headlines() {
    fetch("/cnn-fox")
        .then(response => {
            return response.json();
        })
        .then(data => {
            display_cnn_fox_news(data.articles);
        })
        .catch(err => {
            console.log(err);
        });
}

function display_slides(jsonObj) {

}

function display_cnn_fox_news(jsonObj) {
    let hl = document.getElementsByClassName("hl");
    let hl_articles = document.getElementsByClassName("hl-article");

    for (let i=0; i<hl_articles.length; i++) {
        hl[i].href = jsonObj[i].url;
        hl_articles[i].innerHTML = "<img src=" + jsonObj[i].urlToImage + ">";
    }
}

window.onload = load_everything;