FROM python:3.10-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code/backend/
COPY poetry.lock pyproject.toml /code/backend/

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir poetry==1.6.1

RUN poetry export -f requirements.txt --output requirements.txt

RUN pip install -r requirements.txt

COPY ./app /code/backend/app

CMD ["uvicorn", "app.main:api", "--host", "0.0.0.0", "--port", "3500", "--reload"]
