import requests
import sys


def create_user(url, name, email, password):
    user = {"name": name, "email": email, "password": password}
    response = requests.post(f"{url}/users/dummy/create", json=user)
    if response.status_code < 300:
        print(f"User {name} created successfully!")
    else:
        print(f"{response.status_code} {response.reason} for user {name}")
    return response.json()

def create_article(url, title, url_, user_id, directory, content):

    # check if article exists
    articles_by_user = requests.get(f"{url}/articles/user/{user_id}")
    for article in articles_by_user.json():
        if article["title"] == title:
            print(f"Article {title} already exists for user {user_id}. Skipping...")
            return article

    article = {"title": title, "url": url_, "user_id": user_id, "directory": directory, "content": content}

    response = requests.post(f"{url}/articles/article/upload", json=article)
    if response.status_code < 300:
        print(f"Article {title} created successfully!")
    else:
        print(f"{response.status_code} {response.reason} for article {title}")

    return response.json()

def create_directory(url, name, user_id):
    directory = {"name": name, "user_id": user_id}
    response = requests.post(f"{url}/articles/directory/create", json=directory)
    if response.status_code < 300:
        print(f"Directory {name} created successfully!")
    else:
        print(f"{response.status_code} {response.reason} for directory {name}")


    return response.json()


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    user1 = create_user(url, "John Doe", "johndoe@gmail.com", "password")
    user2 = create_user(url, "Jane Doe", "janedoe@gmail.com", "password")
    create_directory(url, "directory1", user1["id"])
    create_directory(url, "directory1/subdirectory1", user1["id"])
    create_article(url, "Article 1", "https://www.google.com", user1["id"], "directory1", "This is the content for article 1")
    create_article(url, "Article 2", "https://www.google.com", user1["id"], "directory1/subdirectory1", "This is the content for article 2")
    create_article(url, "Article 3", "https://www.google.com", user2["id"], "/", "This is the content for article 3")
    print("Database populated successfully!")
