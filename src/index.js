console.log('Setup');

import './main.scss'

document.getElementById('preview').onclick = () => {

  const inputLink = document.getElementById('inputLink').value;

  const matches = inputLink.match(/(https:\/\/)?instagram.com(\/p\/[0-9A-z]+)/)

  if (!matches) {
    console.log('No match! handle errors');
    return
  }
  const instaPath = matches[2];
  console.log('Fetching insta path ' + instaPath);
  fetch('/api/image-data' + instaPath)
  .then((data) => data.json())
  .then((data) => {
    document.getElementById('image').src = data.data.image;
    document.getElementById('title').innerHTML = data.data.description;
    const link = window.location.href + instaPath;
    document.getElementById('link').innerHTML = link;

  })
};
