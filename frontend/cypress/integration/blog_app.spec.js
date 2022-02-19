describe('Blog app', function() {

  const testUser = {
    name: 'Test User',
    username: 'testuser',
    password: 'qwertyuiop'
  }

  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://localhost'
  }

  const otherBlog = {
    title: 'Other Blog',
    author: 'Other Author',
    url: 'http://example.com'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#loginbutton').click()

      cy.contains(`${testUser.name} logged in`)
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password + 'a')
      cy.get('#loginbutton').click()

      cy.contains('Failed to log in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login(testUser.username, testUser.password)
    })

    it('A blog can be created', function() {
      cy.get('.new-blog-form').contains('Show').click()

      cy.get('#title').type(testBlog.title)
      cy.get('#author').type(testBlog.author)
      cy.get('#url').type(testBlog.url)

      cy.get('#create-blog').click()

      cy.get('.bloglist').contains(testBlog.title)
      cy.get('.bloglist').contains(testBlog.author)
    })

    it('A blog can be liked', function() {
      cy.createBlog(testBlog)
      cy.contains(testBlog.title).parent().contains('Show').click()

      cy.get('.likes').contains('0')
      cy.get('.likes').contains('Like').click()
      cy.get('.likes').contains('1')
    })

    it('A blog can be deleted', function() {
      cy.createBlog(testBlog)
      cy.contains(testBlog.title).parent().contains('Show').click()
      cy.contains('Remove').click()
      cy.contains('Blog removed')
    })

    it('Blogs are sorted by likes', function() {
      cy.createBlog(testBlog)
      cy.createBlog(otherBlog)

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains('Show').click()
        cy.wrap(blogs[1]).contains('Show').click()
      })

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains(testBlog.title)
        cy.wrap(blogs[1]).contains(otherBlog.title)
        cy.wrap(blogs[1]).contains('Like').click()
      })

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).get('.likes').contains('1')
        cy.wrap(blogs[0]).contains(otherBlog.title)
      })
    })
  })
})
