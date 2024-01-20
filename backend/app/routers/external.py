import openai
from fastapi import APIRouter

openai.api_key = "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"

router = APIRouter(prefix="/chat")


@router.get("/topic/{query}")
async def article_info(query: str):
    return get_openai_response(query)

def get_openai_response(query):
    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You will receive a query which is a user asking for an article with a certain topic. Return the 1 or 2 word topic that is most relevant to the query"
            },
            {"role": "user", "content": f"Query:{query}, Topic: "
            }
        ]
    )

    reply = completion.choices[0].message.content
    print(reply)
    return reply

