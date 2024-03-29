# Models

**User**

- id: int (primary key)
- username: string
- password: string
- email: string

**Article**

- id: int (primary key)
- title: string
- summary: string
- content: string
- url: string
- author_id: int (foreign key)
- created_at: datetime

# API

## User

`/user/:id`

- GET: Get user info by id

`/user/create`

- POST: Create a new user

`/user/login`

- POST: Login user

## Article

`/article/:id`

- GET: Get article info by id

`/article/create`

- POST: Create a new article

`/article/update/:id`

- PUT: Update article by id

`/article/delete/:id`

- DELETE: Delete article by id

`/article/list/:user_id`

- GET: Get all articles by user id
