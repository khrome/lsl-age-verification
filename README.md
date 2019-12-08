LSL Age Verification
====================

This module is just a replication of the LSL age verification and copy protection questions.

Go Nostalgia!

Usage
-----

    var verify = require('lsl-age-verification')

then

    verify('lsl1').age(function(err){
        // if there's no err, all questions passed, you must be "of age"
    });

or

    verify('lsl1').manual(function(err){
        // if there's no err, all questions passed, you must own the manual
    });

Enjoy,

- Abbey Hawk Sparrow
