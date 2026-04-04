
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn import tree
import joblib
import logging
import numpy as np



class UserInput(BaseModel):
    age : int
    weight : float
    height : float
    sleep_hr : int
    stress_score : int
    avg_work_hour : int
    gender : str
    mental_condition : str

    def convert_to_ml_input(self):

        gender_index_map = {'female':5,'male':6,'other':7}
        mental_state_index_map = {'anxiety':8,'both':9,'depress':10,'healthy':11}

        bmi = self.weight/(self.height**2)
        ml_input_np = np.zeros(12,dtype = np.float32)
        ml_input_np[0] = self.age
        ml_input_np[1] = bmi
        ml_input_np[2] = self.sleep_hr
        ml_input_np[3] = self.stress_score
        ml_input_np[4] = self.avg_work_hour

        ml_input_np[gender_index_map[self.gender]] = 1

        ml_input_np[mental_state_index_map[self.mental_condition]] = 1


        return np.expand_dims(ml_input_np,axis = 0)

        


app = FastAPI()

# config
MODEL_PATH = "model/decisionTree_sleep_risk_classifier"

# init
logger = logging.getLogger(__name__)
logging.basicConfig(level = logging.INFO)
risk_type_map = {0:'Healthy',1:'Severe',2:'Mild',3:'Moderate'}
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
def return_test_recieve_input(user_input : UserInput):
    logger.info("recieve input on 'test_post_input successfully")
    logger.info(user_input )
    return user_input

@app.post("/disorder_risk_inference")
def test_model_process_avaiability(user_input : UserInput):
    logger.info("input recieved!")
    ml_input_np = user_input.convert_to_ml_input()

    risk_type = classifier.predict(ml_input_np)[0].item()
    risk_type_string = risk_type_map[risk_type]

    logger.info('inference successful!')

    return {"risk_type":risk_type_string}






if __name__ == "__main__":
    uvicorn.run(app, host = "127.0.0.1", port = 8000)