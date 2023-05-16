const express = require('express');
const e = require('express');
const internal = require('stream');

const app = express();

app.get('/mean', (req, res) => {
    let numsList = numsToList(req.query.nums, res);
    let sum = 0;
    for(let val of numsList)
    {
        sum += val;
    }
    res.send('Mean = ' + (sum / numsList.length));
});

app.get('/median', (req, res) => {
    let numsList = numsToList(req.query.nums, res).sort((a,b) => {if(a<b) return -1; if(a>b) return 1; if(a==b) return 0;});
    console.log(numsList);
    let halfwayIndex = Math.floor(numsList.length / 2);
    let median;
    if(numsList.length % 2 == 0)
        median = ((numsList[halfwayIndex] - numsList[halfwayIndex-1])/2.0)+numsList[halfwayIndex-1];
    else
    median = numsList[halfwayIndex];
    
    res.send('Median = ' + median);
});

app.get('/mode', (req, res) => {
    let numsList = numsToList(req.query.nums, res).sort((a,b) => {if(a<b) return -1; if(a>b) return 1; if(a==b) return 0;});
    let mode = new Map();
    for(let val of numsList)
    {
        if(mode.has(val))
            mode.set(val, mode.get(val) + 1);
        else
            mode.set(val, 1);
    }
    
    //the amount of times all numbers show up
    let amount_of_same_numbers = [...mode.values()];
    
    //get the amount of times the most frequent number shows up
    let max_frequency = amount_of_same_numbers.reduce((prev, curr) => {
        if(prev > curr) 
            return prev; 
        else 
            return curr; 
    });

    //delete keys that aren't most frequent
    mode.forEach((value, key, map) => { if(value < max_frequency) map.delete(key); });
    res.send('Mode(s) = ' + [...mode.keys()]);
});

function numsToList(numsString="", response)
{
    if(numsString == null || numsString == "")
    {
        response.statusCode = 400;
        response.send('400 Bad Request: Please include a query parameter under the name nums that is a list of numbers separated by commas!\n');
    }
    else
    {
        for(let i = 0; i < numsString.length; i++)
        {
            if(!((numsString.charCodeAt(i) >= 48 && numsString.charCodeAt(i) <= 57) || (numsString.charCodeAt(i) >= 44 && numsString.charCodeAt(i) <= 46)))
            {
                response.statusCode = 400;
                response.send('400 Bad Request: Nums must be a list of numbers, separated by commas.');
            }
        }
    }
    return numsString.split(',').filter((value) => {return value != '';}).map((value) => {return parseInt(value)});
}

app.listen(3000, function () {
    console.log('App on port 3000!');
});