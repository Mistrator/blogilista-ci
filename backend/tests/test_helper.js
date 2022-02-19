const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    _id: '619df191114772605d3436ca',
    user: '619df191114772605d3436c7'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    _id: '619df191114772605d3436cb',
    user: '619df191114772605d3436c7'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    _id: '619df191114772605d3436cc',
    user: '619df191114772605d3436c7'
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    _id: '619df191114772605d3436cd',
    user: '619df191114772605d3436c7'
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    _id: '619df191114772605d3436ce',
    user: '619df191114772605d3436c8'
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    _id: '619df191114772605d3436cf',
    user: '619df191114772605d3436c8'
  }
]

const initialUsers = [
  {
    username: 'testuser',
    // bcrypt.hash("qwertyuiop", 10)
    passwordHash: '$2b$10$2E2LjidkrltDgaGt6i69hexNeZIrN03/qGU/1d5lMuDrIq70UOKjy',
    name: 'Test User',
    _id: '619df191114772605d3436c7',
    blogs: [
      '619df191114772605d3436ca',
      '619df191114772605d3436cb',
      '619df191114772605d3436cc',
      '619df191114772605d3436cd'
    ]
  },
  {
    username: 'otheruser',
    // bcrypt.hash("asdfghjkl", 10)
    passwordHash: '$2b$10$KIQm7B0YPixgEgJsj/cp5OyglqjrH9Hc13ciGOj9laJoS39x6qc0a',
    name: 'Other User',
    _id: '619df191114772605d3436c8',
    blogs: [
      '619df191114772605d3436ce',
      '619df191114772605d3436cf'
    ]
  }
]

const userPasswords = {
  'testuser': 'qwertyuiop',
  'otheruser': 'asdfghjkl'
}

const nonExistingId = async () => {
  const blog = new Blog({
    'title': 'a',
    'author': 'b',
    'url': 'c',
    'likes': 0
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, userPasswords, blogsInDb, usersInDb, nonExistingId
}
