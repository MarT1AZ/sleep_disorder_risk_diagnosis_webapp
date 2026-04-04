
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn import tree
import joblib
import logging



class ModelInput(BaseModel):
    age : int
    weight : float
    height : float
    sleep_hr : int
    stress_score : int
    avg_work_hour : int
    gender : str
    mental_condition : str


app = FastAPI()

# config
MODEL_PATH = "model/decisionTree_sleep_risk_classifier"

# init
logger = logging.getLogger(__name__)
logging.basicConfig(level = logging.INFO)
classifier = joblib.load(MODEL_PATH)
logger.info("log:loaded model successfully")


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers = ['*'],

)


@app.get("/test_get")
def return_test():
    return "this is test page"


@app.get("/")
def return_test():
    return "yay its run succesfully"

@app.post("/test_post_input")
def return_test_recieve_input(model_input : ModelInput):
    logger.info("recieve input on 'test_post_input successfully")
    return model_input

if __name__ == "__main__":
    uvicorn.run(app, host = "127.0.0.1", port = 8000)