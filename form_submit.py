from flask import request, redirect

@app.route('form_submit.py', methods = ['POST'])
def signup():
    your_name = request.form['your-name']
    print("Your name is '" + your_name + "'")
    return redirect('/')
