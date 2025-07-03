from flask import Flask
app = Flask(_name_)

@app.route('/hello/<name>')
def hello_name(name):
   return 'Hello %s!' % name

if _name_ == '_main_':
   app.run()