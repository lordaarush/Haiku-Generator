from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment
api_key = os.getenv("API_KEY")

if not api_key:
    raise ValueError("API_KEY not found in the environment. Please set it in the .env file.")

# Configure the Google Generative AI
genai.configure(api_key=api_key)

# Create the Flask app
app = Flask(__name__)

# Route to serve the HTML file
@app.route('/')
def home():
    return render_template('index.html')

# API route for generating haiku
@app.route('/generate_haiku', methods=['POST'])
def generate_haiku():
    data = request.json
    theme = data.get("theme", "").strip()

    if not theme:
        return jsonify({"error": "Theme is required"}), 400

    try:
        model = genai.GenerativeModel("tunedModels/haikugenv3-lgrnr897xnc1")
        response = model.generate_content(theme)
        print(f"Response from model: {response}")  # Debug line

        haiku = response.text.strip() if response and response.text else "No haiku generated."
        return jsonify({"haiku": haiku})

    except Exception as e:
        print(f"Error during haiku generation: {e}")  # Log the error
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(port = 8000,debug = True)
