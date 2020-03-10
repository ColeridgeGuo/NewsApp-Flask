function load_everything() {
    load_generic_headlines();
    load_cnn_fox_headlines();
}

function load_generic_headlines() {
    fetch("/generic")
        .then(response => {
            return response.json();
        })
        .then(data => {
            display_generic_headlines(data.articles);
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
            display_cnn_fox_headlines(data.articles);
        })
        .catch(err => {
            console.log(err);
        });
}

function display_generic_headlines(jsonObj) {

}

function display_cnn_fox_headlines(jsonObj) {
    let hl_div = document.getElementsByClassName("hl-link");
    let hl_articles = document.getElementsByClassName("hl-text-container");

    for (let i=0; i<hl_articles.length; i++) {
        // link entire div to the news
        hl_div[i].href = jsonObj[i].url;

        // populate card with image, title, description
        let hl_article = hl_articles[i];
        hl_article.getElementsByTagName("img")[0].src = jsonObj[i].urlToImage;
        hl_article.getElementsByClassName("hl-title")[0].innerHTML = jsonObj[i].title;
        hl_article.getElementsByTagName("p")[0].innerHTML = jsonObj[i].description;
    }
}

function show_news_or_search(option) {
    let news = document.getElementById("news");
    let search = document.getElementById("search");
    if (option === "news") {
        news.style.display = 'block';
        search.style.display = 'none';
    }
    else if (option === "search") {
        search.style.display = 'block';
        news.style.display = 'none';
    }
}

window.onload = load_everything;