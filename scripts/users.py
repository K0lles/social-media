from service.auth_users.models import User


def run():
    users_data = [
        {'username': 'johndoe', 'email': 'john.doe@example.com', 'password': '123qwe', 'first_name': 'John',
         'last_name': 'Doe'},
        {'username': 'janesmith', 'email': 'jane.smith@example.com', 'password': '123qwe',
         'first_name': 'Jane', 'last_name': 'Smith'},
        {'username': 'alicejones', 'email': 'alice.jones@example.com', 'password': '123qwe',
         'first_name': 'Alice', 'last_name': 'Jones'},
        {'username': 'bobbrown', 'email': 'bob.brown@example.com', 'password': '123qwe',
         'first_name': 'Bob', 'last_name': 'Brown'},
        {'username': 'charlieclark', 'email': 'charlie.clark@example.com', 'password': '123qwe',
         'first_name': 'Charlie', 'last_name': 'Clark'},
    ]

    for user_data in users_data:
        if not User.objects.filter(username=user_data['username']).exists():
            user = User.objects.create_user(
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password']
            )
            print(f"User {user.username} created.")
        else:
            print(f"User {user_data['username']} already exists.")
