## Interview Questions

# Differences between using sessions or JSON Web Tokens for authentication.

1. In sessions, the session information is stored and validated in the backend but in JSON Web tokens the token should be manually stored in the client and sent with each request to the server.

2. Cookies are automatically stored in the web browser as well as sent to the server once the domain is requested. While JSON webtokens have to be stored manually in the client (using local or session storage) and manually added to the authorization headers with each request.

# What does bcryptjs do to help us store passwords in a secure manner?

It adds a salt "random string" to the end of our password and hashes the password a number of times to produce an incomprehensible string. This hash is then stored in the database.

# How are unit tests different from integration and end-to-end testing?

Unit Tests: tests only one functionality of our system, very fast, cheap and simple.
Integration Tests: tests how different parts of our system interact with each other like endpoint or database access testing. These are more expensive.
End-to-End Tests: these tests simulate actual user scenarios from start to finish (i.e. how a user interacts with the application) and are the most complex.

# How does Test Driven Development change the way we write applications and tests?

We work under the following paradigm (test, code, refactor). In other words, we write the tests first, then we write the code to make the tests pass and after that we refactor our code to make it more stable.
