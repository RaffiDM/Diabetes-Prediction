from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import os

app = Flask(__name__)

# Load model dan scaler
model_path = os.path.join(os.path.dirname(__file__), 'model', 'diabetes_model.pkl')
scaler_path = os.path.join(os.path.dirname(__file__), 'model', 'scaler.pkl')

with open(model_path, 'rb') as file:
    model = pickle.load(file)
    
with open(scaler_path, 'rb') as file:
    scaler = pickle.load(file)

# Feature names
feature_names = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            # Get values from form
            features = []
            for feature in feature_names:
                value = float(request.form.get(feature, 0))
                features.append(value)
            
            # Reshape and scale features
            features_array = np.array(features).reshape(1, -1)
            features_scaled = scaler.transform(features_array)
            
            # Predict
            prediction = model.predict(features_scaled)[0]
            probability = model.predict_proba(features_scaled)[0][1]
            
            # Return prediction
            result = {
                'prediction': int(prediction),
                'probability': float(probability),
                'message': 'Risiko Diabetes Tinggi' if prediction == 1 else 'Risiko Diabetes Rendah'
            }
            
            return jsonify(result)
        
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)