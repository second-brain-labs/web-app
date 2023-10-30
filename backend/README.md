# backend


## Project setup
```sh
pip3 install --upgrade pip
pip3 install poetry
poetry config virtualenvs.in-project true
poetry shell
poetry install
```

## Run
```sh
uvicorn app.main:api --reload
```
### Populate database
While the server is running, run:
```sh
python3 populate_db.py [server_url]
```
