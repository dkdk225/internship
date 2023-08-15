console.log('this runs on client')

window.onload = (e)=>{
    console.log(window.location.origin)
    const submit = document.querySelector('button[type="submit"]')
    submit.addEventListener('click', (e)=>{
        e.preventDefault()
        xhr('POST', '/login')
    })
}