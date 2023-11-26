let form = document.getElementById('lobby__form')


//Lấy tên hiển thị có lưu sẵn trong sessionStorage, ông có thể thử thay bằng tên fb đã đăng nhập
let displayName = sessionStorage.getItem('display_name')
if(displayName) {
    form.name.value = displayName //gán nó vào trường form nhập
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    sessionStorage.setItem('display_name', e.target.name.value)

    let inviteCode = e.target.room.value
    if(!inviteCode) {
        inviteCode = String(Math.floor(Math.random() * 10000)) //nếu ko nhập tên phòng thì tạo ngẫu nhiên 1 id và truyền vào url để tạo phòng
    }
    window.location = `room.html?room=${inviteCode}` //chỗ này ông thay invite code thành id của gr chat ấy (lấy từ database), để khi người nào ấn call thì chỉ gr đấy mới vào dc
})