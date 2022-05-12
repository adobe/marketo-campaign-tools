const checkThis = new Promise ((resolve, reject) => {
    setTimeout(() => {
        resolve('foo');
      }, 300);
})

const one = (tf, cf) => {
     checkThis
        .then(text => text + text)
        .then(text => tf(text))
}

one((text) => {
    console.log(`\n-------${text}--------\n`);
})