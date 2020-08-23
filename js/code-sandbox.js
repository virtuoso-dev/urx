function compress(input) {
  return LZString.compressToBase64(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}

function getParameters(parameters) {
  return compress(JSON.stringify(parameters))
}

window.addEventListener('load', function() {
  document.querySelectorAll('.prism-code').forEach(snippet => {
    var button = document.createElement('button')
    button.className = 'open-in-sandbox'
    button.appendChild(document.createTextNode('Open Sandbox'))
    snippet.parentNode.insertBefore(button, snippet)

    button.addEventListener('click', function() {
      fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          files: {
            'package.json': {
              content: {
                dependencies: {
                  react: 'latest',
                  'react-dom': 'latest',
                },
              },
            },
            'example.ts': {
              content: snippet.innerText,
            },
            'index.html': {
              content: '<div id="root"></div>',
            },
          },
        }),
      })
        .then(x => x.json())
        .then(data => {
          window.open(`https://codesandbox.io/s/${data.sandbox_id}?file=/example.ts`, '_blank')
        })
    })
  })
})
