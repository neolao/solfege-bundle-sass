var solfege = require('solfegejs');
var sass = require('node-sass');

/**
 * The sass engine
 */
var Engine = solfege.util.Class.create(function()
{

}, 'solfege.bundle.sass.Engine');
var proto = Engine.prototype;


module.exports = Engine;
