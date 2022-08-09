export const formatDate = (cmp) => {
    return cmp.value;
}

export const saveFile = async (item) => {
    console.log(item);
    window.eapi.saveFile(item)
        .then(status => console.log(status, null, 2))
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

// --------- Configuration: Add New Input ---------

export const addNewInput = (typeToAdd, includePlaceholder = true, index = 0) => {
    let input =  {
        "label": "",
        "index": index,
        "tooltip": "" 
    }

    if (includePlaceholder) {
        input.placeholder = "";
    }

    switch (typeToAdd) {
        case "input": 
            input.subs = {"sub1":"val1"}
            input.type = "input";
            break;
        case "select": 
            input.options = [{
                "label": "Option 1", 
                "value": "Value 1"
            }]
            input.type = "select";
            break;
        case "date": 
            input.type = "date";
            break;
    }
    
    return input; 
}

export const findNextAvailableIndex = (inputs) => {
    let indicies = Object.values(inputs).map((input) => {
        return input.index;
    })
    indicies.sort((a, b) => b - a);
    return new Number(indicies[0]) + 1;
}

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
