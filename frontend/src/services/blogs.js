import axios from 'axios'
const baseUrl = '/api/blogs'

let headerToken = null

const setToken = (token) => {
  headerToken = `Bearer ${token}`
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: headerToken }
  }

  const res = await axios.post(baseUrl, newBlog, config)
  return res.data
}

const update = async (updatedBlog) => {
  const config = {
    headers: { Authorization: headerToken }
  }

  const res = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return res.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: headerToken }
  }

  const res = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return res.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { create, getAll, remove, setToken, update }
