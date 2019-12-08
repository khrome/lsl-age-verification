var inquirer = require('inquirer');
var fs = require('fs');
var asynk = require('async');
var uuid = require('uuid')

var pick = function(from, amount){
    var results = [];
    while(results.length < amount){
        results.push(
            from[Math.floor(Math.random()*from.length)]
        );
    }
    return results;
}

var askRandomMPQuestionsFrom = function(file, cb){
    //fuck it, let's just leak memory
    var answers = {};
    var allChoices = {};
    fs.readFile(file, function(err, body){
        var data = JSON.parse(body.toString());
        var questions = pick(data, 3).map(function(data){
            var choices = Object.keys(data.options).map(function(key){
                return data.options[key];
            });
            allChoices[data.question] = choices;
            answers[data.question] = data.answer.charCodeAt(0) - ('a'.charCodeAt(0));
            return {
                type: 'list',
                name: data.question,
                message: data.question,
                choices: choices
                // cannot individually validate lists: the author knows better
                // implemented as a Form instead of interactive input: stupidity
            }
        });
        //todo: inquirer completely sucks, replace this bullshit
        asynk.eachOfSeries(questions, function(q, index, complete){
            inquirer.prompt([q]).then(function(userAnswers){
                //we only ever have 1 because inquirer is awesome :P
                var theOnlyFuckingIndex = Object.keys(userAnswers)[0];
                var theseChoices = allChoices[theOnlyFuckingIndex];
                if(!theseChoices){
                    console.log(allChoices, theOnlyFuckingIndex)
                    return cb(new Error('No Choices'));
                }
                var incomingAnswer = theseChoices.indexOf(
                    userAnswers[theOnlyFuckingIndex]
                );
                if(incomingAnswer !==  answers[theOnlyFuckingIndex]){
                    return cb(new Error('Wrong Answer'));
                }
                complete();
            }).catch(function(err){
                throw err;
            });
        }, function(){
            cb();
        });
    })
}

module.exports = function(game){
    return {
        age : function(cb){
            return askRandomMPQuestionsFrom(
                game+'-age-verification.json',
                cb || function(){}
            );
        },
        manual :function(){
            return askRandomMPQuestionsFrom(
                game+'-age-verification.json',
                cb || function(){}
            );
        }
    }
}
