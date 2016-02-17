# API Endpoints

## Account Related Actions

### `api/account/register`
##### POST 
```javascript
{
    username: required,
    password: required(min: 6,  any), 
    confirmPassword: required,
    firstName: optional (max: 25)
    lastName: optional (max: 25)
}
```

### `api/token`
##### POST 
* **Requst Format**:
```javascript
{
    username: required,
    password: required,
    grant_type: 'password'
}
```
* **Response Data**:
```javascript
{
    access_token: ...,
    token_type: 'bearer',
    userName: ...,
    expires_in: int,
    .expires: date-string,
    .issued: date-string
}
```
* *Add **header** `Authorization` to future requests in the following format:*
`Authorisation: 'Bearer ' + response.access_token`

### `api/acount/userinfo`
##### GET (Requires Token) returns:
```javascript
{
    email,
    userId,
    hasRegistered,
    loginProvider,
    firstName,
    lastName,
    quizzesCreated
}
```
 ---
## Quiz Related Actions

### `api/quizzes`
##### GET (Allows Anonymous) returns an array of quizzes
* **Available query parameters:**
    * category - string
    * keyPhrase - looks for the phrase in quiz title or description
    * minRating - double
    * maxRating - double
    * minQuestions - int
    * maxQuestion - int
    * fromDate - date
    * toDate - date
    * orderBy - int
        0. date
        1. rating
        2. number of questions
        3. times taken
    * orderDescending: bool
    * page - int (default = 0)
    * size - int (default = 10)
* **Sample response.data:** 
```javascript
[{
    category: "General"
    createdBy: "First Last"
    createdById: "id"
    createdOn: "2016-01-08T21:39:47.703"
    description: "What do you know about whisky?"
    id: 8
    questions: [{
        title: "Whisky is a national drink of:",
        answers: [{
            isCorrect: true
            text: "Scotland"
        }, ...]
    }, ...]
    rating: 0
    timesSolved: 3
    title: "Whisky"
}]
```
##### POST (Requires Token) creates or updates a quiz
* **Request Format:**
```javascript
{
    title: string 3 to 128,
    category: string 3 to 128,
    description: string 5 to 500,
    isPrivate: bool,
    questions: [{
        title: string 5 to 500,
        answers: [{
            text: string 2 to 256,
            isCorrect: bool
        }, ...]
    }, ...]
}
```
* **Response:** `created at api/quizzes/:id`

### `api/quizzes/{id:int}`
##### GET returns the quiz by the given id 
* the quiz model is available above 
* if the quiz is **private** it will only be return if requested by it's maker 
##### DELETE deletes the quiz with the given id
* the quiz will be deleted only if request is made by it's creator

### `api/quizzes/categories`
##### GET returns a collection of category names
* **Query parameters**:
    * pattern - string (filters categories containing the pattern)
    * take - int (maximal size of the result collection)

### `api/quizzes/solve`
##### POST 
* **Request Model**: 
```javascript
{
    id: int (quiz id)
    questions: [{
        title: string,
        selected: int (the index of the selected answer)
    }, ...]
```
* **Response Data**:
```javascript
{
    id: int,
    title: string,
    totalQuestions: int,
    wrongAnswers: [{
        question: string,
        selectedAnswer: string,
        correctAnswer: string
    }, ...]
}
```

### `api/quizzes/{username}`
##### GET returns the given user's quizzes
* Supports the same query parameters as the GET `api/quizzes` route
* Returns only the public quizzes of the given user, or if the user request his own quizzes returns the private too
    
### `api/quizzes/rate/{id:int}`
##### POST 
* Requires a query parameter **value** - double between `0.1` and `10`
