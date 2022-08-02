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
            // window.open(result);
            let a = document.createElement('a');
            a.href = result;
            a.download = file === "entries" ? "url-exports.csv" : "configuration-export.json";
            a.click();
        })
        .catch(err => console.log(err));
}

// ------ FORM HANDLING: OPTIONS ------ /

export const removeOption = ((ref, inputs, k, i) => {
    inputs[k].options.splice(i, 1);
    ref = inputs;  
})

export const addNewOption = ((ref, inputs, key) => {
    inputs[key].options[inputs[key].options.length++] = {
        "label": "new option", 
        "value": ""
    }
    ref = inputs; 
})

export const handleOptsKeyUpdate = ((ref, inputs, detail) => {
    // e.detail.value, e.detail.key, e.detail.input, e.detail.index
    detail.input.options[detail.index].label = detail.value;
    inputs[detail.key] = detail.input;
    ref = inputs;
})

export const handleOptsValueUpdate = ((ref, inputs, detail) => {
    detail.input.options[detail.index].value = detail.value;
    inputs[detail.key] = detail.input;
    ref = inputs;
 })

 // ------ FORM HANDLING: SUBSTITUIONS ------ /
export const handleSubsKeyUpdate = ((ref, inputs, e, key, input, sub) => {
    input.subs[e.target.value] = input.subs[sub];
    delete input.subs[sub];
    inputs[key] = input;
    ref = inputs;
})

export const handleSubsValueUpdate = ((ref, inputs, e, key, input, sub) => {
    input.subs[sub] = e.target.value;
    inputs[key] = input;
    ref = inputs;
})

export const addNewSub = ((ref, inputs, key) => {
    let input = inputs[key];
    input.subs["newSub"] = "";
    inputs[key] = input;
    ref = inputs;
});

export const removeSub = ((ref, inputs, k, s) => {
    let input = inputs[k];
    delete input.subs[s];
    inputs[k] = input;
    ref = inputs;
});

export const sortObject = ((obj) => Object.fromEntries(Object.entries(obj).sort(([,a],[,b]) => a.index - b.index)));

// --------- URL Tables / Detail Handling ---------

export const addNewRow = (entries, builderFields) => {
    
    let nextIndex = Object.keys(entries).length + 1;
    let entry = {
        index: nextIndex,
        url: '',
        values: {}
    };
    Object.keys(builderFields).forEach((key) => {
        entry.values[key] = '';
    });
    entries[nextIndex.toString()] = entry;
    
    return entries;
}
