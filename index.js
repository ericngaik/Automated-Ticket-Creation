const fs = require('fs');

// function to read a json file
function jsonReader(filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
    try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
    } catch (err) {
        return cb && cb(err);
    }
});
}

// funtion to check if the element is a stop word
function checker(value) {
    // a list of words that can make into a ticket
    // the method is still brute forced and the list 
    // needs as much words as possible
    // also words such as "no" or "not" needs to be 
    // in a different list
    const stop_words = ['light', 'broken', 'hallway', 'stair', 'case', 
                        'dirty', 'noisy', 'neighbour', 'no', 'hot', 
                        'water', 'elevator', 'not', 'working'];
  
    for (let i = 0; i < stop_words.length; i++) {
      if (value.indexOf(stop_words[i]) > -1) {
        return true;
      }
    }
    return false;
  }


jsonReader('./testScenario.json', (err, data) => {
    if(err) {
        console.log(err);
    } else {
        // storing information from the messages into an object with
        // phone numbers as keys and the stop words as values
        let obj = {};
        for(let i = 0; i < data.length; i++) {
            let message_arr = data[i].messageContent.split(" ");
            message_arr = message_arr.filter(checker);
            if(message_arr.length != 0) {
                if(obj[data[i].telFrom] == null) {
                    
                    obj[data[i].telFrom] = new Array();
                }
                obj[data[i].telFrom].push(message_arr);
            }
        }

        console.log(obj);

        for(let i = 0; i < data.length; i++) {
            if(obj[data[i].telFrom] != null) {
                obj[data[i].telFrom] = obj[data[i].telFrom].toString();
                obj[data[i].telFrom] = obj[data[i].telFrom].replaceAll(",", " ");
            }
        }

        let key = "";

        for(let i = 0; i < data.length; i++) {
            key = "telfrom: " + data[i].telFrom;
            if(obj[key] == null) {
                obj[key] = obj[data[i].telFrom];
                delete obj[data[i].telFrom];
            }
        }

        fs.writeFile('./testOutput.json', JSON.stringify(obj, null, 2), err => {
            if(err) {
                console.log(err);
            } else {
                console.log('File written');
            }
        });
    }
})


