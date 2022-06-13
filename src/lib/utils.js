export const formatDate = (cmp) => {
    return cmp.value;
}

export const downloadFile = async (file) => {
    let fn;
    switch (file) {
        case "entries":
            fn = window.eapi.exportEntries;
            break;
        case "config": 
            fn = window.eapi.exportConfig;
            break;
    }
    fn()
        .then((result) => {
            console.log(`Received ${result}`);
            window.open(result);
        })
        .catch(err => console.log(err));
}