# Setup

Pre-commit hooks are used to ensure code quality. To install them, run the following commands:
```
pip3 install pre-commit
pre-commit install
```
Note that pre-commit hooks are run automatically on commit, but you can also run them manually with `pre-commit run --all-files`. pre-commit configuration is stored in `.pre-commit-config.yaml`, and currently includes a `ruff` check.

## Backend-specific
See [backend/README.md](backend/README.md)

# Development
    Install `Docker` and `docker-compose`. Then, run `docker-compose up` to start the backend and frontend
