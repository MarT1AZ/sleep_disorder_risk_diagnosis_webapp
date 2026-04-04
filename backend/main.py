
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn import tree
import joblib





app = FastAPI()

# config
MODEL_PATH = "model/decisionTree_sleep_risk_classifier"

# init
classifier = joblib.load(MODEL_PATH)
print("log:loaded model successfully")

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

if __name__ == "__main__":
    uvicorn.run(app, host = "127.0.0.1", port = 8000)