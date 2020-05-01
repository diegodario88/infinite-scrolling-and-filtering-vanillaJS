const POSTURL = 'https://jsonplaceholder.typicode.com/posts?_limit=5&_page='
const elementPosts = document.getElementById('posts-container')
const elementLoader = document.getElementById('loader')
const elementSearch = document.getElementById('filter')
const handleLoader = {
  show: () => elementLoader.classList.add('show'),
  hide: () => {
    setTimeout(() => {
      elementLoader.classList.remove('show')
      getNextPosts()
    }, 1000)
  }
}

let page = 1

const getPosts = async (page) => {
  try {
    const response = await window.fetch(`${POSTURL}${page}`)
    return response.json()
  } catch (error) {
    console.log(`something wrong 😢 ${error}`)
  }
}

const renderPosts = ({ id, title, body }) => {
  return `
  <div class="post">
    <div class="number">${id}</div>
    <div class="post-info">
      <h2 class="post-title">${title}</h2>
      <p class="post-body">${body}</p>
    </div>
  </div>
`
}

const addPostsIntoDOM = async () => {
  const posts = await getPosts(page)
  const postsTemplate = posts.map(renderPosts).join('')

  elementPosts.innerHTML += postsTemplate
}

const showPostIfMatchInputValue = (item, text) => {
  const postTitle = item.querySelector('.post-title').textContent
  const postBody = item.querySelector('.post-body').textContent
  const postsCotainsInputValue = postTitle
    .includes(text) || postBody.includes(text)

  if (postsCotainsInputValue) {
    item.style.display = 'flex'
    return
  }
  item.style.display = 'none'
}

const filterPosts = (text) => {
  const posts = document.querySelectorAll('.post')
  posts.forEach(item => showPostIfMatchInputValue(item, text))
}

const debounceEvent = (fn, wait = 1000, time) => (...args) =>
  clearTimeout(time, time = setTimeout(() => fn(...args), wait))

const handleKeyUp = (event) => {
  const inputValue = event.target.value
  filterPosts(inputValue)
}

const getNextPosts = () => {
  setTimeout(() => {
    page++
    addPostsIntoDOM()
  }, 300)
}

const handleScrollAction = () => {
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement
  const isPageAlmostReached = (clientHeight + scrollTop) >= (scrollHeight - 10)
  if (isPageAlmostReached) {
    handleLoader.show()
    handleLoader.hide()
  }
}

addPostsIntoDOM()

window.addEventListener('scroll', handleScrollAction)

elementSearch.addEventListener('input', debounceEvent(handleKeyUp, 500))
