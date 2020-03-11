function load_everything() {
    load_generic_headlines();
    load_word_cloud_words();
    load_cnn_fox_headlines();
}

function load_generic_headlines() {
    fetch("/generic/")
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
    fetch("/cnn-fox/")
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

function load_word_cloud_words() {
    fetch("/word-cloud/")
        .then(response => {
        return response.json();
        })
        .then(data => {
           display_word_cloud(data.words);
        }).catch(err => {
        console.log(err);
        })
}

function display_generic_headlines(jsonObj) {
    let slides = document.getElementsByClassName("generic-headline");
    let text_title = document.getElementsByClassName("gh-title");
    let text_desc = document.getElementsByClassName("gh-desc");
    for (let i = 0; i < slides.length; i++) { // hide everything at the beginning
        slides[i].style.display = "none";
    }
    slide_index ++;
    // reset slide_index (start the slideshow over)
    if (slide_index === slides.length) {slide_index = 1}

    // link entire div to news
    let slide = document.getElementById("top-col-news").firstElementChild;
    slide.href = jsonObj[slide_index-1].url;

    // set image, title, description
    slides[slide_index-1].getElementsByTagName("img")[0].src =
        jsonObj[slide_index-1].urlToImage;
    text_title[slide_index-1].innerHTML = jsonObj[slide_index-1].title;
    text_desc[slide_index-1].innerHTML = jsonObj[slide_index-1].description;
    slides[slide_index-1].style.display = "block";
    setTimeout(function() {display_generic_headlines(jsonObj)}, 4000);
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

function display_word_cloud(jsonObj){
    // set the dimensions and margins of the graph
    let width = 320, height = 250;

    // append the svg object to the body of the page
    let svg = d3.select("#word_cloud_container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Constructs a new cloud layout instance.
    // It run an algorithm to find the position of words that suits your requirements
    let layout = d3.layout.cloud()
        .size([width, height])
        .words(jsonObj.map(function(d) { return {text: d.word, size:d.size}; }))
        .padding(10) //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size;}) // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    function draw(words) {
        svg.append("g")
            .attr("transform",
                "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", function(d) { return d.size + "px";})
            .style("fill", "#000000")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}

function show_news_or_search(element) {
    let news = document.getElementById("news");
    let search = document.getElementById("search");
    if (!element.className.includes("active")) {
        element.className += " active";
        if (element.id === "tab-news") {
            document.getElementById("tab-search").className = "tab";
            news.style.display = 'block';
            search.style.display = 'none';
        }
        else {
            document.getElementById("tab-news").className = "tab";
            search.style.display = 'block';
            news.style.display = 'none';
        }
    }
}

window.onload = load_everything;
document.getElementById("search").style.display = 'none';
var slide_index = 0;