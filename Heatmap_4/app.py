print("==================================================")
print("==  The CoVid19-Project server has started ")
print("==  To kill, press Ctrl+C at the terminal")
print("==================================================")

from flask import Flask, jsonify, render_template
from shapely.geometry import Point
from shapely_geojson import dumps, Feature, FeatureCollection
import pandas as pd
import psycopg2
from psql_config import psql_pw
import json 
from flask_cors import CORS

# from bson.json_util import dumps

# Flask setup
app = Flask(__name__)
cors = CORS(app)

# Establish a connection to the database by creating a cursor object
conn = psycopg2.connect(host="localhost", port = 5432, database="CoVid19-Project", 
                        user="postgres", password=psql_pw)

# Read the entire time_series_covid19 table into a dataframe
df = pd.read_sql_query("SELECT * FROM time_series_covid19", conn)

# Close the cursor and connection to so the server can allocate
conn.close()
    
# Create a GeoJSON object, from the data frame, with confirmed cases and deaths for one date
def createJSON(date):
    features = []
    for i in range(len(df)):
        confirmed_cases = int(df.iloc[i, df.columns.get_loc("Confirmed_cases_" + date)])
        if confirmed_cases > 0:
            feature = Feature(Point(df.iloc[i, df.columns.get_loc("Long")], df.iloc[i, df.columns.get_loc("Lat")]), 
                properties={'Combined_Key': df.iloc[i, df.columns.get_loc("Combined_Key")].strip(),
                            'Confirmed_cases': int(df.iloc[i, df.columns.get_loc("Confirmed_cases_" + date)]),
                            'Deaths': int(df.iloc[i, df.columns.get_loc("Deaths_" + date)])})
            features.append(feature)

    return features

# Create date string from a number of days since 01/22/2020
from datetime import date, datetime, timedelta
def getDate(delta_day):
    delta_day = int(delta_day)
    start_date = datetime(2020, 1, 22)
    d = start_date + timedelta(days = delta_day)
    date_str = d.strftime("%m/%d/%Y")
    return date_str

@app.route("/")
def index():
	return render_template('index.html')
        

# @app.route('/date', methods=['GET', 'POST'])
@app.route('/date=<covid_date_inc>')
def getGeoJSON(covid_date_inc):
    print(f"covid_date_inc: {covid_date_inc}")
    features = createJSON(getDate(covid_date_inc))

    # json_docs = [json.dumps(feature) for feature in features]
    # resp = jsonify(data=json_docs)
    # return resp

    feature_collection = FeatureCollection(features)
    json_str = dumps(feature_collection, separators=(',', ':'))

    # The below returns a GeoJSON string that an online GeoJSON validator validated
    # When axios is used, instead of d3.json(), in the client the console displays
    # an array of features
    return json_str

    # For the below jsonify, When axios is used, instead of d3.json(), in the client 
    # the console displays a string
    # return jsonify(json_str)

    # The below fails because Feature is not JSON serializable
    # return jsonify(features)

    # The below fails because the return type must be a string, dict, tuple, 
    # Response instance, or WSGI callable, but it was a list.
    # return features



# Start the app
if __name__ == '__main__':
    app.run(debug=True)

##############################################
############ use https://stackoverflow.com/questions/53326935/flask-json-to-geojson-incorrect-format-when-using-jsonify
##############################################
