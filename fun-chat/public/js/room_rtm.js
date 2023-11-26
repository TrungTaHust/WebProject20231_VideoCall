//ông vẫn sửa giúp t khúc insert mấy cái html mjes

let handleMemberJoined = async (MemberId) => {//xử lí sk khi có thg tham gia call
    console.log('A new member has joined the room: ', MemberId)
    addMemberToDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)

    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDom(`Welcome to the room ${name}!`)
}

let addMemberToDom = async (MemberId) => {//thêm 1 thg vào danh sách ng onl khi nó tham gia call
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])

    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper"> 
                        <span class="green__icon"></span>  
                        <p class="member_name">${name}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML('beforeend', memberItem)
}

let updateMemberTotal = async (members) => {//tăng tổng số thg đang call hiện tại
    let total = document.getElementById('members__count')
    total.innerText = members.length
}

let handleMemberLeft = async (MemberId) => {//xử lí khi có thg thoát call
    removeMemberFromDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDom = async (MemberId) => {//xóa thg vừa thoát khỏi call
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    memberWrapper.remove()

    addBotMessageToDom(`${name} has left the room.`)

}

let getMembers = async () => {
    let members = await channel.getMembers()
    updateMemberTotal(members)
    for (let i = 0; members.length > i; i++) {
        addMemberToDom(members[i])
    }
}

let handleChannelMessage = async (messageData, MemberId) => {//xử lí khi có thg muốn gửi tin, hoặc bot gửi tin
    console.log('A new message was received')
    let data = JSON.parse(messageData.text)
    
    if(data.type === 'chat') {
        addMessageToDom(data.displayName, data.message)
    }

    if(data.type === 'user-left') {
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `user-container-${uid}`) {
            displayFrame.style.display = null
    
            for (let i = 0; videoFrames.length > i; i++) {
                videoFrames[i].style.height = '300px'
                videoFrames[i].style.width = '300px'
            }
        }
    }
}

let sendMessage = async (e) => {//gửi tin 
    e.preventDefault()

    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message': message, 'displayName': displayName})})
    addMessageToDom(displayName, message)
    e.target.reset()
}

let addMessageToDom = (name, message) => {//thêm tin vào danh sách chat hiện có
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage) {
        lastMessage.scrollIntoView()
    }
}


let addBotMessageToDom = (botMessage) => {// thêm tin từ bot vào danh sách chat có sẵn
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 Mumble Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage) {
        lastMessage.scrollIntoView()
    }
}

let leaveChannel = async () => {//rời call
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener('beforeunload', leaveChannel) //xử lí sự kiện rời call

let messageForm = document.getElementById('message__form')//sự kiện gửi tin
messageForm.addEventListener('submit', sendMessage)