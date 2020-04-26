console.log('Setup');

import './main.scss'


document.getElementById('copy').onclick = () => {

  const inputLink = document.getElementById('inputLink').value;

  const matches = inputLink.match(/(https:\/\/)?instagram.com(\/p\/[0-9A-z]+)/)

  if (!matches) {
    console.log('No match! handle errors');
    alert('Please paste a valid instagram link in the input box. Thank you.');
    return
  }

  const url =`http://instagram.mikemjharris.com${matches[2]}`;
  document.getElementById('url').value = url;
  const clipboard = new ClipboardJS('#copyLink');

  clipboard.on('success', () => {
    console.log('success');
    document.getElementById('copied').classList.add('show');
  })

  document.getElementById('output').classList.add('show');

  const instaPath = matches[2];
  console.log('Fetching insta path ' + instaPath);
  fetch('/api/image-data' + instaPath)
  .then((data) => data.json())
  .then((data) => {
    document.getElementById('image').src = data.data.image;
    document.getElementById('title').innerHTML = data.data.description;
    const link = window.location.href + instaPath;
  })
};
