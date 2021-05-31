// jshint esversion:6
// We'll use JS, new Date.toLocaleDateString("en-US", {weekday: 'long', year: 'numeric', day: 'numeric', month: 'long'});
// We can write just exports instead of using module.exports

exports.getDateEn=()=> new Date().toLocaleDateString("en-US", {weekday: 'long', day: "numeric", month: "long"});

exports.getDateIn=()=> new Date().toLocaleDateString("hi-IN", {weekday: 'long', day: 'numeric', month: 'long'});
