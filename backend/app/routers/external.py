import os

import openai
from app.db import query_engine_rag, retriever
from fastapi import APIRouter

openai.api_key = os.getenv("OPENAI_API_KEY", "")

router = APIRouter(prefix="/chat")


@router.get("/topic/{user_uuid}/{query}")
async def article_info(query: str, user_uuid: str):
    retriever.user = user_uuid
    resp = query_engine_rag.query(query)
    text_response = resp.response
    sources = resp.source_nodes
    titles = ",".join([n.node.metadata["title"] for n in sources])
    api_response = {"response": f"{text_response}\n\n Context used: {titles}"}
    return api_response


# Not currently used
def get_openai_response(query):
    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You will receive a query which is a user asking for an article with a certain topic. Return the 1 or 2 word topic that is most relevant to the query",
            },
            {"role": "user", "content": f"Query:{query}, Topic: "},
        ],
    )

    reply = completion.choices[0].message.content
    return reply
