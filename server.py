from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, make_response, send_file, send_from_directory


app = Flask(__name__)

@app.route("/")
def juke():
    return render_template('index.html')

@app.route('/<path:path>')
def send_all(path):
    return send_from_directory('', path)


if __name__ == '__main__':
    app.debug = False
    app.run(host='0.0.0.0', port=5002)

