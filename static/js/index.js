function load_everything() {
    // display only news section when first loaded
    document.getElementById("search").style.display = 'none';

    // define news/search tabs onclick behavior
    let tabs = document.getElementsByClassName("tab");
    for (let tab of tabs) {
        tab.onclick = function () {
            show_news_or_search(tab.id);
        }
    }

    // load headlines slideshows, word cloud, CNN & Fox News
    load_generic_headlines();
    load_word_cloud_words();
    load_cnn_fox_headlines();

    // set default dates of the date selectors
    set_default_date();

    // load initial sources when category=all
    load_sources("all");

    // define category drop-down menu onclick behavior
    let category = document.getElementById("category");
    category.onchange = function () {
        load_sources(category.options[category.selectedIndex].value);
    };

    // define submit onclick behavior
    document.getElementById("search-button").onclick = function (event) {
        event.preventDefault(); // prevent the page from refreshing

        // only submit the form when all fields have valid inputs
        if (document.getElementById("search-form").reportValidity()) {
            load_search_results();
        }
    };

    // define reset onlick behavior
    document.getElementById("clear-button").onclick = reset_form;
}

function load_generic_headlines() {
    fetch("/generic/")
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log(response);
                    return;
                }

                response.json()
                    .then(data => {
                        display_generic_headlines(data.articles);
                    });
            }
        )
        .catch(err => {
            console.log(err);
        })
}

function load_cnn_fox_headlines() {
    fetch("/cnn-fox/")
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log(response);
                    return;
                }

                response.json()
                    .then(data => {
                        display_cnn_fox_headlines(data.articles);
                    });

            }
        )
        .catch(err => {
            console.log(err);
        });
}

function load_word_cloud_words() {
    fetch("/word-cloud/")
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log(response);
                    return;
                }

                response.json()
                    .then(data => {
                        display_word_cloud(data.words);
                    });
            }
        )
        .catch(err => {
            console.log(err);
        })
}

function load_sources(value) {
    fetch(`/get-sources/${value}`)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log(response);
                    return;
                }

                response.json()
                    .then(data => {
                        display_sources(data);
                    });

            }
        )
        .catch(err => {
            console.log(err);
        })
}

function load_search_results() {
    let keyword = document.getElementById("keyword").value,
        from_date = document.getElementById("from-date").value,
        to_date = document.getElementById("to-date").value,
        category = document.getElementById("category").value,
        source = document.getElementById("source").value;

    // check date range is valid
    let start_date = new Date(from_date), finish_date = new Date(to_date);
    if (finish_date < start_date) {
        alert("Incorrect time.");
        return;
    }

    fetch(`/search/?kw=${keyword}&from=${from_date}&to=${to_date}&cat=${category}&src=${source}`)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log(response);
                    return;
                }

                response.json()
                    .then(data => {
                        display_search_results(data);
                    });
            }
        )
        .catch(err => {
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
    text_title[slide_index-1].textContent = jsonObj[slide_index-1].title;
    text_desc[slide_index-1].textContent = jsonObj[slide_index-1].description;
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
        hl_article.getElementsByClassName("hl-title")[0].textContent = jsonObj[i].title;
        hl_article.getElementsByTagName("p")[0].textContent = jsonObj[i].description;
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

function display_sources(jsonObj) {
    let source_drop_down = document.getElementById("source");
    // remove all options
    for (let i = source_drop_down.length - 1; i > 0; i--) {
        source_drop_down.remove(i);
    }
    // add new sources for the category
    for (let i = 0; i < jsonObj.source_names.length; i++) {
    //for (let source of jsonObj.sources_names){
        let option = document.createElement("option");
        option.text = jsonObj.source_names[i];
        option.value = jsonObj.source_ids[i];
        source_drop_down.add(option);
    }
}

function display_search_results(jsonObj) {
    let results_div = document.getElementById("search-results");

    // clear last-time search results
    while (results_div.firstChild) {
        results_div.firstChild.remove();
    }

    // check error
    if (jsonObj.status === "error") {
        alert(jsonObj.message);
        return;
    }

    let articles = jsonObj.articles;

    // if no article returned
    if (articles.length === 0 && results_div.children.length === 0) {
        let no_results = document.createElement("p");
        no_results.className = "no-results";
        no_results.appendChild(document.createTextNode("No results"));
        results_div.appendChild(no_results);
        return;
    }

    // display search results
    for (article of articles) {
        console.log(article);
        let result_card = document.createElement("div");
        result_card.className = "result-card";

        // create img div for result card
        let result_img_div = document.createElement("div");
        result_img_div.className = "result-img-div";

        let result_img = document.createElement("img");
        result_img.src = article.urlToImage;

        result_img_div.appendChild(result_img);
        result_card.appendChild(result_img_div);

        // create text div for result card
        let result_text_div = document.createElement("div");
        result_text_div.className = "result-text-div";

        let result_title = document.createElement("h3");
        result_title.textContent = article.title;
        let result_desc = document.createElement("p");
        let desc = article.description.slice(0, 65);
        // remove html tags from returned description
        desc = desc.replace(/(<\w+>)+/, "");
        // display only one line with ellipsis cut off
        desc = desc.replace(/\W*\w+\W*$/, "...");
        result_desc.textContent = desc;

        result_text_div.appendChild(result_title);
        result_text_div.appendChild(result_desc);

        // put img and text in result cards
        result_card.appendChild(result_img_div);
        result_card.appendChild(result_text_div);

        // append to results_div
        results_div.appendChild(result_card);
    }
}

function show_news_or_search(clicked_tab_id) {
    let news_div = document.getElementById("news");
    let search_div = document.getElementById("search");

    let tab_news = document.getElementById("tab-news");
    let tab_search = document.getElementById("tab-search");

    if (tab_news.className.includes("active") && clicked_tab_id === "tab-search") {
        tab_news.className = "tab";
        tab_search.className = "tab active";
        search_div.style.display = 'block';
        news_div.style.display = 'none';
    }
    else if (tab_search.className.includes("active") && clicked_tab_id === "tab-news") {
        tab_news.className = "tab active";
        tab_search.className = "tab";
        news_div.style.display = 'block';
        search_div.style.display = 'none';
    }
}

function set_default_date() {
    let curr_day = new Date();
    let week_ago = new Date();
    week_ago.setDate(curr_day.getDate() - 7);
    document.getElementById("from-date").valueAsDate = week_ago;
    document.getElementById("to-date").valueAsDate = curr_day;
}

function reset_form() {
    document.getElementById("search-form").reset();
    set_default_date();
}

window.onload = load_everything;
var slide_index = 0;