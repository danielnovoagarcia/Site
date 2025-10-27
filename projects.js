document.addEventListener('DOMContentLoaded', () => {
  const PROJECTS = {
    'aelys-martin': '1_LogosIdentite/AelysMartin.png',
    'ljr': '1_LogosIdentite/LJR.png',
    'dm': '4_Typo/DM.png',
    'this-too': '4_Typo/ThisToo.png',
    'x': '4_Typo/x.png',

    // --- Print ---
    'cinecivic': '3_Posters/Cinecivic.png',
    'fake-news': '3_Posters/FakeNews_Affiche.png',
    'geneva-pride-nye': '3_Posters/GenevaPride_NYE.png',
    'geneva-pride-ski': '3_Posters/GenevaPride_SkiParty.png',
    'le-signe': '3_Posters/LeSigne.png',
    'anemoia-ar': [
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique2.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique3.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique4.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique5.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique6.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique7.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique8.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique9.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique10.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique11.png',
      '2_EditionPrint/AnemoiaHotels_AR/AH_DossierAnalytique12.png'
    ],
    'geneva-pride-menu': '2_EditionPrint/GenevaPride_Menu.png',

    // --- Type ---
    'film-mono': [
      '4_Typo/FilmMono/1_FilmMono.png',
      '4_Typo/FilmMono/2_FilmMono_Texte.png'
    ],

    // --- Art ---
    'fp-pg': [
      '2_EditionPrint/FP_PG/1_FP_PG1.png',
      '2_EditionPrint/FP_PG/2_FP_PG2.png'
    ],
    'fp-sp': [
      '2_EditionPrint/FP_SP/1_FP_SG1.png',
      '2_EditionPrint/FP_SP/2_FP_SG2.png',
      '2_EditionPrint/FP_SP/3_FP_SG3.png'
    ],
    'hiv-body': [
      '2_EditionPrint/HIVAIDS_Body/1_HIVAIDS_B1.png',
      '2_EditionPrint/HIVAIDS_Body/2_HIVAIDS_B2.png'
    ],
    'hiv-portrait': [
      '2_EditionPrint/HIVAIDS_Portrait/1_HIVAIDS_P1.png',
      '2_EditionPrint/HIVAIDS_Portrait/2_HIVAIDS_P2.png'
    ],

    // --- Brand identity ---
    'anemoia-hotels': [
      '1_LogosIdentite/AnemoiaHotels/1_AH_Logo1.png',
      '1_LogosIdentite/AnemoiaHotels/2_AH_Logo2.png',
      '1_LogosIdentite/AnemoiaHotels/3_AH_Pap.png',
      '1_LogosIdentite/AnemoiaHotels/4_AH_Fiches.png',
      '1_LogosIdentite/AnemoiaHotels/5_AH_Poster1.png',
      '1_LogosIdentite/AnemoiaHotels/6_AH_Poster2.png',
      '1_LogosIdentite/AnemoiaHotels/7_AH_Poster3.png',
      '1_LogosIdentite/AnemoiaHotels/8_AH_Poster4.png',
      '1_LogosIdentite/AnemoiaHotels/9_AH_Poster5.png',
      '1_LogosIdentite/AnemoiaHotels/10_AH_Poster6.png'
    ],
    'at28': [
      '1_LogosIdentite/at28/1_at28_Logo.png' // ← seul élément
    ],
    'paris-og24': [
      '1_LogosIdentite/ParisOG24/1_JO_Logo.png',
      '1_LogosIdentite/ParisOG24/2_JO_Pictos.png',
      '1_LogosIdentite/ParisOG24/3_JO_Poster1.png',
      '1_LogosIdentite/ParisOG24/4_JO_Poster2.png',
      '1_LogosIdentite/ParisOG24/5_JO_Poster3.png',
      '1_LogosIdentite/ParisOG24/7_JO_Tickets.png',
      '1_LogosIdentite/ParisOG24/8_JO_Goodies1.png',
      '1_LogosIdentite/ParisOG24/9_JO_Goodies2.png'
    ]
  };

  function closeProject() {
    const viewer = document.querySelector('.project-viewer');
    if (viewer) viewer.innerHTML = '';
  }

  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-project]')) {
      const key = e.target.dataset.project;
      const config = PROJECTS[key];
      const viewer = document.querySelector('.project-viewer');
      if (!config || !viewer) return;

      viewer.innerHTML = '';

      if (Array.isArray(config) && config.length > 1) {
        let currentIndex = 0;
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';

        const closeX = document.createElement('div');
        closeX.className = 'ui-control close-x';
        closeX.textContent = 'x';
        closeX.onclick = closeProject;

        const prevArrow = document.createElement('div');
        prevArrow.className = 'ui-control prev-arrow';
        prevArrow.textContent = '<';

        const nextArrow = document.createElement('div');
        nextArrow.className = 'ui-control next-arrow';
        nextArrow.textContent = '>';

        const updateImage = () => { img.src = config[currentIndex]; };

        prevArrow.onclick = () => {
          currentIndex = (currentIndex - 1 + config.length) % config.length;
          updateImage();
        };
        nextArrow.onclick = () => {
          currentIndex = (currentIndex + 1) % config.length;
          updateImage();
        };

        viewer.appendChild(img);
        viewer.appendChild(closeX);
        viewer.appendChild(prevArrow);
        viewer.appendChild(nextArrow);
        updateImage();
      } else {
        const src = Array.isArray(config) ? config[0] : config;
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';

        const closeX = document.createElement('div');
        closeX.className = 'ui-control close-x';
        closeX.textContent = 'x';
        closeX.onclick = closeProject;

        viewer.appendChild(img);
        viewer.appendChild(closeX);
      }
      return;
    }

    if (!e.target.closest('.project-viewer') && !e.target.matches('[data-project]')) {
      if (document.querySelector('.project-viewer img')) closeProject();
    }
  });
});