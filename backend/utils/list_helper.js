const dummy = () => (1)

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => a + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  var curFavorite = null

  for (const blog of blogs) {
    if (!curFavorite || blog.likes > curFavorite.likes) {
      curFavorite = blog
    }
  }

  return curFavorite
}

const mostBlogs = (blogs) => {
  const blogCounts = {}
  var maxCount = 0
  var maxAuthor = null

  for (const blog of blogs) {
    if (!blogCounts[blog.author]) {
      blogCounts[blog.author] = 0
    }
    blogCounts[blog.author] += 1

    if (blogCounts[blog.author] > maxCount) {
      maxCount = blogCounts[blog.author]
      maxAuthor = blog.author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  const likeCounts = {}
  var maxCount = 0
  var maxAuthor = null

  for (const blog of blogs) {
    if (!likeCounts[blog.author]) {
      likeCounts[blog.author] = 0
    }
    likeCounts[blog.author] += blog.likes

    if (likeCounts[blog.author] > maxCount) {
      maxCount = likeCounts[blog.author]
      maxAuthor = blog.author
    }
  }

  return {
    author: maxAuthor,
    likes: maxCount
  }
}

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}
