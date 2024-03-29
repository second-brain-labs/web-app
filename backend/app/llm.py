from typing import Any, Generator

import modal
from llama_index.llms import (
    CompletionResponse,
    CompletionResponseGen,
    CustomLLM,
    LLMMetadata,
)
from llama_index.llms.base import llm_completion_callback

ok = False


class LocalLLM:
    def query(self, prompt: str):
        response = ""
        try:
            f = modal.Function.lookup("secondbrain", "Model.completion_stream")
            for token in f.remote_gen(prompt):
                response += token
            return response
        except Exception:
            return f"The model is not currently operational... your prompt was {prompt}"


class MixtralModalLLM(CustomLLM):
    context_window: int = 8192
    num_output: int = 4096
    model_name: str = "second-brain-model"

    @property
    def metadata(self) -> LLMMetadata:
        return LLMMetadata(
            context_window=self.context_window,
            num_output=self.num_output,
            model_name=self.model_name,
        )

    def get_model(self):
        return modal.Function.lookup("secondbrain", "Model.completion_stream")

    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        response = ""
        for token in self.get_model().remote_gen(prompt):
            response += token
        return CompletionResponse(text=response)

    @llm_completion_callback()
    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponseGen:
        response = ""
        for token in self.get_model().remote_gen(prompt):
            response += token
            yield CompletionResponse(text=response, delta=token)
