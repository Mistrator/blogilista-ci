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

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
    cy.visit('http://localhost:3003')
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
  })
})
