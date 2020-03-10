from flask import Flask, jsonify
from newsapi import NewsApiClient
import json

app = Flask(__name__)

newsapi = NewsApiClient(api_key='68b80b58e40541468f4cf582b26463dd')


@app.route('/')
def index():
    return app.send_static_file("index.html")


@app.route('/generic/', methods=['GET'])
def get_top_headlines():
    generic_headlines = newsapi.get_top_headlines(language='en')
    generic_headlines = generic_headlines['articles']
    generic_headlines = get_valid_articles(generic_headlines)[0:5]
    return jsonify(articles=generic_headlines)


@app.route('/cnn-fox/', methods=['GET'])
def get_cnn_fox_headlines():
    cnn_headlines = newsapi.get_top_headlines(sources='cnn', language='en')
    fox_headlines = newsapi.get_top_headlines(sources='fox-news', language='en')
    
    cnn_headlines = cnn_headlines['articles']
    fox_headlines = fox_headlines['articles']
    cnn_headlines = get_valid_articles(cnn_headlines)[0:4]
    fox_headlines = get_valid_articles(fox_headlines)[0:4]
    hl = cnn_headlines + fox_headlines
    
    return jsonify(articles=hl)


def get_valid_articles(articles):
    required_keys = ["author", "description", "title", "url", "urlToImage",
                     "publishedAt"]
    # select only articles with the required keys not null
    valid_articles = [h for h in articles
                      if all(h[key] is not None for key in required_keys)]
    return valid_articles


if __name__ == '__main__':
    app.run(debug=True)
