console.log('Setup');

import './main.scss'

document.getElementById('inputLink').value = "https://www.instagram.com/p/B_QAuXKHlJr/"
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
    document.getElementById('title').innerHTML = data.data.title;
    document.getElementById('decription').innerHTML = data.data.decription;
    const link = window.location.href + instaPath;
    document.getElementById('link').innerHTML = link;

  })
};


document.getElementById('copy').onclick = () => {

  const inputLink = document.getElementById('inputLink').value;

  const matches = inputLink.match(/(https:\/\/)?instagram.com(\/p\/[0-9A-z]+)/)

  const url =`http://instagram.mikemjharris.com${matches[2]}`;
  document.getElementById('url').value = url;
  new ClipboardJS('#copyLink');
};

function myFunction() {
  /* Get the text field */
    var copyText = document.getElementById("url");

  /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
      document.execCommand("copy");

        /* Alert the copied text */
          alert("Copied the text: " + copyText.value);
          }


