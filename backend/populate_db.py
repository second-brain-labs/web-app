import json
import requests
import sys
from urllib.parse import quote

short_article_1 = """
In finance, the time value (TV) (extrinsic or instrumental value) of an option is the premium a rational investor would pay over its current exercise value (intrinsic value), based on the probability it will increase in value before expiry. For an American option this value is always greater than zero in a fair market, thus an option is always worth more than its current exercise value.[1] As an option can be thought of as 'price insurance' (e.g., an airline insuring against unexpected soaring fuel costs caused by a hurricane), TV can be thought of as the risk premium the option seller charges the buyer—the higher the expected risk (volatility
⋅\cdot  time), the higher the premium. Conversely, TV can be thought of as the price an investor is willing to pay for potential upside.

Time value decays to zero at expiration, with a general rule that it will lose 1/3 of its value during the first half of its life and 2/3 in the second half.[2] As an option moves closer to expiry, moving its price requires an increasingly larger move in the price of the underlying security.[3]
"""

short_article_2 = """
Maxillae and a lacrimal (the main tooth-bearing bones of the upper jaw, and the bone that forms the anterior margin of the eye socket, respectively) recovered from the Bayan Mandahu Formation in 1999 by the Sino-Belgian Dinosaur Expeditions were found to pertain to Velociraptor, but not to the type species V. mongoliensis. Pascal Godefroit and colleagues named these bones V. osmolskae (for Polish paleontologist Halszka Osmólska) in 2008.[14] However, the 2013 study noted that while "the elongate shape of the maxilla in V. osmolskae is similar to that of V. mongoliensis," phylogenetic analysis found it to be closer to Linheraptor, making the genus paraphyletic; thus, V. osmolskae might not actually belong to the genus Velociraptor and requires reassessment.[15]

Paleontologists Mark A. Norell and Peter J. Makovicky in 1997 described new and well preserved specimens of V. mongoliensis, namely MPC-D 100/985 collected from the Tugrik Shireh locality in 1993, and MPC-D 100/986 collected in 1993 from the Chimney Buttes locality. The team briefly mentioned another specimen, MPC-D 100/982, which by the time of this publication remained undescribed.[10] In 1999 Norell and Makovicky provided more insights into the anatomy of Velociraptor with additional specimens. Among these, MPC-D 100/982 was partially described and figured, and referred to V. mongoliensis mainly based on cranial similarities with the holotype skull, although they stated that differences were present between the pelvic region of this specimen and other Velociraptor specimens. This relatively well-preserved specimen including the skull was discovered and collected in 1995 at the Bayn Dzak locality (specifically at the "Volcano" sub-locality).[9] Martin Kundrát in a 2004 abstract compared the neurocranium of MPC-D 100/982 to another Velociraptor specimen, MPC-D 100/976. He concluded that the overall morphology of the former was more derived (advanced) than the latter, suggesting that they could represent distinct taxa.[16]

"""

short_article_3 = """
Argentina and Inter Miami forward Lionel Messi has won the Men's Ballon d'Or for an eighth time.

The 36-year-old was recognised at the ceremony in Paris after helping his country win the World Cup in Qatar last year.

England and Real Madrid midfielder Jude Bellingham won the Kopa Trophy for the world's best player aged under 21.

Messi won his record-extending Ballon d'Or award ahead of Manchester City forward Erling Haaland.

France forward Kylian Mbappe - who became just the second man to score a World Cup final hat-trick in the 4-2 penalty shootout loss to Argentina - finished third.

"It's nice to be here once more to enjoy this moment," Messi said. "To be able to win the World Cup and achieve my dream."

The former Barcelona and Paris St-Germain star added: "I couldn't imagine having the career I've had and everything I've achieved, the fortune I've had to be part of the best team in history.

"All of them [Ballon d'Or awards] are special for different reasons."


"""


def create_user(url, name, email):
    user = {"name": name, "email": email}
    response = requests.post(f"{url}/users/login", json=user)
    if response.status_code < 300:
        print(f"User {name} created successfully!")
    else:
        print(f"{response.status_code} {response.reason} for user {name}")
    return response.json()


def create_article(url, title, url_, user_uuid, directory_name, content):
    # check if article exists
    articles_by_user = requests.get(f"{url}/articles/user/{user_uuid}")
    for article in articles_by_user.json():
        if article["title"] == title:
            print(f"Article {title} already exists for user {user_uuid}. Skipping...")
            return article
    title = quote(title)
    url_ = quote(url_)
    directory_name = quote(directory_name)

    # get directory id
    directory = requests.get(
        f"{url}/directories/query?user_uuid={user_uuid}&name={directory_name}"
    )
    print(directory.json())
    response = requests.post(
        f"{url}/articles/article/create",
        json={
            "content": content,
            "title": title,
            "url": url_,
            "user_uuid": user_uuid,
            "directory": directory.json()["id"],
        },
    )
    if response.status_code < 300:
        print(f"Article {title} created successfully!")
    else:
        print(f"{response.status_code} {response.reason} for article {title}")
        print(response.json())
        exit(1)
    return response.json()


def create_directory(url, name, user_uuid):
    directory = {"name": name, "user_uuid": user_uuid}
    response = requests.post(f"{url}/directories/create", json=directory)
    if response.status_code < 300:
        print(f"Directory {name} created successfully!")
    else:
        print(f"{response.status_code} {response.reason} for directory {name}")
        print(response.json())
        exit(1)
    return response.json()


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    user1 = create_user(url, "John Doe", "johndoe@gmail.com")
    user2 = create_user(url, "Jane Doe", "janedoe@gmail.com")
    create_directory(url, "dogs", user1["uuid"])
    create_directory(url, "dogs/golden-retrievers", user1["uuid"])
    create_directory(url, "cats", user1["uuid"])
    create_directory(url, "cs", user1["uuid"])

    create_directory(url, "cs", user2["uuid"])
    with open("data/john_doe_articles.json", "r") as f:
        data = json.load(f)

    for article in data["articles"]:
        with open(f"data/{article['id']}.txt", "r") as f:
            content = f.read()
        create_article(
            url,
            article["title"],
            article["url"],
            user1["uuid"],
            article["directory"],
            content,
        )
    create_article(
        url, "Article 3", "https://www.google.com", user2["uuid"], "/", short_article_3
    )
    create_article(
        url, "Article 4", "https://www.google.com", user2["uuid"], "cs", short_article_1
    )
    print("Database populated successfully!")
