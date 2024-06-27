

const username = document.querySelector('#username')
const message = document.querySelector('#message')
const button = document.querySelector('form button')
const messagesDiv = document.querySelector('tbody')

let str = ''
function renderMessages(messages) {

    // 清空旧的留言内容  
    messagesDiv.innerHTML = ''

    // 遍历留言列表并添加到DOM中  
    let result = messages.map(item => {
        return str = '' + `<tr id="${item.id}">
                    <td>${item.username}</td>
                    <td>${item.message}</td>
                    <td><button>删除</button></td>
                </tr>`
    });
    messagesDiv.innerHTML = result.join('')
}
axios({
    method: 'get',
    url: 'http://127.0.0.1:3000/messages',
}).then(result => {
    // console.log(result.data)
    const messages = result.data
    console.log(messages)

    renderMessages(messages)
})

button.addEventListener('click', (e) => {
    e.preventDefault()
    axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/messages',
        data: {
            username: username.value,
            message: message.value
        },
    }).then(result => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:3000/messages',
        }).then(result => {
            // console.log(result.data)
            const messages = result.data
            console.log(messages)

            renderMessages(messages)
        })
    }).catch(error => {
        console.error(error.request.response) // 应该会捕获到服务器返回的错误（如果有的话）  
        alert(error.request.response)
    })
})



messagesDiv.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.tagName === 'BUTTON') {
        const id = e.target.parentElement.parentElement.id
        console.log(id)
        axios({
            method: 'DELETE',
            url: `http://127.0.0.1:3000/messages/${id}`,
        }).then(result => {
            axios({
                method: 'get',
                url: 'http://127.0.0.1:3000/messages',
            }).then(result => {
                // console.log(result.data)
                const messages = result.data
                console.log(messages)

                renderMessages(messages)
            })
        }).catch(error => {
            console.error(error.request.response)// 应该会捕获到服务器返回的错误（如果有的话）  
            alert(error.request.response)
        })
    }
})