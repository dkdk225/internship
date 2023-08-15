function xhr (method, url) {
    console.log(window.location)
    if(/^\//.test())
        url = window.location.origin + url

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`)
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = xhr.responseText;
                console.log(response);
                localStorage.setItem('token', response)
            } else {
                console.error('Error:', xhr.status);
            }
        }
    };

    xhr.send();


}


