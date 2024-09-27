# Order Management System Backend

User and order management system using node.js and MongoDB 

## Endpoints 

### POST user
 
First we will create a user using POST and the Postman request url http://127.0.0.1:3000/users.

Email address and password are required. Email address has to be unique. Password's minimal length is 6 symbols.

<details>
<summary>Example of a body for user creation</summary>
    
```
{
"UserName": "JoDavis",
"FirstName": "John",
"LastName": "Davis",
"Age": "24",
"EmailAddress": "johndavis@x.com",
"Password": "12345678"
}
```
    
</details>

<p align="center">
<sub>Creating a user</sub>
</p>
<p align="center">
    <img width="1000" src="https://user-images.githubusercontent.com/91656499/213296781-5ccb79fc-025f-4b3f-9f18-26d08c07ed3c.png" alt="POST user">
</p>

You can create multiple users to test out the other endpoints.

<details>
<summary>Development note</summary>
No proper sign up function has been developed, so 'POST user' can be used as an admin area of sorts. Here you create and manage users without worrying about authentication. Which would of course normally not be the case.<br />

</details>

### GET user

We can retrieve all currently existing users with GET and the Postman request url http://127.0.0.1:3000/users.

Alternatively we can retrieve a specific user by it's id. In that case we will use the Postman request url http://127.0.0.1:3000/users/:id 

<p align="center">
<sub>http://127.0.0.1:3000/users/63c861c791b1237c58231bbe returns our previously created John Davis</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213297367-061824c5-3f90-4366-b895-101a19002687.png" alt="GET user by id">
</p>

### PATCH user

If you want to partially update certain user information, you can use PATCH and the Postman request url http://127.0.0.1:3000/users/:id.

The body will need to contain the information you want to change.

<details>
<summary>Example of a body for user PATCH</summary>
    
```
{
"UserName": "JohnD",
"EmailAddress": "johndavis@gmail.com"
}
```
    
</details>


<p align="center">
<sub>John Davis changes his username and email.</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213299408-d489295c-3c23-412c-920b-777fd9f39ce8.png" alt="PATCH user">
</p>

### DELETE user

A user might want to delete their account from our database, or perhaps we, as admins, want to remove an account that has been inactive for many years now. In that case we will use DELETE and the Postman request url http://127.0.0.1:3000/users/:id.

<p align="center">
<sub>http://127.0.0.1:3000/users/63c829589d40c8ddc4a312d6 will delete the following user</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213298038-272a6f0b-4adc-4da7-b28c-d5336564caaf.png" alt="DELETE user">
</p>

### POST user login

Now we want to ensure that only authorized users can get access to certain parts of our database. For that, we use token-based authentication. Certain endpoints (in this case all the "orders" related endpoints, which are listed further below) are not reachable without authentication.<br />

A user will log in using POST and the Postman request url http://127.0.0.1:3000/users/login.

Email address and password are required. 

<details>
<summary>Example of a body for user log in</summary>
    
```
{
"EmailAddress": "johndavis@gmail.com",
"Password": "12345678"
}
```
    
</details>

<p align="center">
<sub>John Davis logs in with his Email and password</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213300595-370647e7-bc2f-441d-b1d0-054834a59c69.png" alt="User log in">
</p>

As can be seen here, a token is generated, which has been encoded with the help of a secret key. The user can log in from a different device, in which case a second token will be generated.

<p align="center">
<sub>User with 2 tokens</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213300747-fe7f848c-5697-40fb-84e5-c9ef81ae9f5d.png" alt="Bearer token">
</p>

Tokens can be saved in Postman environments and passed alongside any made requests. 

<p align="center">
<sub>We use a bearer token here</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/211663739-d13ad90d-2d56-44af-83fa-71f9688fb9a1.png" alt="Two tokens">
</p>


### POST user logout

A user can log out using POST and the Postman request url http://127.0.0.1:3000/users/logout.

Only a bearer token is needed, no body or any additional information.

<p align="center">
<sub>John Davis successfully logged out and lost one of the tokens in the process</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/211664479-2e258480-3e33-4395-b485-aef78353f0f2.png" alt="Logout success">
</p>

In this example we can imagine that John logged out on one of the devices, but stayed logged in on another.

### POST order

An authenticated user can create orders, similar to something that can be found on Amazon. For that, they can use POST and the Postman request url http://127.0.0.1:3000/orders.

A token is required. The rest of the body is optional, but contains all the important information. 

<details>
<summary>Example of a body for order creation</summary>
    
```
{
"Description": "Leather chair, black",
"OrderDate": "2023-01-07",
"ShippedDate":"2023-01-10",
"Status": "Shipped",
"ShippedStatus": 1
}
```
    
</details>

<p align="center">
<sub>John Davis created an order with a leather chair</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213301615-5ce4ef4e-93e1-4ae0-ad0c-01c256f3b216.png" alt="POST order">
</p>

### GET order

We can retrieve all currently existing orders (that were created by the currently authenticated user) with GET and the Postman request url http://127.0.0.1:3000/orders.

Alternatively we can retrieve a specific order by it's id (as long as it was created by the currently authenticated user). In that case we will use the Postman request url http://127.0.0.1:3000/orders/:id.

<p align="center">
<sub>http://127.0.0.1:3000/orders/63c867ffba2dbc103ce11df4 returns our previously created order with a chair</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213301814-5e4adae6-b6fa-49d3-bedb-c1edcbe602d8.png" alt="GET order by id">
</p>

As can be seen here, the object id of the corresponding user (John Davis) is saved and displayed in addition to the other information. 

### PATCH order

If you want to partially update certain order information, you can use PATCH and the Postman request url http://127.0.0.1:3000/orders/:id.

The body will need to contain the information you want to change. As before, the user must be authenticated and the order must have been created by them.

<details>
<summary>Example of a body for order PATCH</summary>
    
```
{
"Status": "Delivered"
}
```
    
</details>


<p align="center">
<sub>The ordered chair has finally been delivered and it's status changed</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213302068-41d779c4-73ae-42c2-bd6f-2badb9df9b6d.png" alt="PATCH order">
</p>


### DELETE order

Finally, an order might need to be deleted from the database. In that case, the user who originally created the order, will use DELETE and the Postman request url http://127.0.0.1:3000/orders/:id.

<p align="center">
<sub>http://127.0.0.1:3000/orders/ will delete the following order</sub>
</p>
<p align="center">
 <img width="1000" src="https://user-images.githubusercontent.com/91656499/213302263-ac0c47e0-83be-491c-a73e-bfcbc6373086.png" alt="DELETE order">
</p>


### Swagger documentation
    
An attempt was made to generate a Swagger API documentation. The "documentation" can be reached here - http://127.0.0.1:3000/swagger/.