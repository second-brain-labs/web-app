FROM python:3.10-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code/backend/
COPY poetry.lock pyproject.toml /code/backend/

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir poetry

RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction --no-ansi
COPY ./app /code/backend/app



CMD ["uvicorn", "app.main:api", "--host", "0.0.0.0", "--port", "3500", "--reload"]