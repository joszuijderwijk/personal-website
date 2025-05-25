document.addEventListener('DOMContentLoaded', function () {
  const img = document.querySelector('.profile img');
  const source = document.querySelector('.responsive-img-srcset');

  if (!img || !source) return;

  const image1 = '/assets/img/pf.jpg';
  const image2 = '/assets/img/pf-lego.png'; // alternate image
  const sound = new Audio('/assets/sound/click.mp3');
  let toggled = false;

  img.addEventListener('dblclick', () => {
    const currentImg = toggled ? image1 : image2;

    // Update img src and source srcset
    img.src = currentImg;
    source.srcset = currentImg;

    // Toggle state
    toggled = !toggled;

    // Play sound
    sound.currentTime = 0;
    sound.play();
  });
});
