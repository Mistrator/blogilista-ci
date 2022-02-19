const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
      id: 1
    })

  response.json(allBlogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body['title'] || !request.body['url']) {
    return response.status(400).end()
  }

  if (!request.body['likes']) {
    request.body['likes'] = 0
  }

  const user = request.user

  const blog = new Blog({
    user: user._id,
    ...request.body
  })

  const saveResult = await blog.save()

  // Populating the result of save() caused issues, so re-query and populate
  const queryResult = await Blog
    .findById(saveResult._id)
    .populate('user', {
      username: 1,
      name: 1,
      id: 1
    })

  user.blogs = user.blogs.concat(queryResult._id)
  await user.save()

  response.status(201).json(queryResult)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  // If the blog does not exist, we can't check ownership
  if (!blog) {
    return response.status(204).end()
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).end()
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).end()
  }

  const updatedBlog = {
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes
  }

  const result = await Blog
    .findByIdAndUpdate(request.params.id, updatedBlog,
      {new: true, runValidators: true, context: 'query'})
    .populate('user', {
      username: 1,
      name: 1,
      id: 1
    })

  if (!result) {
    response.status(404).end()
  }
  else {
    response.json(result)
  }
})

module.exports = blogsRouter
