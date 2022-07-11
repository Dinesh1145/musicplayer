const play = document.querySelector('#play');
const music = document.querySelector('audio');
const img = document.querySelector('img');
const title = document.querySelector('#title');
const artist = document.querySelector('#artist');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const music_list = document.querySelector('.music-list');
const closeBtn = document.querySelector('#close');
const showMoreBtn = document.querySelector('#moreMusic');

const progress_bar = document.querySelector('#progress_bar');
let total_duration = document.querySelector('#total_duration')
let curr_time = document.querySelector('#curr_time');

const progress_div = document.querySelector('#progress_div');


const songs = [
    {
        name: "aaj_din_chadheya",
        title: "Aaj Din Chadheya",
        artist: "Rahat fateh ali khan",
        img_src: "aaj_din_chadheya"
    },
    {
        name: "lamha_song",
        title: "Lamha",
        artist: "Antra mitra",
        img_src: "pagglait"
    },
    {
        name: "mehrama_song",
        title: "Mehrama",
        artist: "Darshan Raval",
        img_src: "aaj_din_chadheya"
    },
    {
        name: "thode_kam_ajnabi",
        title: "Thode Kam ajnabi",
        artist: "Himani Kapoor",
        img_src: "pagglait"
    }
]

let songIndex = 0;

const loadSong = (songs) => {
    music.src = `songs/${songs.name}.mp3`;
    img.src = `images/${songs.img_src}.jpg`;
    title.textContent = `${songs.title}`;
    artist.textContent = `${songs.artist}`;
}
loadSong(songs);

window.addEventListener('load', () => {
    loadSong(songs[songIndex]);
    playingNow();
})
///////////////////////////// -----------progress-bar----------/////////////////////////////////////

music.addEventListener('timeupdate', (event) => {

    let { currentTime, duration } = event.target;
    let progress_pertg = (currentTime / duration) * 100;
    progress_bar.style.width = `${progress_pertg}%`;

    // -----------adding duration ----------

    let min_duration = Math.floor(duration / 60);
    let sec_duration = Math.floor(duration % 60);
    if (sec_duration < 10) {
        sec_duration = `0${sec_duration}`;
    }
    if (duration) {
        total_duration.textContent = `${min_duration}:${sec_duration}`;
    }

    //---------currenttime----------
    let min_currentTime = Math.floor(currentTime / 60);
    let sec_currentTime = Math.floor(currentTime % 60);
    if (sec_currentTime < 10) {
        sec_currentTime = `0${sec_currentTime}`;
    }
    if (currentTime) {
        curr_time.textContent = `${min_currentTime}:${sec_currentTime}`;
    }
})
//-----onclick progress bar changing the music --------

progress_div.addEventListener('click', (event) => {
    // console.log(event);
    const songduration = music.duration;
    const move_prog_bar = (event.offsetX / progress_div.clientWidth) * songduration;
    // console.log(move_prog_bar);
    music.currentTime = move_prog_bar;
    playButton();
})


////////// play and pause button functon///////////////

let isPlaying = false;

playButton = () => {
    isPlaying = true;
    music.play();
    img.classList.add('anime')
    img.classList.remove('paused')
    play.classList.replace('fa-play', 'fa-pause');
}
pauseButton = () => {
    isPlaying = false;
    music.pause();
    img.classList.remove('anime')
    // img.classList.replace('anime', 'paused')
    img.classList.add('paused')
    play.classList.replace('fa-pause', 'fa-play');
}

play.addEventListener('click', () => {
    isPlaying ? pauseButton() : playButton();
})

///////////forward and backward functionality/////////
// ------------------on clicking next button-----------------
const nextSong = () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playButton()
    playingNow();
}
next.addEventListener('click', nextSong);
// ----------------------- on clicking prev button------------------
const prevSong = () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playButton();
    playingNow();
}

prev.addEventListener('click', prevSong);

//-------------repeat button functionality----------------

const repeat_plist = document.querySelector('#repeat_plist');

//  console.log(repeat_plist);

repeat_plist.addEventListener('click', () => {

    let getText = repeat_plist.innerText;//getting the inner text of the icon.
    //we will use switch case to change the icons 
    switch (getText) {
        case "repeat": // if its repeat than we have change it into repeat_one icon
            repeat_plist.innerText = "repeat_one";
            repeat_plist.setAttribute("title", "looped song")
            break;
        case "repeat_one":
            repeat_plist.innerText = "shuffle";
            repeat_plist.setAttribute("title", "shuffle song")
            break;
        case "shuffle":
            repeat_plist.innerText = "repeat";
            repeat_plist.setAttribute("title", "repeat song")
            break;
    }

})

//----------for automatic song when song is finished according to user selected the repeat button---------

music.addEventListener('ended', () => {
    let getText = repeat_plist.innerText;//getting the inner text of the icon.
    switch (getText) {
        case "repeat":
            nextSong();
            playingNow();
            break;
        case "repeat_one":
            music.currentTime = 0;
            loadSong(songs[songIndex]);
            playButton();
            break;
        case "shuffle":
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (songIndex == randomIndex);//checking the song index it shouldn't be same.
            //  console.log(randomIndex);
            songIndex = randomIndex;
            loadSong(songs[songIndex]);
            playButton();
            playingNow();
            break;
    }

})

////--------------show more button functionallity--------------.////

showMoreBtn.addEventListener('click', () => {
    music_list.classList.add('show');
})

closeBtn.addEventListener('click', () => {
    music_list.classList.remove('show');
})


const ulTag = document.querySelector("ul");
// making li of our array length

for (let i = 0; i < songs.length; i++) {
    let liTag = `
               <li li-index="${i}">
                   <div class="row">
                      <span>${songs[i].title}</span>
                      <p>${songs[i].artist}</p>
                   </div>
                   <audio src="songs/${songs[i].title}.mp3" class="liAudioDur${i}"></audio>
                 <span id="songDuration${i}" class="songDuration">5.17</span>
               </li>`;

    ulTag.insertAdjacentHTML("beforeend", liTag);

    const liAudioTag = document.querySelector(`#songDuration${i}`);
    const liAudioDur = document.querySelector(`.liAudioDur${i}`);

    // console.log(liAudioTag);
    // console.log(liAudioDur);

    liAudioDur.addEventListener("loadeddata", () => {
        let audioDuration = liAudioDur.duration;
        // console.log(audioDuration)
        let min_audioDuration = Math.floor(audioDuration / 60);
        let sec_audioDuration = Math.floor(audioDuration % 60);
        if (sec_audioDuration < 10) {
            sec_audioDuration = `0${sec_audioDuration}`;
        }
        liAudioTag.innerText = `${min_audioDuration}:${sec_audioDuration}`;
        liAudioTag.setAttribute('t-duration', `${min_audioDuration}:${sec_audioDuration}`)
    })

}
//  now onclick calling play that music 

const allLiTag = document.querySelectorAll("li");

// console.log(allLiTag)
function playingNow() {
    for (let j = 0; j < allLiTag.length; j++) {
        console.log(songIndex)
        var audioTag = allLiTag[j].querySelector(`#songDuration${j}`)
        // let audioDur = allLiTag[j].querySelector(`.liAudioDur${j}`)
        // console.log(audioDur)
        if (allLiTag[j].classList.contains("playing" || "stop") && allLiTag[j].getAttribute("li-index") == songIndex) {
            audioTag.innerText = "stop";

        } else if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            const audioDur = audioTag.getAttribute('t-duration');
            audioTag.innerText = audioDur;
        } else if (allLiTag[j].getAttribute("li-index") == songIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = 'playing';
        }
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}
function clicked(element) {
    console.log(element)
    const getIndex = element.getAttribute("li-index");
    songIndex = getIndex;
    loadSong(songs[songIndex]);
    // if(element.innerText="playing"){
    //     playButton();
    // }else if(element.innerText="stop"){
    //     pauseButton();
    //     element.innerText="playing";
    // }
    playingNow();
}


