FROM python:3.10-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code/backend/
COPY ./requirements.txt /code/backend/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/backend/requirements.txt

COPY ./app /code/backend/app

CMD ["uvicorn", "app.main:api", "--host", "0.0.0.0", "--port", "3500", "--reload"]