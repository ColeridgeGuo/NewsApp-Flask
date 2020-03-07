from flask import Flask
from newsapi import NewsApiClient
import json

app = Flask(__name__)


@app.route('/')
def index():
    return 'Index Page'


newsapi = NewsApiClient(api_key='68b80b58e40541468f4cf582b26463dd')
top_headlines = newsapi.get_top_headlines(language='en', page_size=30)
