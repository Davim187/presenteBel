const modal = document.getElementById('messageModal');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalBody = document.getElementById('modalBody');
const modalContent = document.getElementById('modalImgContainer');
const body = document.body;


const closeModal = document.querySelector('.modal-close');
const muralContainer = document.querySelector('.mural-grid');


const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const playIcon = document.getElementById('playIcon');
const challengeGate = document.getElementById('challenge-gate');
const challengePython = document.getElementById('challenge-python');
const muralSection = document.getElementById('mural-section');
const pythonButton = document.getElementById('unlock-python-button');
const pythonInput = document.getElementById('python-input');
const pythonError = document.getElementById('python-error');
const challengeFaith = document.getElementById('challenge-faith');
const faithButton = document.getElementById('unlock-faith-button');
const faithInput = document.getElementById('faith-input');
const faithError = document.getElementById('faith-error');

const modalVideoContainer = document.getElementById('modalVideoContainer');
const modalVideo = document.getElementById('modalVideo');
const modalAudioContainer = document.getElementById('modalAudioContainer');
const modalAudio = document.getElementById('modalAudio');

const respostasUsuario = {
  idUser: 1,
  pergunta1: '',
  resposta1: '',
  pergunta2: '',
  resposta2: ''
};



import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCyZyThR8sM4C47_8B_CV5PPKUXL9ZtEIM",
  authDomain: "desafio-html.firebaseapp.com",
  projectId: "desafio-html",
  storageBucket: "desafio-html.firebasestorage.app",
  messagingSenderId: "393654196456",
  appId: "1:393654196456:web:c1d444282142b36936115d",
  measurementId: "G-QJ17MTQHDN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


const idUserUnico = "1"
const docRef = doc(db, "respostas", idUserUnico);

let scrollTop = 0;

function bloquearScroll() {
  scrollTop = window.scrollY;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollTop}px`;
  document.body.style.width = '100%';
}

function liberarScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';

  window.scrollTo(0, scrollTop);
}


async function carregarCards() {
  try {
    const response = await fetch('./json/friends.json');
    const cardFriend = await response.json();
    
    cardFriend.forEach(card => {
      var extension = card.photo.split('.').pop()
      muralContainer.innerHTML += `
      <div
      class="friend-card"
      data-name="${card.name}"
      data-img-src="${card.photo}"
      data-message="${card.description}"
      data-video="${card.video || ''}"
      data-audio="${card.audio || ''}"
      >
      ${
        (extension === 'mp4' || extension === 'webm') ? `
        <video class="friend-video" src="${card.photo}" alt="Vídeo de ${card.name}" loop playsinline autoplay muted></video>
        ` : `<img
        class="friend-photo" 
        src="${card.photo}"
        alt="Foto de ${card.name}"
        />`
      }
      <div class="card-footer">
      <h4 class="friend-name">${card.name}</h4>
      <span class="open-message">Abrir Mensagem</span>
      </div>
      </div>
      `;
    });
    
    adicionarListenersDoModal();
  } catch (error) {
    console.error("Erro ao carregar os cards:", error);
  }
}

function adicionarListenersDoModal() {
  const cards = document.querySelectorAll('.friend-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const img = card.dataset.imgSrc;
      const message = card.dataset.message;
      const videoUrl = card.dataset.video;
      const audioUrl = card.dataset.audio
      var extension = card.dataset.imgSrc.split('.').pop()
      
      modalContent.innerHTML = `
      ${(extension === 'mp4' || extension === 'webm') ? `
        <video class="friend-video" src="${img}" alt="Vídeo do Amigo" loop playsinline autoplay muted></video>
        ` : `<img id="modalImg" src="${img}" alt="Foto do Amigo" />`}`
        modalName.textContent = name;
        // modalImg.src = img;
        modalBody.innerHTML = message;
        
        if (videoUrl && videoUrl.trim() !== "") {
          modalVideo.src = videoUrl;
          modalVideoContainer.style.display = 'block';
        } else {
          modalVideoContainer.style.display = 'none';
          modalVideo.src = '';
        }
        if (audioUrl && audioUrl.trim() !== "") {
          
          modalAudio.src = audioUrl;
          modalAudioContainer.style.display = 'block';
        } else {
          modalAudioContainer.style.display = 'none';
          modalAudio.src = '';
        }
        
        modal.style.display = 'block';
        bloquearScroll();



    });
  });
}


function fecharOModal() {
  modal.style.display = 'none';
  liberarScroll();



  modalBody.innerHTML = '';
  if (modalVideo) {
    modalVideo.src = '';
  }

  if (modalAudio) {
    modalAudio.pause();
    modalAudio.src = '';
  }
}


async function saltarResposta(respostasUsuario) {
  try {
    const docRef = doc(db, "respostas", respostasUsuario.idUser.toString());
    const docSnap = await getDoc(docRef);


    await setDoc(docRef, {
      idUser: 1,
      pergunta1: respostasUsuario.pergunta1,
      resposta1: respostasUsuario.resposta1,
      pergunta2: respostasUsuario.pergunta2,
      resposta2: respostasUsuario.resposta2,
      data: new Date().toISOString()
    });

    console.log("✅ Respostas salvas com sucesso!");
    alert("Desafio concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar respostas:", error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  
  const loading = document.createElement('div');
  loading.textContent = 'Carregando...';
  loading.style.textAlign = 'center';
  document.body.prepend(loading);

  challengeGate.style.display = 'none';
  muralSection.style.display = 'none';

  const docRef = doc(db, "respostas", "1");
  const docSnap = await getDoc(docRef);

  loading.remove();
  if (docSnap.exists()) {
    challengeGate.classList.add('hidden');
    muralSection.classList.remove('hidden');
    muralSection.style.display = 'block';
  } else {
    challengeGate.classList.remove('hidden');
    challengeGate.style.display = 'block';
  }

  carregarCards();
  if (playButton && audioPlayer && playIcon) {

    playButton.addEventListener('click', () => {
      console.log(audioPlayer.paused)
      if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
      } else {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
      }
    });

    audioPlayer.addEventListener('ended', () => {
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
    });
  }


  if (challengePython && pythonButton && pythonInput && challengeFaith) {

    pythonButton.addEventListener('click', () => {
      let resposta = pythonInput.value.trim().toLowerCase();

      if (resposta.includes('print')) {
        challengePython.classList.add('hidden');
        challengeFaith.classList.remove('hidden');

        respostasUsuario.pergunta1 = 'python';
        respostasUsuario.resposta1 = resposta;

      } else {
        pythonError.classList.remove('hidden');
      }
    });
  }

  if (challengeGate && muralSection && faithButton && faithInput) {

    faithButton.addEventListener('click', () => {
      let resposta = faithInput.value.trim().toLowerCase();

      resposta = resposta.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

      if (resposta.includes('comunhao') || resposta.includes('eucaristica')) {

        respostasUsuario.pergunta2 = 'faith';
        respostasUsuario.resposta2 = resposta;
        
        saltarResposta(respostasUsuario)
        
        challengeGate.classList.add('hidden');
        muralSection.classList.remove('hidden');
        
        setTimeout(() => {
          window.location.reload() 
        },2000)
        // console.log(respostasUsuario);
      } else {
        faithError.classList.remove('hidden');
      }
    });
  }

  if(closeModal) {
    closeModal.addEventListener('click', () => {
      fecharOModal();
    });
  }
  
});
