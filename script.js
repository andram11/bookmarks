const modal = document.getElementById('modal')
const modalShow= document.getElementById('show-modal')
const modalClose= document.getElementById('close-modal')
const bookmarkForm= document.getElementById('bookmark-form')
const websiteNameEl= document.getElementById('website-name')
const websiteUrlEl= document.getElementById('website-url')
const bookmarksContainer= document.getElementById('bookmarks-container')

let bookmarks= []

//Show modal, focus on input case
function showModal(){
    modal.classList.add('show-modal')
    websiteNameEl.focus()
}


//Modal event listeners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', ()=>modal.classList.remove('show-modal'))

//Window event listener in order to close modal whenever we click outside of it, on modal overlay/container
window.addEventListener('click', (e)=>(e.target=== modal ? modal.classList.remove('show-modal'): false))

//Validate form
function validate(nameValue, urlValue){
    const expression= /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    const regex= new RegExp(expression)
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields.')
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid url.')
        return false;
    }
    //Valid
    return true;
}


//Build bookmarks DOM
function buildBookmarks(){
    //Remove all bookmark elements
    bookmarksContainer.textContent= []
    //Build items
    bookmarks.forEach((bookmark)=> {
        const {name, url} = bookmark;
        // Item 
        const item= document.createElement('div')
        item.classList.add('item')
        //Close icon
        const closeIcon= document.createElement('i')
        closeIcon.classList.add('fas', 'fa-trash-can')
        closeIcon.setAttribute('title', 'Delete bookmark')
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
        //Favicon/Link container
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')
        //Favicon
        const favicon = document.createElement('img')
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}` )
        favicon.setAttribute('alt', 'Favicon')
        //Link
        const link= document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.textContent = name
        //Append to bookmarks container
        linkInfo.append(favicon, link)
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)
    }) 
}

//Retrieve bookmarks from local storage
function fetchBookmarks(){
    //Get bookmarks from local storage if available
    if (localStorage.getItem('bookmarks')){
        bookmarks= JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        //create bookmarks array in local storage
        bookmarks = [
            {
                name: "Google",
                url: "www.google.com",
            }
        ]
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
    }
    buildBookmarks()
}


//Delete bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i)=> {
        if (bookmark.url===url){
            bookmarks.splice(i, 1)

        }
    })
    //Update local storage bookmarks array, re-populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

//Handle data from form
function storeBookmark(e) {
    e.preventDefault()
    //Pull values from form
    const nameValue= websiteNameEl.value
    let urlValue = websiteUrlEl.value 
    if (!urlValue.includes('http://', 'https://')){
        urlValue=`https://${urlValue}`
    }
     if (!validate(nameValue, urlValue)) {
        return false;
     }
     const bookmark= {
        name: nameValue,
        url: urlValue,
     }
     bookmarks.push(bookmark)
     //Save bookmark to local storage
     localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
     fetchBookmarks()
     bookmarkForm.reset()
     websiteNameEl.focus()

}

//Event listener form submit
bookmarkForm.addEventListener('submit', storeBookmark)

//On load, fetch bookmarks
fetchBookmarks()