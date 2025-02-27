# Diabetes Prediction

[![Open in Cloud Run](https://img.shields.io/badge/Cloud%20Run-Live%20Demo-blue?logo=google-cloud&logoColor=white)](https://diabetes-prediction-791432808483.asia-southeast1.run.app)

## Overview
This project develops a machine learning model to predict diabetes risk based on various health parameters. The application has been deployed on Google Cloud Run and is accessible [here](https://diabetes-prediction-791432808483.asia-southeast1.run.app).

## Domain
Diabetes is a chronic condition that affects how the body processes glucose (blood sugar). This disease has become a serious global health problem with increasing prevalence. According to the World Health Organization (WHO), in 2012 alone, diabetes caused 1.5 million deaths. Complications can lead to heart attacks, stroke, blindness, kidney failure, and lower limb amputations.

Early detection of diabetes is crucial to prevent serious complications such as heart disease, blindness, and kidney failure. Machine learning can help identify diabetes risk in patients based on various health parameters, enabling earlier and more effective medical intervention.

**Reference**:
- [Global Report on Diabetes - World Health Organization](https://www.who.int/publications/i/item/9789241565257)

## Project Structure
```
diabetes-prediction/
├── data/
│   └── diabetes.csv
├── image/
│   └── Confussion Matrix.png
├── model/
│   ├── diabetes_model.pkl
│   └── scaler.pkl
├── notebook/
│   └── diabetesPrediction.ipynb
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── templates/
│   └── index.html
├── Dockerfile
├── app.py
├── requirements.txt
└── README.md
```

## Business Understanding

### Problem Statements
1. How can we develop a machine learning model that predicts diabetes risk in patients based on their health parameters?
2. What health factors have the most influence on diabetes prediction?
3. How accurately can the model distinguish between patients at risk of diabetes and those who are not?

### Goals
1. Develop a classification model that can predict diabetes risk with high accuracy.
2. Identify health parameters that have a significant influence on diabetes diagnosis.
3. Achieve balanced evaluation metrics (accuracy, precision, recall, and F1-score) to avoid misdiagnosis.

### Solution Statements
1. Use Random Forest Classifier algorithm with hyperparameter tuning through Grid Search CV to optimize model performance.
2. Implement comprehensive data preprocessing, including:
    - Handling missing values with a median approach based on outcome groups
    - Removing outliers using the IQR method
    - Feature standardization using StandardScaler

## Data Understanding
The dataset used is the Pima Indians Diabetes Dataset, which contains medical information from female patients of Pima Indian heritage. This dataset consists of 768 samples with 9 columns. [Diabetes Dataset](https://www.kaggle.com/datasets/akshaydattatraykhare/diabetes-dataset/data)

### Variables in the diabetes dataset:
- Pregnancies: Number of pregnancies
- Glucose: Blood glucose level
- BloodPressure: Blood pressure measurement
- SkinThickness: Skin thickness
- Insulin: Insulin level in blood
- BMI: Body mass index
- DiabetesPedigreeFunction: Diabetes percentage
- Age: Age of the patient
- Outcome: Final result where 1 means Yes and 0 means No

**Data Condition**:
- No missing values found in the dataset
- No duplicate values found in the dataset
- There are unreasonable minimum values (0) in the 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', and 'BMI' features

**Exploratory Data Analysis (EDA)**:
1. Diabetes Outcome Distribution Analysis:
    - From 582 records, there are 396 people negative and 186 people positive for diabetes

2. Glucose Distribution based on Outcome:
    - Patients with diabetes (Outcome=1) tend to have higher glucose levels
    - Glucose values above 140 are more commonly found in diabetes patients

3. BMI Distribution based on Outcome:
    - Diabetic patients have a slightly higher average BMI
    - Both groups show distributions that tend to be normal

4. Age Distribution based on Outcome:
    - The dataset is dominated by young patients (20-30 years)
    - The proportion of diabetic patients relatively increases in older age groups

5. BloodPressure Distribution based on Outcome:
    - Blood pressure between 60-80 is most commonly found
    - There is no significant difference in blood pressure distribution between diabetic and non-diabetic patients

## Data Preparation
Several data preparation techniques applied:
1. Handling invalid zero values:
    - Identifying features with unreasonable zero values
    - Replacing zero values with the median based on the 'outcome' feature
    - This approach maintains data distribution
2. Outlier handling:
    - Using the IQR (Interquartile Range) method
    - Removing data outside the range (Q1 - 1.5IQR) to (Q3 + 1.5IQR)
    - This process reduced the data from 768 to 582 samples (24.22% data removed)
3. Dataset Split:
    - Separating features and labels
    - Dividing data into training set (80%) and testing set (20%)
    - Training data amount: 465 samples
    - Testing data amount: 117 samples
4. Feature standardization:
    - Using StandardScaler to normalize feature scales
    
## Modeling
In this project, the Random Forest Classifier algorithm is used with Grid Search CV for hyperparameter optimization.

### How Random Forest Classifier Works
Random Forest is an ensemble learning algorithm that works by:
1. Bootstrap Aggregating (Bagging):
    - Creating multiple decision trees by taking random samples of data with replacement
    - Each tree gets a different data subset

2. Random Feature Selection:
    - At each split node, the algorithm only considers a random subset of features
    - This increases diversity among trees

3. Voting Mechanism:
    - Each tree provides a prediction
    - The final result is determined by majority voting from all trees

Random Forest was chosen because:
1. It can handle numerical data well
2. It can handle non-linear relationships between features
3. It reduces the risk of overfitting through ensemble multiple trees

### Hyperparameter Tuning
Optimized hyperparameters:
- n_estimators: [50, 100, 200] - Number of decision trees in the forest
- max_depth: [None, 10, 20, 30] - Maximum depth of each tree
- min_samples_split: [2, 5, 10] - Minimum samples to perform a split
- min_samples_leaf: [1, 2, 4] - Minimum samples at a leaf node

Grid Search results yielded the best hyperparameters:
- n_estimators: 200 - Using 200 decision trees for voting
- max_depth: None - Trees can grow until reaching pure leaves
- min_samples_split: 10 - Requires a minimum of 10 samples for a split
- min_samples_leaf: 4 - Each leaf must have a minimum of 4 samples

## Evaluation
The model was evaluated using several metrics:
1. Accuracy (0.8889)
    - Measures the proportion of correct predictions out of total predictions
    - Shows that the model correctly predicts 88.89% of cases
2. Precision (0.8788)
    - Measures the proportion of correct positive predictions
    - 87.88% of patients predicted to have diabetes actually have diabetes
3. Recall (0.7632):
    - Measures the proportion of actual positive cases successfully predicted
    - The model successfully identifies 76.32% of total actual diabetic patients
4. F1-Score (0.8169):
    - Balances the trade-off between precision and recall
    - A good score indicates a balanced model

### Impact on Business Understanding
1. **Problem Statement 1**: How to develop a machine learning model that predicts diabetes risk?
    - Random Forest model was successfully developed with 88.89% accuracy
    - **Impact**: Can help with initial screening of patients at risk for diabetes

2. **Problem Statement 2**: What health factors are most influential?
    - Random Forest provides feature importance showing the contribution of each parameter
    - **Impact**: Helps medical professionals focus on the most relevant parameters

3. **Problem Statement 3**: How accurately can the model distinguish diabetes risk?
    - The model achieves 87.88% precision and 76.32% recall
    - **Impact**: Relatively low false positive and false negative rates, reducing the risk of misdiagnosis

### Evaluation Solution Statement
1. Use of Random Forest with Grid Search CV:
    - **Impact**: Successfully optimized the model to achieve high accuracy (88.89%)
    - **Result**: Optimal hyperparameters found for best performance

2. Data Preprocessing:
    - **Impact of Zero Values Handling**: Improved data quality while maintaining distribution
    - **Impact of Outlier Removal**: Reduced noise and increased model reliability
    - **Impact of Standardization**: Ensured all features contribute proportionally

Evaluation metric formulas:
```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
F1-Score = 2 * (Precision * Recall) / (Precision + Recall)
```

- TP (True Positive): Diabetic patients correctly predicted to have diabetes
- TN (True Negative): Non-diabetic patients correctly predicted not to have diabetes
- FP (False Positive): Non-diabetic cases predicted as diabetes
- FN (False Negative): Diabetic cases predicted as non-diabetic

## Confusion Matrix
<div align="center">
  <img src="image/Confussion Matrix.png" style="max-width: 50%; height: auto; margin: 10px;">
</div>

## Installation & Setup

### Local Development
1. Clone the repository
```bash
git clone https://github.com/yourusername/diabetes-prediction.git
cd diabetes-prediction
```

2. Create a virtual environment and install dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Run the application
```bash
python app.py
```

4. Visit `http://localhost:5000` in your browser

### Docker Deployment
1. Build the Docker image
```bash
docker build -t diabetes-prediction .
```

2. Run the container
```bash
docker run -p 8080:8080 diabetes-prediction
```

3. Visit `http://localhost:8080` in your browser

### Cloud Run Deployment
The application is already deployed on Google Cloud Run and can be accessed at:
[https://diabetes-prediction-791432808483.asia-southeast1.run.app](https://diabetes-prediction-791432808483.asia-southeast1.run.app)

## Usage
1. Enter the required health parameters in the web interface
2. Click "Predict" to see the diabetes risk assessment
3. The model will provide a prediction based on the input parameters

## Technologies Used
- Python
- Scikit-learn
- Flask
- Docker
- Google Cloud Run
- HTML/CSS/JavaScript

## Author
Raffi Dzaky Mahendra