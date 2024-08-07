const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},

    // (1/2) Uncomment the line below to use localStorage
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name: "Cánh hoa tàn",
            singer: "Hương Tràm",
            path: "./asset/mp3/CanhHoaTan.mp3",
            image: "./asset/img/CanhHoaTan.jpg"
        },
        {
            name: "Đã sai từ lúc đầu",
            singer: "Trung Quân Idol X Bùi Anh Tuấn",
            path: "./asset/mp3/DaSaiTuLucDau.mp3",
            image: "./asset/img/DaSaiTuLucDau.jpg"
        },
        {
            name: "Mùa hè tuyệt vời",
            singer: "Đức Phúc",
            path: "./asset/mp3/MuaHeTuyetVoi.mp3",
            image: "./asset/img/MuaHeTuyetVoi.jpg"
        },
        {
            name: "Như phút ban đầu",
            singer: "Noo Phước Thịnh",
            path: "./asset/mp3/NhuPhutBanDau.mp3",
            image: "./asset/img/NhuPhutBanDau.jpg"
        },
        {
            name: "Nỗi nhớ đầy vơi",
            singer: "Noo Phước Thịnh",
            path: "./asset/mp3/NoiNhoDayVoi.mp3",
            image: "./asset/img/NoiNhoDayVoi.jpg"
        },
        {
            name: "Tình nào không như tình đầu",
            singer: "Trung Quân Idol",
            path: "./asset/mp3/TinhNaoKhongNhuTinhDau.mp3",
            image: "./asset/img/TinhNaoKhongNhuTinhDau.jpg"
        },
        {
            name: "Từ chối nhẹ nhàng thôi",
            singer: "Bích Phương X Phúc Du",
            path: "./asset/mp3/TuChoiNheNhangThoi.mp3",
            image: "./asset/img/TuChoiNheNhangThoi.jpg"
        },
        {
            name: "Anh tự do nhưng cô đơn",
            singer: "Trung Quân Idol",
            path: "./asset/mp3/AnhTuDoNhungCoDon.mp3",
            image: "./asset/img/AnhTuDoNhungCoDon.jpg"
        },
        {
            name: "Tự sự",
            singer: "Orange",
            path: "./asset/mp3/TuSu.mp3",
            image: "./asset/img/TuSu.jpg"
        },
        {
            name: "Ưóc mơ của mẹ",
            singer: "Văn Mai Hương",
            path: "./asset/mp3/UocMoCuaMe.mp3",
            image: "./asset/img/UocMoCuaMe.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const html = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" >
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            
            `
        })
        playlist.innerHTML = html.join('')

    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function (){
        const _this = this;
        const cdWidth = cd.offsetWidth;


        // Xử lý CD quay / dừng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        //Xử lý phóng to, thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //Xử lý khi click nút play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
              audio.pause();
            } else {
              audio.play();
            }

        };

        // Khi song được play
        // When the song is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        // When the song is pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };


        // Khi tiến độ bài hát thay đổi
        // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
            }
        };

        // Xử lý khi tua song
        // Handling when seek
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        // When next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
            _this.playRandomSong();
            } else {
            _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            
        };

        // Khi prev song
        // When prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
            _this.playRandomSong();
            } else {
            _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            
        };


        // Xử lý bật / tắt random song
        // Handling on / off random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
            
        };

        // Xử lý lặp lại một song
        // Single-parallel repeat processing
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        // Handle next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        // Listen to playlist clicks
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
    
            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex=Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
        
                // Xử lý khi click vào song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {
                }
            }
        };
        

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
    
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start:function(){
        // Gán cầu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);

    }

}

app.start();

