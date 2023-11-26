const APP_ID = "e0a1488513e6494f9e821ed78b4fa797"; //cái này là key để dùng dịch vụ của nó thôi

let uid = sessionStorage.getItem("uid");
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", uid);
}

//file này cũng ko có gì nhiều cần chú ý lắm
let token = null;
let client;

let rtmClient;
let channel;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString); //chỗ này liên quan đến url tên phòng ấy
let roomId = urlParams.get("room");

if (!roomId) {
  roomId = "main";
}

let displayName = sessionStorage.getItem("display_name"); //khúc này là nếu chưa có tên thì phải quay về lobby để nhập tên
/*if(!displayName) {
    window.location = 'lobby.html'
}*/
//vì mình chuyển sang đăng nhập bằng fb r, nên khúc này tôi đang để comment, ông có thể chỉnh thành gán displayName bằng giá trị tên hiển thị trong database

let localTracks = [];
let remoteUsers = {};

let localScreenTracks;
let sharingScreen = false;

let joinRoomInit = async () => { //hàm khởi tạo để bắt đầu vào phòng chat
  rtmClient = await AgoraRTM.createInstance(APP_ID);
  await rtmClient.login({ uid, token });

  await rtmClient.addOrUpdateLocalUserAttributes({ name: displayName });

  channel = await rtmClient.createChannel(roomId);
  await channel.join();

  channel.on("MemberJoined", handleMemberJoined);
  channel.on("MemberLeft", handleMemberLeft);
  channel.on("ChannelMessage", handleChannelMessage);

  getMembers();//Các khúc phía trên dòng này chắc ko cần sửa j đâu
  addBotMessageToDom(`Welcome to the room ${displayName}!`); //Thêm thông báo của con bot khi có người mới vào, displayName là tên hiển thị ông lấy từ db nhé, còn ko dùng thì bỏ dòng này đi

  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await client.join(APP_ID, roomId, token, uid);

  client.on("user-published", handleUserPublished);//gọi các hàm khi có người tham gia
  client.on("user-left", handleUserLeft);// hoặc rời đi
};

let joinStream = async () => {
  document.getElementById("join-btn").style.display = "none"; //nếu ấn join stream r thì cái nút join stream sẽ ẩn (none)
  document.getElementsByClassName("stream__actions")[0].style.display = "flex";

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks( //vẫn là hàm của hệ thống
    {},
    {
      encoderConfig: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
    }
  );

  let player = `<div class="video__container" id = "user-container-${uid}">
                    <div class = "video-player" id = "user-${uid}"></div> 
                </div>`;//đây là khúc t chưa biết sửa như nào này

  document
    .getElementById("streams__container")
    .insertAdjacentHTML("beforeend", player); //cái player này sẽ được thêm vào dom, tức là có cái khung video tròn khi call ấy
  document
    .getElementById(`user-container-${uid}`)
    .addEventListener("click", expandVideoFrame); //đây là khi ấn vào cái khung thì nó ra toàn cái hộp chữ nhật lớn để hiển thị video to hơn, kiểu xem stream ấy

  localTracks[1].play(`user-${uid}`);// 2 dòng này là điều khiển cam mic
  await client.publish([localTracks[0], localTracks[1]]); //2 dòng này là điều khiển cam mic
};

let switchToCamera = async () => {
  let player = `<div class="video__container" id = "user-container-${uid}">       
                    <div class = "video-player" id = "user-${uid}"></div>
                </div>`; //nói chung mấy khúc player này t chưa nghĩ ra cách giải quyết như nào để thêm vào cái dom bằng insert html
  displayFrame.insertAdjacentHTML("beforeend", player);

  await localTracks[0].setMuted(true);
  await localTracks[1].setMuted(true);

  document.getElementById("mic-btn").classList.remove("active");
  document.getElementById("screen-btn").classList.remove("active");

  localTracks[1].play(`user-${uid}`);
  await client.publish([localTracks[1]]);
};

let handleUserPublished = async (user, mediaType) => { //hàm này là khi có thg mới tham gia call
  remoteUsers[user.uid] = user;

  await client.subscribe(user, mediaType);

  let player = document.getElementById(`user-container-${user.uid}`);
  if (player === null) {
    player = `<div class="video__container" id = "user-container-${user.uid}">
                    <div class = "video-player" id = "user-${user.uid}"></div>
                </div>`;//tiếp tục xử lí mấy cái html của thg player này thôi

    document
      .getElementById("streams__container")
      .insertAdjacentHTML("beforeend", player);
    document
      .getElementById(`user-container-${user.uid}`)
      .addEventListener("click", expandVideoFrame);
  }

  //mấy câu if dưới đây là để chỉnh giao diện tương ứng

  if (displayFrame.style.display) {
    let videoFrame = document.getElementById(`user-container-${user.uid}`);
    videoFrame.style.height = "100px";
    videoFrame.style.width = "100px"; //chỉnh kích thước khung video tròn
  }

  if (mediaType === "video") {
    user.videoTrack.play(`user-${user.uid}`);//chạy video và bên dưới là chạy audio
  }

  if (mediaType === "audio") {
    user.audioTrack.play(`user-${user.uid}`);
  }
};

let handleUserLeft = async (user) => { //gọi hàm này khi có thg rời call
  delete remoteUsers[user.uid];
  let item = document.getElementById(`user-container-${user.uid}`);
  if (item) {
    item.remove();
  }

  if (userIdInDisplayFrame === `user-container-${user.uid}`) {
    displayFrame.style.display = null;

    let videoFrames = document.getElementsByClassName("video__container");

    for (let i = 0; videoFrames.length > i; i++) {
      videoFrames[i].style.height = "300px";
      videoFrames[i].style.width = "300px";
    }
  }
};

let toggleCamera = async (e) => { //hàm bật camera
  let button = e.currentTarget;

  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    button.classList.add("active");
  } else {
    await localTracks[1].setMuted(true);
    button.classList.remove("active");
  }
};

let toggleMic = async (e) => { //bật mic
  let button = e.currentTarget;

  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    button.classList.add("active");
  } else {
    await localTracks[0].setMuted(true);
    button.classList.remove("active");
  }
};

let toggleScreen = async (e) => { //bật share màn
  let screenButton = e.currentTarget;
  let cameraButton = document.getElementById("camera-btn");

  if (!sharingScreen) {
    sharingScreen = true;

    screenButton.classList.add("active");
    cameraButton.classList.remove("active");
    cameraButton.style.display = "none";

    localScreenTracks = await AgoraRTC.createScreenVideoTrack();

    document.getElementById(`user-container-${uid}`).remove();
    displayFrame.style.display = "block";

    let player = `<div class="video__container" id = "user-container-${uid}">
                        <div class = "video-player" id = "user-${uid}"></div>
                    </div>`; //tiếp tục xử lí mấy thg player

    displayFrame.insertAdjacentHTML("beforeend", player);
    document
      .getElementById(`user-container-${uid}`)
      .addEventListener("click", expandVideoFrame);

    userIdInDisplayFrame = `user-container-${uid}`;
    localScreenTracks.play(`user-${uid}`);

    await client.unpublish([localTracks[1]]);
    await client.publish([localScreenTracks]);

    //dưới đây chỉ là chỉnh giao diện khi share màn bật/tắt

    let videoFrames = document.getElementsByClassName("video__container");
    for (let i = 0; videoFrames.length > i; i++) {
      if (videoFrames[i].id != userIdInDisplayFrame) {
        videoFrames[i].style.height = "100px";
        videoFrames[i].style.width = "100px";
      }
    }
  } else {
    sharingScreen = false;
    cameraButton.style.display = "block";
    document.getElementById(`user-container-${uid}`).remove();
    await client.unpublish([localScreenTracks]);

    switchToCamera();
  }
};

let leaveStream = async (e) => { //nếu rời stream, ông vẫn ở trong call. Nhưng khi ấy không thể xem ngta gọi dc. Muốn trở lại thì ấn lại vào cái nút join stream
  e.preventDefault();

  document.getElementById("join-btn").style.display = "block"; //lúc này thì hiển thị lại cái nút join stream
  document.getElementsByClassName("stream__actions")[0].style.display = "none";

  for (let i = 0; localTracks.length > i; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }

  await client.unpublish([localTracks[0], localTracks[1]]);

  if (localScreenTracks) {
    await client.unpublish([localScreenTracks]);
  }

  document.getElementById(`user-container-${uid}`).remove();

  if (userIdInDisplayFrame === `user-container-${uid}`) {
    displayFrame.style.display = null;

    for (let i = 0; videoFrames.length > i; i++) {
      videoFrames[i].style.height = "300px";
      videoFrames[i].style.width = "300px";
    }
  }

  channel.sendMessage({
    text: JSON.stringify({ type: "user-left", uid: uid }),
  });
};

//khúc dưới này là gọi hàm tương ứng khi có click tương ứng
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);
document.getElementById("screen-btn").addEventListener("click", toggleScreen);
document.getElementById("join-btn").addEventListener("click", joinStream);
document.getElementById("leave-btn").addEventListener("click", leaveStream);


//hàm auto được gọi khi tham gia call
joinRoomInit();
