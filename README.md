# Blog API 📚
Write and read articles!

## Features

1. User can create an account and have a profile.
2. User can view other users profile.
3. User can create articles.
4. User can read articles from other authors.
5. User can follow and unfollow other users.
6. User can favourite and unfavourite an article.
7. User can comment and delete comment from an article.
8. Users have a feed of the articles written by other users they follow.

## Technologies Used

1. Node.js
2. Express.js
3. MongoDB

### Installation

- Make sure you have `nodejs` and `mongodb` installed.

- Clone repo

  ```bash
    - git clone https://github.com/femicodes/blog-api.git
    - cd blog-api
    - yarn install
  ```


### API ENDPOINTS

#### Authentication

| URI                              | HTTP Method | Description       |
| -------------------------------- | ----------- | ----------------- |
| <code>/api/v1/auth/signup</code> | `POST`      | Create an account. |
| <code>/api/v1/auth/login</code> | `POST`      | Log in to an account. |

#### API Routes

| URI                                                     | HTTP Method | Description                               |
| ------------------------------------------------------- | ----------- | ----------------------------------------- |
| <code>/api/v1/feed</code>                              | `GET`       | List of articles written by authors a user follows.                         |
| <code>/api/v1/profile/:username</code>                      | `GET`       | Get a user's profile by username.              |
| <code>/api/v1/profile</code>                         | `PUT`       | Edit user profile.                 |
| <code>/api/v1/:username/follow</code>                             | `POST`       |   Follow another user by username.                        |
| <code>/api/v1/:username/unfollow</code>                         | `POST`       | Unfollow another user by username.                 |
| <code>/api/v1/articles</code> | `GET`       | Fetch all articles |
| <code>/api/v1/articles</code> | `POST`       | Create an article. |
| <code>/api/v1/articles/:slug</code> | `GET`       | Get article by slug. |
| <code>/api/v1/articles/:id</code> | `DELETE`       | Delete article by id. |
| <code>/api/v1/articles/:article/comments</code> | `POST`       | Add comment by article id. |
| <code>/api/v1/articles/comments/:comment</code> | `DELETE`       | Delete article comment by comment id. |
| <code>/api/v1/:article/favourite</code> | `POST`       | Favourite an article by article id. |
| <code>/api/v1/:article/unfavourite</code> | `POST`       | Unfavourite an article by article id. |