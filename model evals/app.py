import os
from groq import Groq
from fastapi import Response, HTTPException, Query, Request, FastAPI
from deepeval.metrics import ContextualPrecisionMetric
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import GEval

app = FastAPI("llm-evaluation")
groq_key = Groq(os.getenv("GROQ_API_KEY"))

class TestCaseModel:#add more features later
    input: str
    actual_output: str
    expected_outout: str

class EvaluationModel:
    test_case: TestCaseModel

@app.post("/evaulate", model=TestCaseModel)
async def evaluation_score(request: EvaluationModel):
    test_case = LLMTestCase(input = request.test_case.input , actual_output =  request.test_case.actual_output, expected_output = request.test_case.expected_output)
    coherence_metric = GEval(
    name="Coherence",
    criteria="Coherence - the collective quality of all sentences in the actual output",
    evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
)
    return Response(coherence_metric.score)